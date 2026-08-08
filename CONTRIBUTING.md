# ✈️ Aviation Club Website - Git Workflow 

Welcome to the team! **Pratyush** is the GitHub & Integration Lead. If you face merge conflicts, reach out to him.

## Branch Naming Rules
Never push directly to the `main` branch. Create a new branch for your work:
* Amruta: `ui/<component-name>` (e.g., `ui/navbar`)
* Others: `feature/<module-name>` (e.g., `feature/events-module`)

## Standard Workflow
1. Get latest code: `git checkout main` then `git pull origin main`
2. Create your branch: `git checkout -b feature/your-module`
3. Add and commit: `git add .` then `git commit -m "Brief description"`
4. Push: `git push origin feature/your-module`
5. Open a Pull Request on GitHub and assign me(pratyush) to review it.