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

