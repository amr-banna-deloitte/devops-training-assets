
# INSTRUCTOR_GUIDE.md

## Overview
This guide helps you provision optional Azure resources, set up GitHub secrets, and facilitate the exercise.

### Suggested Flow (120–180 min)
1. **Intro & repo tour** (10 min)
2. **Local run** (15 min)
3. **CI from scratch** (35–45 min)
4. **Break** (10 min)
5. **Fix broken pipeline** (25–35 min)
6. **PR workflow** (10–15 min)
7. **Optional Azure deploy** (20–30 min)

## GitHub Settings
- Require PR reviews (Settings → Branches → Rules)
- Enable Actions for the repository
- For GHCR push, ensure workflow `permissions` includes `packages: write` or set repo → Settings → Actions → General → Workflow permissions → **Read and write**

## Azure (Optional)
Create a resource group and Linux Web App for Containers:
```bash
# Login and set subscription
az login
az account set --subscription <SUBSCRIPTION_ID>

# Resource group
az group create -n <RG_NAME> -l <REGION>

# App Service Plan (Linux)
az appservice plan create -g <RG_NAME> -n <PLAN_NAME> --sku B1 --is-linux

# Web App for Containers
az webapp create -g <RG_NAME> -p <PLAN_NAME> -n <WEBAPP_NAME> -i ghcr.io/<owner>/<repo>:latest --runtime ""
```
> Note: You can set the image after creation if you prefer.

### Service Principal for GitHub Action
Create a service principal and store JSON in `AZURE_CREDENTIALS` secret:
```bash
az ad sp create-for-rbac \
  --name "github-actions-sp" \
  --role contributor \
  --scopes /subscriptions/<SUB_ID>/resourceGroups/<RG_NAME> \
  --sdk-auth
```
This outputs JSON; add it as GitHub secret `AZURE_CREDENTIALS`. Also add:
- `AZURE_RESOURCE_GROUP`: `<RG_NAME>`
- `AZURE_WEBAPP_NAME`: `<WEBAPP_NAME>`

### Make GHCR Image Public (optional)
In the GitHub repo → **Packages** → select image → change visibility to **public** (simplifies Web App pull permissions).

## Assessment Rubric
- **CI completeness (40%)**: install, lint, test, build, artifact
- **Containerization (25%)**: correct Dockerfile, build & push, two tags
- **Debugging (20%)**: broken pipeline fixed with clear commit messages
- **PR workflow (15%)**: template usage, meaningful description, peer review

## Common Pitfalls & Hints
- Missing `actions/checkout` → nothing to build
- Wrong `setup-node` key (`node` vs `node-version`)
- Not granting `packages: write` → GHCR push fails
- Using `npm install --production` → dev deps (jest/eslint) missing
- Wrong artifact path (should be `app/dist/**`)
- Image name must be lowercase and include registry prefix `ghcr.io/<owner>/<repo>`
