## CI/CD Pipeline and Security Scans

The screenshots capture my current automation stack across GitHub Actions, EC2, container security scans, and Aikido monitoring. This document summarizes the exact flow illustrated there so anyone can reproduce the deployment runbooks and security gates.

---

### 1. Pipeline Triggers

- **Branches**
  - `staging`: automatically deployed to the staging EC2 instance.
  
- **GitHub Actions Workflow (`.github/workflows/deploy.yml`)**
  - Trigger: `push` to `staging` or manual `workflow_dispatch`.
  - Job `deploy` executes on `ubuntu-latest`.
  - Uses `appleboy/ssh-action@v1.0.3` to SSH into the EC2 host with secrets `EC2_HOST`, `EC2_USER`, and `EC2_SSH_KEY`.
  - Remote script executed: `bash restart-server.sh`.


![GitHub Actions deploy workflow](../assets/images/CI-CD-pipeline.png){width='1000', height='1000'}

---

### 2. Remote Deployment Script (`restart-server.sh`)

Located on the EC2 instance (`~/restart-server.sh`) and echoed in the screenshot:

```bash
#!/bin/bash
set -e

cd ~/mindease-backend || exit
git pull origin staging
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
source .venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
pm2 restart mindease-backend
pm2 save
```

**Notes**
- Uses `pm2` to manage the Django application process.
- Pulls the latest code from `staging`, installs dependencies, applies migrations, then restarts.
- `set -e` ensures the SSH action fails if any step fails.

 
![Restart script output on EC2](../assets/images/CI-CD-pipeline-restart-server.png){width='500', height='100'}

---

### 3. Continuous Integration Checks

| Stage | Tool / Command | Evidence |
|-------|----------------|----------|
| Dependency scan | `docker run --rm -v "$(pwd)":/code aquasec/trivy repo -o test.json ./` | `test.json` report (frontend & backend) shows package scans with **0 vulnerabilities**. |
| Static Analysis | `docker run --rm -v "$(pwd)":/src returntocorp/semgrep semgrep scan --config=auto /src` | Terminal capture: 231 rules, 0 findings (frontend) & 332 rules, 0 findings (backend). |
| SAST | **Aikido** repositories dashboard (frontend + backend) | Issues list: e.g., “rollup XSS attack possible” (front), “Docker runs as root / GitHub action pinning / generic API key” (back). |
| DAST | **Aikido Domain Scan** `https://mindease-mental-care.vercel.app/login` | Screenshot shows “Great! No issues found on this domain.” |
| Secrets Scan | Trivy includes secret scanning (enabled in logs). |



![Semgrep frontend scan result](../assets/images/semgrep-frontend.png){width='1000', height='1000'}

![Trivy frontend report](../assets/images/trivy-frontend.png){width='1000', height='1000'}

![Semgrep backend scan result](../assets/images/semgrep-backend.png){width='1000', height='1000'} 

![Trivy backend report](../assets/images/trivy-backend.png){width='1000', height='1000'}

---

### 4. Security Gates (SAST & DAST)

#### Static Application Security Testing (SAST)
- **Tools**: Semgrep (local/CI), Aikido repo scan, Trivy (dependency + secret scan).
- **Frequency**: every PR push, nightly scheduled scans.
- **Blocking Criteria**:
  - Semgrep findings > 0 => PR must be fixed before merge (CI fails).
  - Aikido issues triaged by severity: Medium and above block release; Low severity logged in backlog.

 
![Aikido repositories overview](../assets/images/aikido-repositories.png)
![Aikido frontend repository issues list](../assets/images/aikido-frontend-repo-issues.png)
![Aikido backend repository issues list](../assets/images/aikido-backend-repo-issues.png)

#### Dynamic Application Security Testing (DAST)
- **Tool**: Aikido Domain Scan.
- **Scope**: currently `https://mindease-mental-care.vercel.app/login`.
- **Frequency**: nightly + on-demand before release.
- **Blocking Criteria**: Any High/Critical DAST finding halts promotion to production until resolved.


![Aikido domain](../assets/images/aikido-frontend-domain.png)
![Aikido domain scan results](../assets/images/aikido-domain-scan.png)

---

### 5. Deployment Flow (end-to-end)

1. **Developer Workflow**
   - Create feature branch from `main`.
   - Run `npm run test`, `pytest`, Semgrep, and Trivy locally (matching CI commands).
   - Open PR → GitHub Actions executes CI jobs.

2. **Merge to `staging`**
   - GitHub Actions `deploy` job triggers.
   - SSH to EC2 and runs `restart-server.sh`.
   - Backend restarts under PM2; frontend preview already available via Vercel.
   - Aikido kicks off automatic repo/domain scans (seen in dashboard).

3. **Verification**
   - QA checks staging (auth, booking, mood, recommendations).
   - Check Aikido dashboards for unresolved issues (e.g., medium severity “Rollup XSS possible”).

4. **Promote to Production**
   - After QA sign-off + zero open blocking issues, tag release.
   - Similar deploy job targets production environment (future enhancement: separate workflow or environment).

---

### 6. Current Open Security Items 

| Repo | Issue | Severity | Location | Action |
|------|-------|----------|----------|--------|
| `mindease-frontend` | Rollup: XSS attack possible | Medium | Aikido issue feed | Investigate Rollup config, apply sanitize plugin or CSP. |
| `mindease-backend` | Docker runs as root | Medium | `Dockerfile` | Create non-root user in image. |
| `mindease-backend` | 3rd party GitHub Action should be pinned | Medium | `deploy.yml` | Pin action SHA (`appleboy/ssh-action@v1.0.3`). |
| `mindease-backend` | Generic API key detected | Low | `test_accounts_api.py` | Remove or mask placeholder key. |

All other scans show **0 issues** (Semgrep, Trivy, DAST).

---

### 7. Best Practices Reinforced

- **Secrets**: managed via GitHub secrets (`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`). No secrets committed.
- **Process Manager**: PM2 ensures zero-downtime restarts and `pm2 save` persists config.
- **Monitoring**: CloudWatch + Vercel analytics monitor CPU, memory, response times; alerts configured for anomalies.
- **Rollback**: Each deployment is tied to a git SHA; PM2 + git history allow immediate rollback (`git checkout <prev-sha>` + rerun script).

---

### 8. Future Enhancements

1. Add automated frontend deployments via GitHub Actions (currently manual via Vercel UI).
2. Integrate automated database backups before migrations.
3. Expand DAST coverage beyond login (appointments, profile).
4. Close outstanding Aikido issues listed above.

---

This pipeline, as evidenced by the screenshots, provides full CI coverage (tests + SAST), repeatable deployments via SSH automation, and security via Aikido and Trivy.
