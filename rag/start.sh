echo "🚀 Starting Agri-AI RAG Server..."
echo "📡 PORT environment variable: $PORT"
echo "🐍 Python version: $(python --version)"
echo "📦 Uvicorn version: $(uvicorn --version)"

if [ -z "$PORT" ]; then
    echo "⚠️  PORT not set, using default 8000"
    export PORT=8000
fi

echo "🎯 Starting server on port $PORT..."

exec uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1 --log-level info
