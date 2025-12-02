# RAG Service Deployment Guide

## Files Created for Deployment

### 1. `requirements-render.txt`

- **CPU-only** version of dependencies
- Removed CUDA/GPU packages (bitsandbytes, TRL, PEFT with GPU)
- Uses PyTorch CPU build (much smaller)
- Optimized for cloud deployment without GPU

### 2. `render.yaml`

- Render.com configuration
- Specifies Python 3.11 runtime
- Free tier compatible
- Auto-deploys from `rag` branch

### 3. `Dockerfile`

- Containerized deployment option
- Python 3.11 slim base image
- Optimized for smaller image size
- Works with Docker, Railway, Google Cloud Run

### 4. `.dockerignore`

- Excludes unnecessary files from Docker builds
- Reduces deployment size

---

## Deployment Options

### Option 1: Render.com (Recommended for Free Tier)

1. **Push to GitHub:**

   ```bash
   cd "C:\Users\divyanshu\Desktop\farmer proj\Agri-Ai\rag"
   git add requirements-render.txt render.yaml Dockerfile .dockerignore
   git commit -m "Add Render deployment configuration"
   git push origin rag
   ```

2. **Deploy on Render:**

   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the `rag` branch
   - Render will auto-detect `render.yaml`
   - Add environment variables:
     - `GEMINI_API_KEY`
     - `GOOGLE_API_KEY`
     - `GOOGLE_CSE_ID`
     - `WEATHERAPI_KEY`
   - Click "Apply"

3. **Get Your URL:**
   - Render will provide a URL like: `https://agri-ai-rag.onrender.com`

---

### Option 2: Railway.app

1. **Push to GitHub** (same as above)

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository and `rag` branch
   - Railway will auto-detect Python and use `requirements-render.txt`
   - Add environment variables in Settings
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

### Option 3: Docker (Any Platform)

Build and run locally:

```bash
cd "C:\Users\divyanshu\Desktop\farmer proj\Agri-Ai\rag"
docker build -t agri-ai-rag .
docker run -p 8000:8000 --env-file .env agri-ai-rag
```

Deploy to:

- **Google Cloud Run**: `gcloud run deploy`
- **AWS ECS/Fargate**: Push to ECR
- **Azure Container Apps**: Push to ACR
- **DigitalOcean App Platform**: Connect GitHub

---

## Update Frontend to Use Deployed RAG

After deployment, update your frontend API endpoint:

**File:** `agro-app/client/src/features/rag/ragApi.js`

```javascript
const RAG_API_URL =
  process.env.VITE_RAG_API_URL || "https://your-rag-service.onrender.com";
```

**Environment Variable:** `.env`

```
VITE_RAG_API_URL=https://agri-ai-rag.onrender.com/api
```

---

## Troubleshooting

### Build Still Failing?

If you see errors about missing packages:

1. **Check Python version:** Render/Railway should use Python 3.11
2. **Verify requirements file:** Make sure using `requirements-render.txt`
3. **Check logs:** Look for specific package errors

### Common Issues:

**"Package not found":**

- Some packages might need specific versions
- Check compatibility with Python 3.11

**"Out of memory during build":**

- The sentence-transformers model download is large
- Consider using Render's paid tier for more memory
- Or use Railway which has better free tier limits

**"Timeout during build":**

- Increase build timeout in Render settings
- Or use pre-built Docker image approach

---

## Performance Notes

### CPU vs GPU:

- This deployment uses **CPU-only** PyTorch
- Inference will be slower than GPU (~2-5x)
- For production with heavy load, consider:
  - **Hugging Face Inference Endpoints** (GPU)
  - **AWS SageMaker** (GPU)
  - **Google Cloud AI Platform** (GPU)

### Free Tier Limitations:

- **Render Free:** Spins down after 15 min inactivity (cold start)
- **Railway Free:** $5 credit/month (more generous than Render)
- **Vercel:** Not suitable for ML workloads

---

## Recommended: Railway for Better Free Tier

Railway offers:

- ✅ No spin-down (stays running 24/7)
- ✅ $5 free credit/month
- ✅ Faster builds
- ✅ Better for ML workloads
- ✅ Simpler configuration

**Best for:** Small-scale production use

---

## Next Steps

1. **Test locally first:**

   ```bash
   pip install -r requirements-render.txt
   uvicorn main:app --reload
   ```

2. **If works locally, deploy to Render/Railway**

3. **Update frontend environment variables**

4. **Test the deployed API:**
   ```bash
   curl https://your-service.onrender.com/
   ```

Good luck with deployment! 🚀
