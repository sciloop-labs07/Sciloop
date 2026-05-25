# GitHub + Render Checklist for SciLoop

This is the fastest safe path to share SciLoop with other members.

## 1. Before uploading

Make sure these stay private:

- `.env`
- `server/.env`
- `sciloop-backend/.env`
- any real API keys
- local logs

This repo already has updated ignore rules in:

- [.gitignore](</C:/Users/moham/Downloads/Sciloop%203/.gitignore>)

## 2. Create the Git repo locally

Open PowerShell in:

`C:\Users\moham\Downloads\Sciloop 3`

Run:

```powershell
git init
git branch -M main
git add .
git commit -m "Prepare SciLoop for Render deployment"
```

## 3. Create a GitHub repo

Create a new empty GitHub repository, for example:

`sciloop-platform`

Then connect it:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/sciloop-platform.git
git push -u origin main
```

## 4. Deploy on Render

Use:

- [render.yaml](</C:/Users/moham/Downloads/Sciloop%203/render.yaml>)
- [RENDER_DEPLOY.md](</C:/Users/moham/Downloads/Sciloop%203/RENDER_DEPLOY.md>)

In Render:

1. New Blueprint
2. Pick your GitHub repo
3. Let Render detect `render.yaml`
4. Create all three services

## 5. Set the Render environment values

After Render creates the services, fill the `sync: false` variables.

You will need the public URLs Render gives you:

- frontend URL
- ForLoop API URL
- SciLoop AI backend URL

Put those back into the other services exactly as described in:

- [RENDER_DEPLOY.md](</C:/Users/moham/Downloads/Sciloop%203/RENDER_DEPLOY.md>)

## 6. Redeploy once env values are linked

After all service URLs and keys are set:

1. Trigger redeploy for all three services
2. Check:
   - frontend loads
   - ForLoop control panel loads
   - AI backend `/health` responds

## 7. Share with members

For phones or remote members, use:

- [ForLoop Control Panel Mobile.html](</C:/Users/moham/Downloads/Sciloop%203/ForLoop%20Control%20Panel%20Mobile.html>)
- [SciLoop Mobile Remote.html](</C:/Users/moham/Downloads/Sciloop%203/SciLoop%20Mobile%20Remote.html>)

Open them with your real Render URLs:

```text
?forloop=https://YOUR-FORLOOP-API.onrender.com&api=https://YOUR-AI-BACKEND.onrender.com&lab=https://YOUR-FRONTEND.onrender.com/visual-language-lab
```

## 8. Final check before member sharing

Test these public URLs:

- `https://YOUR-FRONTEND.onrender.com`
- `https://YOUR-FORLOOP-API.onrender.com/forloop-control-panel/`
- `https://YOUR-AI-BACKEND.onrender.com/health`

## 9. Important limitation

Render free services can sleep.

That means:

- first open may be slow
- member experience is okay for early testing
- later you may want paid always-on services
