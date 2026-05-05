# MediSynth AI – Privacy-Preserving Healthcare Data Generator

## Introduction

Healthcare data is highly sensitive and strictly regulated under laws such as HIPAA and GDPR. These restrictions limit data sharing and slow down AI-driven innovation in healthcare.

MediSynth AI addresses this problem by generating synthetic healthcare data while ensuring strong privacy guarantees. The system combines synthetic data generation, differential privacy, machine learning validation, and federated learning to enable safe and scalable data usage.

The goal of this project is to balance privacy and utility, ensuring that data remains secure while still being useful for machine learning applications.


## Features

* Synthetic data generation using CTGAN
* Differential privacy with budget tracking
* Statistical similarity validation (KS test, correlation analysis)
* Machine learning utility validation
* Privacy attack resistance (membership, attribute, re-identification)
* Federated learning simulation across multiple hospitals
* Download option for generated datasets

---

## Methodologies Used

### Synthetic Data Generation (CTGAN)

The system uses Conditional Tabular GAN (CTGAN) to learn the distribution of real healthcare data and generate realistic synthetic datasets. It supports both numerical and categorical features.

---

### Differential Privacy

Differential privacy is applied to ensure that individual data points cannot be identified.

* Laplace and Gaussian mechanisms are supported
* Privacy parameters include epsilon (ε) and delta (δ)
* Privacy budget is tracked to prevent excessive data exposure

---

### Statistical Similarity Validation

This module evaluates how closely synthetic data matches real data.

* KS Test for distribution comparison
* Correlation Mean Absolute Error (MAE)
* Mean and variance comparison

---

### Machine Learning Utility Validation

The system uses a Train on Synthetic, Test on Real (TSTR) approach.

* Models are trained on synthetic data
* Evaluated on real data
* Metrics include accuracy, F1 score, and ROC-AUC

This ensures the synthetic data is useful for real-world applications.

---

### Privacy Attack Resistance

The system evaluates privacy risks using:

* Membership Inference Attack
* Attribute Inference Attack
* Re-identification Risk

These checks ensure that synthetic data does not leak sensitive information.

---

### Federated Learning

The system simulates multiple hospitals collaborating without sharing raw data.

* Each participant trains locally
* Only model updates are shared
* Aggregation is done using the FedAvg algorithm
* Differential privacy can also be applied to model updates

---

## System Architecture

Real Data
→ CTGAN + Differential Privacy
→ Synthetic Data
→ Validation (Statistical + ML Utility)
→ Federated Learning Integration

---

## Tech Stack

* Backend: Flask
* Frontend: HTML, CSS, JavaScript
* Machine Learning: scikit-learn
* Synthetic Data: SDV (CTGAN)
* Deployment: (Render / Railway)

---

## Results

* Balanced privacy and utility trade-off
* Improved machine learning utility after tuning
* Synthetic data usable for downstream tasks
* Strong resistance to privacy attacks

---

## Output Screenshots

Its in the Output Images Folder

## How to Run Locally

git clone https://github.com/chiranthgowdas/-Medsynth-AI
cd your-repo
pip install -r requirements.txt
python app.py

---

## Key Insights

* Perfect statistical similarity does not guarantee privacy
* Strong privacy reduces utility
* A balanced approach is required for real-world applications

---

## Future Improvements

* Improve CTGAN training stability
* Support larger datasets
* Enhance federated learning capabilities
* Improve visualization and analytics

---

## Team

Sentinels

Jeevan M
Chiranth Gowda S
Harshith K

## Conclusion

MediSynth AI demonstrates how synthetic data generation, differential privacy, and federated learning can be combined to enable secure and scalable AI in healthcare.

The system focuses on maintaining a balance between privacy protection and practical usability.