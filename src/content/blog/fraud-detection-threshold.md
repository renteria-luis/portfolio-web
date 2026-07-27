---
title: "Why my fraud model uses a 0.2226 threshold"
description: "The default 0.5 threshold assumes a false alarm and a missed fraud cost the same. They do not. Here is how I picked the number, and why I shipped the model that scored worse."
date: 2026-03-14
project: fraud-detection
tags: [XGBoost, Imbalanced data, Threshold tuning, FastAPI, Docker]
lang: en
readingMinutes: 8
---

Every binary classifier ships with a hidden assumption. `model.predict()` returns a class, not a probability, and to get there it compares the probability against 0.5. That number is a default, not a decision, and almost nobody questions it.

In fraud detection it is the wrong number, and it is wrong in a direction that costs money.

## The asymmetry nobody encodes

A fraud model makes two kinds of mistake.

A **false positive** flags a legitimate transaction. Somebody in the fraud team opens a case, looks at it for two minutes, and closes it. The cost is a few minutes of an analyst's time, plus some irritation if the customer's card got held.

A **false negative** lets a real fraud through. The money is gone. Nobody opens a case because nobody knows anything happened.

Those two are not remotely equal, and yet a 0.5 threshold treats them as if they were. It is the operating point you would choose if you believed a wasted analyst-minute and a stolen transaction were worth exactly the same.

So the question is not "is my model good", it is **"where on the precision/recall curve do I want to sit"**. That is a business decision wearing a technical costume.

## What the curve actually looked like

The model is an XGBoost classifier trained on PaySim, a synthetic mobile-money dataset. After filtering, fraud is 0.29% of transactions, a **349:1 imbalance**. Accuracy is meaningless here: predicting "legitimate" for everything scores 99.7% and catches nothing.

At the default threshold the model was already good:

| Threshold | Precision | Recall | F1 |
|---|---|---|---|
| 0.5 (default) | 0.93 | 0.79 | 0.85 |
| **0.2226 (shipped)** | **0.84** | **0.85** | **0.84** |

Read that as an exchange rate. Dropping the threshold gave up **9 points of precision** to buy **6 points of recall**.

Six points of recall means six percent of all fraud in the test set going from undetected to caught. Nine points of precision means a larger pile of false alarms on an analyst's desk. If you believe the asymmetry above, that trade is obviously worth taking, and it is worth taking well past the point where F1 says stop.

Which is the other thing worth saying: **F1 got slightly worse**, from 0.85 to 0.84. F1 is the harmonic mean of precision and recall, so it bakes in the assumption that both matter equally, the same assumption that made 0.5 wrong in the first place. Optimising F1 here would have meant optimising for a cost model I had already rejected.

The number 0.2226 itself is not magic. It came from sweeping the threshold across the precision/recall curve and picking the point where recall crossed 85% while precision was still above 80%. Below that the precision collapse accelerates and the alert queue stops being workable.

## The model that won on paper and lost anyway

I benchmarked four models at the same threshold:

| Model | Precision | Recall | F1 | PR-AUC |
|---|---|---|---|---|
| Logistic Regression | 0.65 | 0.40 | 0.50 | 0.48 |
| Random Forest | 0.76 | 0.78 | 0.77 | 0.81 |
| **XGBoost (default params)** | **0.84** | **0.85** | **0.84** | **0.91** |
| XGBoost (Optuna tuned) | 0.24 | 0.98 | 0.39 | **0.92** |

The tuned XGBoost has the best PR-AUC. It is, by the headline metric, the winner. I shipped the other one.

PR-AUC integrates performance over *every* threshold. It answers "how well does this model separate the classes in general". That is a fine question when you are comparing architectures and a useless one when you have to pick a single operating point and defend it.

The tuned model reached 0.98 recall at 0.24 precision, meaning **three out of four alerts were false**. Worse, its precision curve was badly behaved at low thresholds: small changes in the threshold produced large, non-monotonic swings in precision. There was no stable point to stand on. A model whose behaviour you cannot predict when you nudge a parameter is a model you cannot operate, whatever its area under the curve.

The default-parameter XGBoost had a smooth, boring curve. Boring is a feature. It means next quarter, when someone asks "what happens if we move the threshold to 0.25", there is an answer.

## Three things the EDA decided before any model ran

The threshold work is the interesting part, but most of the actual performance came from decisions made before training.

**Fraud only exists in two transaction types.** `TRANSFER` (0.77% fraud rate) and `CASH_OUT` (0.18%). `PAYMENT`, `CASH_IN` and `DEBIT` had exactly zero fraudulent records. Not "few". Zero. I dropped those rows entirely rather than letting the model learn to discriminate against noise. The imbalance went from roughly 800:1 to 349:1 for free, and every subsequent metric got easier to read.

**Fraud does not sleep.** Legitimate transactions follow a clean circadian rhythm, busy during the day, quiet at night. Fraud is completely flat across all 24 hours. That is not a human pattern, it is an automated one, and it makes `is_night` a genuinely informative feature: between midnight and 6am the ratio of fraud to legitimate traffic is far higher simply because the humans went to bed.

**The dataset had a lie in it.** Legitimate transaction volume drops off a cliff after day 17 of the simulation. Fraud keeps going to day 30. That is an artifact of the PaySim generator, not a property of fraud, and any model trained on the full range would have learned a beautiful, completely fake rule: *late in the month means fraud*. I truncated the data at the last step where legitimate traffic still exists.

That last one is the reason I distrust benchmark scores on synthetic data. The 0.91 PR-AUC is real for this dataset. How much of it survives contact with real transactions is an open question, and pretending otherwise would be dishonest.

## Documenting leakage instead of hiding it

Several of the strongest features are balance-derived: `dest_was_empty` (the receiving account had zero before the transfer), `log_dest_balance`, `amount_to_dest_ratio`.

`dest_was_empty` is a genuine mule-account signal and it is available before the transaction settles, so it is legitimate. But in PaySim it is *artificially* predictive, because the generator creates mule accounts with a pattern that is more consistent than reality would be.

I kept those features and wrote down why in the notebook, along with which ones I expect to degrade on real data. The alternative, dropping anything that smells like leakage, would have thrown away real signal. The alternative to that, keeping them quietly, produces a number that looks great in a portfolio and falls apart the first time somebody deploys it.

## What is deployed

The model runs behind FastAPI with Pydantic validation, containerised in a multi-stage, non-root Docker image, with a Streamlit demo live on Hugging Face Spaces.

```json
POST /predict
{
  "fraud_probability": 0.9341,
  "is_fraud": true,
  "threshold_used": 0.2226,
  "version": "1.0.0"
}
```

The API returns the probability **and** the threshold it applied, not just the boolean. If somebody downstream disagrees with my cost assumptions, they have the raw number and can pick their own operating point. Baking 0.2226 into the response and hiding the probability would make my judgement call permanent for everyone who consumes the endpoint.

That is the general principle behind all of this: **a threshold is a business decision, and it should be visible, movable and written down.** The model gives you a probability. Turning it into a yes or no is a separate act, and it deserves a separate argument.
