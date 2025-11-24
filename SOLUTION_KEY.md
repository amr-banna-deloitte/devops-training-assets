
# SOLUTION_KEY.md

## Reference Working CI (`.github/workflows/ci.yml`)
- Build & test job uses Node 18, installs dev deps, runs lint & jest, builds, uploads artifact
- Docker job logs in to GHCR with `GITHUB_TOKEN`, builds multi-tag image, pushes
- Deploy job (on `main`) logs in to Azure and sets container image on Web App

## How to Fix `ci_broken.yml`
1. Add `actions/checkout@v4` at start of jobs that need code
2. In `setup-node`, use `node-version: 18.x`
3. Add `permissions: packages: write` at workflow or job level for GHCR push
4. Use `npm ci` (not prod-only) to install dev deps
5. Correct artifact path to `app/dist/**`
6. Use valid image name `ghcr.io/${{ github.repository_owner }}/<repo>`
7. Ensure you `docker/login-action@v3` before push

## Dockerfile Notes
- Use `node:18-alpine`
- Install only production deps in final image for smaller size
- Expose port `3000` and start server

## Azure Deploy Notes
- Requires `AZURE_CREDENTIALS`, `AZURE_RESOURCE_GROUP`, `AZURE_WEBAPP_NAME`
- Make GHCR image public or configure Web App with registry credentials
