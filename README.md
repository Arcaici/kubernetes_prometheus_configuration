# kubernetes_prometheus_configuration

## Overview

This project demonstrates the setup and basic functionality of Prometheus for monitoring a Kubernetes cluster and services. The implementation includes a Prometheus server, Node.js applications for simulating requests, and a configuration setup for Kubernetes.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Next Steps and Conclusions](#Next-Steps-and-Conclusion)

## Prerequisites

Before getting started, ensure you have the following installed:

- [Kubernetes](https://kubernetes.io/)
- [Docker](https://www.docker.com/)

## Setup

1. Clone the repository:
   ```bash
    git clone https://github.com/Arcaici/kubernetes_prometheus_configuration
    cd kubernetes_prometheus_configuration
   ```
2. Apply the prometheus configuration & release:
   ```bash 
    kubectl apply -f prometheus_full_setup.yml
   ```
3. Apply the Kube-state-metrics configuration:
   ```bash
    kubectl apply -f ./kubestatemetricservice/kubestatemetrics_full_setup.yml
   ```
4. Apply the simulation server:
   ```bash
    docker build -t simulation-server ./serviceToScrape/
    kubectl apply -f ./serviceToScrape/simulation_deployment.yml
   ```
5. Apply JSON pseudo storage service
   ```bash
    docker build -t json-data-server ./pseudoStorageService/
    kubectl apply -f ./pseudoStorageService/jsonstorage_deployment.yml
   ```
## Project Structure
* **prometheus_full_setup.yml**: Kubernetes file for ClusterRole, Service and Deployment configuration for Prometheus.
* **kubestatemetrics_full_setup.yml**: Kubernetes file for ClusterRole, Service and Deployment configuration Kube-State-Metrics service.
* **simulation_deployment.yml**: Kubernetes deployment running a NodeJS server with prometheus custom metrics.
* **jsonstorage_deployment.yml**: Kubernetes deployment running a NodeJS server with query to Prometheus promQL endpoint that save query results in JSON format.

## Usage
1. Using the **simulation_script.py** for test the custom metrics you need first to use kubernetes port-farwarding:
   ```bash
    kubectl port-forward -n simulation deployment.apps/simulation 8081:3000
   ```
   and then run the python script.
2. If you want to access prometheus console and GUi you need to port-forward to
   ```bash
    kubectl port-forward deployment.apps/prometheus 8080:9090 -n monitoring
   ```
   and then access from your web browser to http://localhost:9090
3. If you want to check the last prometheus metrics saved from pseudo storage service you need to forward:
   ```bash
    kubectl port-forward -n monitoring service/json-data-server-service 3001:3001
   ```
   and then access from your web browser to http://localhost:3001/lastdata

## Next Steps and Conclusion
Using a Node.js server to store long-term time series data is not the recommended approach; typically, tools like Thanos or Grafana are employed for such purposes. In this case, I chose not to implement additional services to avoid complicating the situation and exceeding the scope of the guide. Exploring how Thanos, coupled with Prometheus, can enhance the monitoring system could be an interesting avenue for further study

