# WEXA-AI-DevOps-Assessment

**Project Title:** Containerize and Deploy a Next.js Application using Docker, GitHub Actions, and Minikube

**GitHub Repository:** [https://github.com/rajeshkurumoju/WEXA-AI-DevOps-Assessment.git](https://github.com/rajeshkurumoju/WEXA-AI-DevOps-Assessment.git)

---

## Objective

This project demonstrates the end-to-end process of:

* Creating a simple **Next.js** application.
* Containerizing it using **Docker**.
* Automating the build and image push to **GitHub Container Registry (GHCR)** with **GitHub Actions**.
* Deploying the containerized application to **Kubernetes (Minikube)** using manifests.

---

## Step 1: Create Next.js Application

```bash
# Clone repository
git clone https://github.com/rajeshkurumoju/WEXA-AI-DevOps-Assessment.git
cd WEXA-AI-DevOps-Assessment

# Initialize Next.js app
npx create-next-app@latest .

# Run the app in development mode
npm run dev
# App runs at http://localhost:3000
```

---

## Step 2: Dockerize the Application

Create a **Dockerfile** in the root directory.

```dockerfile
# Stage 1 - Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2 - Production
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Build and Run the Docker Container Locally

```bash
docker build -t wexa-nextjs-app:latest .
docker run -d -p 3000:3000 wexa-nextjs-app:latest
# Access the app at http://localhost:3000
```

---

## Step 3: GitHub Actions for CI/CD

Create a workflow file at `.github/workflows/docker-build.yml`.

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/wexa-nextjs-app:latest
            ghcr.io/${{ github.repository_owner }}/wexa-nextjs-app:${{ github.sha }}
```

After pushing this workflow to GitHub, the pipeline automatically builds and pushes the Docker image to **GitHub Container Registry (GHCR)**.

---

## Step 4: Kubernetes Deployment Files

Create a folder named `k8s/` and add the following files.

### k8s/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wexa-deployment
  labels:
    app: wexa
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wexa
  template:
    metadata:
      labels:
        app: wexa
    spec:
      containers:
        - name: wexa-container
          image: ghcr.io/rajeshkurumoju/wexa-nextjs-app:latest
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
```

### k8s/service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: wexa-service
spec:
  selector:
    app: wexa
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30080
  type: NodePort
```

---

## Step 5: Deploy to Minikube

Start Minikube and deploy the application.

```bash
# Start Minikube
minikube start --memory=4096mb

# Verify cluster
kubectl get nodes

# Load local image into Minikube (if not using GHCR)
docker build -t ghcr.io/rajeshkurumoju/wexa-nextjs-app:latest .
minikube image load ghcr.io/rajeshkurumoju/wexa-nextjs-app:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify pods and services
kubectl get pods
kubectl get svc

# Wait for rollout to complete
kubectl rollout status deployment/wexa-deployment
```

---

## Step 6: Access the Application

Expose and access the service in your browser.

```bash
minikube service wexa-service --url
```

Output example:

```
http://192.168.49.2:30080
```

Open this URL in a web browser to view the deployed Next.js app running on Kubernetes.

---

## Step 7: Useful Commands

```bash
# Check logs of running pod
kubectl logs -l app=wexa

# Describe pod for debugging
kubectl describe pod <pod-name>

# Delete all resources
kubectl delete -f k8s/
```

---

## Step 8: Cleanup

To stop and clean your Minikube cluster:

```bash
minikube stop
minikube delete
```

---

## Project Summary

This project successfully demonstrates a complete **CI/CD pipeline** for a Next.js application, including:

* Application creation using Next.js.
* Containerization with Docker.
* Automated image build and push using GitHub Actions.
* Kubernetes deployment on Minikube.

You can now access the running application using the NodePort service provided by Minikube.

## ✅ Deployment Verification

![Deployment Screenshot](https://github.com/rajeshkurumoju/WEXA-AI-DevOps-Assessment/blob/main/WEXA-AI-APP-Deployment.png)
