# kubernetes_prometheus_configuration

## Overview

This project demonstrates the setup and basic functionality of Prometheus for monitoring a Kubernetes cluster and services. The implementation includes a Prometheus server, Node.js applications for simulating requests, and a configuration setup for Kubernetes.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Next Steps](#next-steps)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before getting started, ensure you have the following installed:

- [Kubernetes](https://kubernetes.io/)
- [Docker](https://www.docker.com/)
- [Prometheus](https://prometheus.io/)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Arcaici/kubernetes_prometheus_configuration
   cd prometheus-project
```
2. Apply the prometheus configuration & release:
   ```bash 
    kubectl apply -f prometheus_full_setup.yml
   ```
3. Apply the Kube-state-metrics configuration
  ```bash
    kubectl apply -f kubestatemetrics_full_setup.yml
 ```
