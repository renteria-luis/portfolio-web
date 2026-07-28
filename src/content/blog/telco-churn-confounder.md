---
title: "The feature that predicted churn best explained it worst"
description: "Contract length dominated every importance ranking in my churn model. It turned out to be a legal exit barrier, not a loyalty signal, and it was hiding every real reason customers leave."
date: 2026-01-20
project: telco-churn
tags: [Churn, Confounders, SHAP, Ensembles, scikit-learn]
lang: en
readingMinutes: 9
tldr:
  - Contract length dominated every importance ranking, but it measures a legal exit barrier rather than loyalty, so it was drowning out every behavioural signal.
  - Refitting on only the month-to-month segment, where customers are free to leave, surfaced referrals and price sensitivity as the real drivers.
  - The business recommendation flips: not "push longer contracts", which buys 24 months of silence, but "invest in referral programs".
tldrMetrics:
  - Recall = 87%
  - ROC-AUC = 0.906
  - Threshold = 0.3
  - Models compared = 6
---

I built a churn model on the IBM Telco dataset. The ensemble catches 87% of churners at 0.906 ROC-AUC, which is a respectable number and not what this post is about.

This post is about the moment the feature importances came back and the top bar was so tall that everything else looked like noise, and how that turned out to be the model telling me something true and useless at the same time.

## The dominant feature

![SHAP summary: contract_length dominates every other feature](/writeups/telco-shap.webp)
*One bar so tall the rest look like noise. It is a real signal and a useless explanation.*

`contract_length` outranked everything. Feature importances agreed, SHAP agreed, every model agreed. If you were skimming, you would write "contract length is the strongest predictor of churn" in the summary slide and move on.

Then you ask what it means for a customer on a two-year contract to not churn.

It means they signed a contract. It does not mean they are happy, or loyal, or getting value. It means leaving is expensive and inconvenient, so they stay. **The variable is measuring a legal exit barrier and I was reading it as a loyalty signal.**

That is a confounder in the textbook sense. Contract length affects churn directly through the exit cost, and it correlates with everything else the model might have learned about satisfaction. Its explanatory power drowns out the actual behavioural drivers, and because it predicts well, nothing in the metrics tells you anything is wrong.

## Two populations, one model

The hypothesis I ended up with is that the dataset contains two different retention mechanics that a single model was averaging together.

**Long-term contracts produce forced retention.** These customers are staying because of the terms. Their satisfaction is essentially invisible: an unhappy customer on month 8 of 24 behaves identically to a happy one. Their dissatisfaction only becomes an observable event at renewal, which is outside this dataset's window.

**Month-to-month produces organic retention.** These customers can leave at the end of any billing cycle and choose not to. Every month they stay is a decision. This is the only segment where retention actually carries information about the customer's experience.

Mixing them means the model learns "contract equals stays", which is true, and stops there.

## The experiment

Isolate the month-to-month segment, refit, and look at what comes forward once the exit barrier is gone.

![Churn drivers within the month-to-month segment: referrals and price sensitivity](/writeups/telco-organic-drivers.webp)
*The same model, fitted only on customers who are free to leave. Different answer.*

Two things did:

**Number of referrals.** Customers who brought other people onto the network churn far less. This is a social tie, not a contractual one, and it is the more interesting of the two because it is a barrier the company can build without a contract and without discounting.

**Price sensitivity.** Monthly charge relative to services used. Unsurprising, but now measurable in a segment where the customer can actually act on it.

The business recommendation flips completely. The naive reading of the original model is "push customers onto longer contracts", which does reduce measured churn and does absolutely nothing about the underlying dissatisfaction. It buys 24 months of silence.

The reading after segmenting is **"invest in referral programs"**. A customer with friends on the network has a real reason to stay that costs no margin, unlike a discount, and does not expire, unlike a contract.

## The model, and why it is not the best one

Six models, all evaluated at the operating threshold of 0.3, on a held-out set of 1,761 customers of whom 467 churned:

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Dummy (baseline) | 0.735 | 0.000 | 0.000 | 0.000 | 0.500 |
| Logistic Regression | 0.731 | 0.497 | **0.934** | 0.648 | 0.899 |
| Random Forest | 0.690 | 0.458 | 0.931 | 0.614 | 0.870 |
| Gradient Boosting | **0.825** | **0.631** | 0.818 | **0.713** | **0.907** |
| XGBoost | 0.822 | 0.626 | 0.818 | 0.709 | 0.903 |
| **Soft Voting (shipped)** | 0.793 | 0.571 | 0.874 | 0.691 | 0.906 |

![ROC curves for the models tested](/writeups/telco-roc.webp)
*The curve climbs steeply enough that recall can reach roughly 90% while misclassifying about 20% of healthy customers. That shape is what made a 0.3 threshold viable.*

Gradient Boosting wins on accuracy, precision and F1. I shipped the ensemble.

The individual models fail in opposite directions. Random Forest is paranoid: 93% recall, but it flags so many contented customers that a retention budget evaporates on people who were never going anywhere. Gradient Boosting and XGBoost are the mirror image, precise and calm, quietly letting 18% of churners walk out the door.

The soft-voting ensemble sits between the two. It catches 408 of 467 churners while raising 306 false alarms. That is the shape of the trade I wanted, and no single model produced it.

## The threshold, again

Same argument as [the fraud model](/blog/fraud-detection-threshold), different numbers. A false positive costs one retention offer sent to somebody who was staying. A false negative costs the entire remaining lifetime value of a customer who left without anyone noticing. Moving from 0.5 to 0.3 took the ensemble from catching roughly four out of five churners to catching seven out of eight.

One methodological note that matters more than it sounds:

**I did not use cross-validation scores to pick the final model.** `cross_val_score` applies a 0.5 threshold internally. It reports how well a model would do at an operating point I had already decided not to use, which makes it an answer to a question about a model nobody was going to deploy. Model selection was done on held-out predictions evaluated at 0.3, the number actually being shipped.

Cross-validation still earned its keep during hyperparameter search, where the comparison is between configurations of the same model and the threshold effect is roughly constant. It just does not get to make the final call.

## Deleting the easy answers

The IBM dataset ships with columns that make this problem trivial and worthless:

| Dropped | Why |
|---|---|
| `churn_reason`, `churn_category` | Only populated **for customers who already churned**. A perfect predictor of an event that has already happened. |
| `customer_status` | Restates the target. |
| `churn_score` | A pre-existing internal churn score. Predicting a score with a model is not predicting churn. |
| `satisfaction_score` | Derived from the same internal process that produced the label. |
| `cltv` | Derived metric built from other internal variables. |

Any of those would have produced a stunning ROC-AUC and zero insight. `churn_reason` alone gets you near-perfect classification, because it is non-null exactly when the answer is yes.

Leakage in a portfolio project is usually not deception, it is not having asked where each column comes from and when it becomes available. The test I applied to every field: *at the moment I need this prediction, does this value exist yet?* Five columns failed.

## One loose thread

XGBoost, alone among the six models, flagged **senior citizens** as a high-risk segment. The linear and bagged models did not pick it up, which suggests a non-linear interaction rather than a main effect.

I do not have enough to explain it. The plausible readings are UX friction, billing complexity, or a support experience that works worse for that group. All three are customer-service problems rather than pricing problems, and all three are testable with a service audit rather than a model.

I left it in the conclusions as an open question instead of inventing a story for it. A model that surfaces a question you cannot yet answer has still done something useful.

---

*Code, notebooks and figures: [github.com/renteria-luis/telco-churn-prediction](https://github.com/renteria-luis/telco-churn-prediction)*
