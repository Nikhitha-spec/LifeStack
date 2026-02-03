---
description: How to deploy LifeStack globally
---

To deploy LifeStack globally so it is accessible via a URL, follow these steps:

### 1. Push Code to GitHub
Ensure all your changes are committed and pushed to a GitHub repository.
```bash
git add .
git commit -m "Prepare for global deployment"
git push origin main
```

### 2. Choose a Deployment Platform
For a Vite/React application like LifeStack, we recommend **Vercel** or **Netlify**.

#### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and create an account.
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyB-5UO5dZmGZTtQhOo8HfpKdronZElO_7M` (or your private key)
5. Click **Deploy**.
6. Once finished, Vercel will provide a `.vercel.app` URL (e.g., `lifestack.vercel.app`).

#### Option B: Netlify
1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **Add new site** > **Import an existing project**.
3. Select GitHub and pick the repository.
4. Set Build Command: `npm run build`
5. Set Publish directory: `dist`
6. In **Environment Variables**, add `VITE_GEMINI_API_KEY`.
7. Click **Deploy site**.

### 3. Global Edge Network
Both Vercel and Netlify automatically serve your application via a Global CDN (Content Delivery Network). This means:
- **Low Latency**: The app is cached at Edge nodes worldwide (Mumbai, Singapore, London, New York, etc.).
- **High Availability**: If one node fails, users are rerouted to the next closest one.
- **SSL**: HTTPS is enabled automatically.

### 4. Custom Domain
After deployment, you can link a custom domain (e.g., `lifestack.health`) in the platform's **Domain Settings** tab.
