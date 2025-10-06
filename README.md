# SolarInbound Org Chart Tool

A React-based organizational chart tool for visualizing team structures and HubSpot seat allocations.

## 🚀 Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. **Important**: Name it **`Org-Chart`** (matches the `base` in `vite.config.ts`)
3. Don't initialize with README, .gitignore, or license

### Step 2: Push to GitHub

Run these commands in your terminal:

```bash
cd "/Users/mattdreier/Desktop/Org Chart"
git remote add origin https://github.com/YOUR-USERNAME/Org-Chart.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**
4. The deployment will start automatically!

### Step 4: Access Your Site

After the GitHub Action completes (check the **Actions** tab), your site will be available at:

```
https://YOUR-USERNAME.github.io/Org-Chart/
```

## 🔄 Updates

Every time you push to the `main` branch, GitHub Actions will automatically rebuild and redeploy your site.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Notes

- The repository **must** be named `Org-Chart` for the current configuration to work
- If you want to use a different name, update the `base` property in `vite.config.ts`
- GitHub Pages deployment typically takes 1-2 minutes after pushing

## 🛠️ Built With

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
