# Full Project Documentation — DEPI DevSecOps Project

## Final Toolchain

GitHub → Jenkins → Gitleaks → SonarQube → Docker Build → Trivy → DockerHub → ArgoCD → K3s Kubernetes

## Executive Summary

This project proves a full DevSecOps delivery lifecycle for a multi-container notes application. The pipeline starts with source code in GitHub, continues through Jenkins CI, performs secret scanning with Gitleaks, code quality scanning with SonarQube, Docker image builds, vulnerability scanning with Trivy, image publishing to DockerHub, and Kubernetes deployment through ArgoCD GitOps on a K3s cluster.

## Application

- Frontend: React served by Nginx
- Backend: Go API
- Database: PostgreSQL
- Runtime: Kubernetes on K3s
- Public access: NodePort 30080 with DuckDNS

## Infrastructure

| Server | Purpose | Public DNS |
|---|---|---|
| depi-jenkins-server | Jenkins, Docker builds, Gitleaks, SonarQube, Trivy | depi-jenkins-depi.duckdns.org |
| depi-k3s-server | K3s, ArgoCD, MIND App | depi-k3s-depi.duckdns.org |

## Pipeline Stages

1. Checkout from GitHub
2. Show Workspace
3. Gitleaks Secret Scan
4. SonarQube Code Scan
5. Build Backend Docker Image
6. Build Frontend Docker Image
7. Trivy Image Scan
8. DockerHub Login
9. Push Images to DockerHub

## Kubernetes Resources

- Namespace: mind
- Secret: postgres-secret
- PVC: postgres-pvc
- Deployments: postgres, mind-backend, mind-frontend
- Services: postgres, backend-service, mind-frontend-service

## Security Implementation

- Gitleaks: detects leaked secrets before build
- SonarQube: static code quality and reliability analysis
- Trivy: Docker image vulnerability scanning
- Jenkins Credentials: GitHub, DockerHub, and SonarQube token stored outside source code
- ArgoCD credentials are not stored publicly

## GitOps and Self-Healing

ArgoCD watches the GitHub repository path `k8s`. When a manual drift was introduced by scaling the frontend deployment to zero replicas, ArgoCD detected the change and restored the desired state.

## Final Validation

| Check | Result |
|---|---|
| K3s node | Ready |
| Backend pod | Running |
| Frontend pod | Running |
| PostgreSQL pod | Running |
| ArgoCD | Synced / Healthy |
| API health | 200 OK |
| Gitleaks | No leaks found |
| SonarQube | Analysis successful |
| DockerHub | Backend and frontend images pushed |

## Production Improvements

- Use HTTPS with a real domain
- Store secrets in external secret manager
- Use managed PostgreSQL or HA database
- Use multi-node Kubernetes or EKS
- Use private subnets and least-privilege security groups
- Enable stricter Trivy quality gate
- Use persistent SonarQube database instead of embedded evaluation DB
- Add Prometheus/Grafana monitoring and alerting
- Add backup and disaster recovery policy
