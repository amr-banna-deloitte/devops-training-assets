
# DevOps Practical Training – End-to-End CI/CD with GitHub Actions & Docker (Azure Optional)

Welcome to the hands-on DevOps module. You'll implement a complete CI pipeline, build and push a container image, and (optionally) deploy to Azure Web App for Containers.

> **Estimated time:** 90–150 minutes (core) + 30–60 minutes (optional Azure deploy)

## Objectives
- Practice branching & Pull Request workflow
- Implement CI with GitHub Actions (install, lint, test, build)
- Publish build artifacts
- Build & push a Docker image to GitHub Container Registry (GHCR)
- **Optional:** Deploy the container to Azure Web App for Containers
- Debug and fix a broken pipeline

## Prerequisites
- GitHub account
- Basic Git knowledge (fork, clone, branch, PR)
- **Optional (for Azure deploy):** Access to an Azure subscription and the following GitHub secrets configured by instructor:
  - `AZURE_CREDENTIALS` – Service principal JSON with `Contributor` permission to a resource group
  - `AZURE_RESOURCE_GROUP` – Resource group name
  - `AZURE_WEBAPP_NAME` – Azure Web App name (Linux, container)

## Repo Layout
```
app/                     # Sample Node.js web app (Express)
  src/
    index.js             # Express app
    server.js            # Server bootstrap
  tests/app.test.js      # Jest tests
  package.json           # Scripts for lint, test, build
  jest.config.js
  .eslintrc.json
  Dockerfile
  .dockerignore
.github/
  workflows/
    ci.yml               # Working pipeline (reference)
    ci_broken.yml        # Broken pipeline – your debugging task
  PULL_REQUEST_TEMPLATE.md
scripts/
  version.sh             # Simple version stamping for artifacts
README.md                # (this file) Participant guide
INSTRUCTOR_GUIDE.md      # Instructor setup & facilitation notes
SOLUTION_KEY.md          # Reference solutions (keep private)
```

---

## Part A – Fork, Clone, and Branch
1. **Fork** this repository to your GitHub account.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/<your-fork>.git
   cd <your-fork>
   ```
3. Create a **feature branch** for your work:
   ```bash
   git checkout -b feature/ci-cd
   ```

---

## Part B – Explore & Run Locally
1. Go to the `app/` folder and install dependencies:
   ```bash
   cd app
   npm ci
   npm run lint
   npm test
   npm run build
   npm start
   ```
2. Visit `http://localhost:3000` and `http://localhost:3000/health` to verify the app is running.

---

## Part C – Create a Working CI Pipeline (from scratch)
> **Goal:** Rebuild a minimal CI pipeline yourself (do not copy the reference yet).

Create `.github/workflows/ci_my.yml` in your fork with these jobs:
- **build-test** (runs on `ubuntu-latest`)
  - Checkout
  - Setup Node.js `18.x`
  - `npm ci`
  - `npm run lint`
  - `npm test -- --ci`
  - `npm run build`
  - Upload artifact: `app/dist/**` with name `app-dist`

- **docker** (needs: build-test)
  - Login to GHCR with `GITHUB_TOKEN`
  - Build image tagged as `ghcr.io/<owner>/<repo>:<short-sha>` and `ghcr.io/<owner>/<repo>:latest`
  - Push both tags

- **deploy-azure** (optional, only on `main`)
  - Login to Azure using `AZURE_CREDENTIALS`
  - Deploy image to Web App `AZURE_WEBAPP_NAME` in `AZURE_RESOURCE_GROUP`

> Tip: Use the reference file `ci.yml` if you get stuck; try first without peeking.

---

## Part D – Debug and Fix the Broken Pipeline
Open `.github/workflows/ci_broken.yml`, run it by pushing a commit, and **fix the issues** until the workflow passes on your fork. Typical problems include:
- Missing checkout
- Wrong Node setup key
- Missing `packages: write` permission
- Installing prod-only dependencies (tests fail)
- Wrong artifact path
- Incorrect GHCR image reference

Commit your fixes to the same feature branch and re-run the workflow.

---

## Part E – PR Workflow
1. Push your branch and open a **Pull Request** to your `main`.
2. Fill the PR template checklist.
3. Ensure CI passes on the PR.
4. Request a peer review and **merge** when approved.

---

## Part F – (Optional) Azure Deployment
> Requires secrets set by instructor (see **INSTRUCTOR_GUIDE.md**).

1. Ensure your image is public in GHCR or provide registry credentials to the Web App.
2. Merge to `main` and observe the `deploy-azure` job.
3. Confirm the app is live at the Web App URL.

---

## Acceptance Criteria
- CI installs, lints, tests, builds
- Artifact `app-dist` is published with contents of `app/dist`
- Docker image is built and pushed to GHCR with two tags (`short-sha` and `latest` on `main`)
- (Optional) Azure deploy succeeds and app responds at `/` and `/health`
- Broken pipeline is corrected and green

Good luck and have fun! 🚀
