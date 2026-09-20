# DEPI DevSecOps Visual Showcase

[![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)](https://react.dev/)
[![Security](https://img.shields.io/badge/Public-Sanitized-2ea44f)](#)

A lightweight React + Vite visual documentation portal for the [MIND Notes App DevSecOps project](https://github.com/fadyy2k/depi-mind-app-v2).

## Purpose

This repository is the presentation layer, not the infrastructure source of truth. It turns the project architecture, pipeline stages, security controls, Kubernetes/GitOps flow, and evidence into an engineer-friendly visual walkthrough.

## Local Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

The app is compatible with static hosting such as Vercel or GitHub Pages.

## Security Boundary

The public showcase must not contain:
- live CI/CD, Kubernetes, observability, or admin endpoints
- passwords or demo credentials
- SSH keys, tokens, cloud account identifiers, or private IP plans
- screenshots containing secrets or authenticated session data

Use sanitized labels and architecture diagrams instead of operational URLs.

## Source Project

For the complete Jenkins → security scanning → Docker → ArgoCD → Kubernetes implementation, see **[depi-mind-app-v2](https://github.com/fadyy2k/depi-mind-app-v2)**.
