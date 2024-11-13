# Kubernetes Cluster Monitoring with Prometheus and Grafana
This project provides step-by-step instructions for setting up a monitoring solution for a Kubernetes cluster using Prometheus and Grafana. It covers the installation of Prometheus and Grafana via Helm, configuration of monitoring namespaces and services, and the creation of dashboards to visualize cluster metrics.

## Introduction

With multiple environments like development, staging, and production, managing Kubernetes clusters efficiently requires robust monitoring tools. This project implements monitoring with **Prometheus** and **Grafana** to track cluster health and services, enabling rapid issue diagnosis and observability for Kubernetes environments.

## Prerequisites

- **Kubernetes Cluster** (using **Minikube** in this guide)
- **Helm CLI** for managing deployments on the Kubernetes cluster

**Note**: If using an **M1 Mac**, the **qemu2 driver** may be preferable due to networking issues with Minikube's default Docker driver.

## Architecture Overview

The solution architecture involves deploying **Prometheus** and **Grafana** on a Kubernetes cluster using **Helm charts**. Metrics are scraped by Prometheus, and Grafana is configured as a data source to visualize these metrics, including custom dashboards for detailed insights.

## Installation

### Start Minikube

To launch a Minikube cluster:

```bash
minikube start
```
## Install Helm
Helm is required to deploy Prometheus and Grafana. Install it via:
```bash
brew install helm
```
## Install Kubectl
```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```
## Install Prometheus
Add the Prometheus Helm Chart Repository:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```
## Update Helm Repositories: 
```bash
helm repo update
```
##Install Prometheus on the Cluster:
```bash
helm install prometheus prometheus-community/prometheus --namespace monitoring

```
##Expose Prometheus Service:

To access Prometheus externally, convert the prometheus-server service to NodePort:
```bash
kubectl expose service prometheus-server --namespace monitoring --type=NodePort --target-port=9090 --name=prometheus-server-ext
```
## Install Grafana
Add the Grafana Helm Chart Repository:
```bash
helm repo add grafana https://grafana.github.io/helm-charts
```
## Install Grafana on the Cluster
```bash
helm install grafana grafana/grafana --namespace monitoring
```
## Expose Grafana Service:
Convert the Grafana service to NodePort:
```bash
kubectl expose service grafana --namespace monitoring --type=NodePort --target-port=3000 --name=grafana-ext
```




