#!/bin/bash

echo "🏥 Hospital Bed Allocation System - Startup Script"
echo "=================================================="

# Check if MongoDB is running
echo "🔍 Checking if MongoDB is running..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   mongod"
    echo ""
    echo "If you don't have MongoDB installed, install it with:"
    echo "   brew install mongodb-community"
    exit 1
else
    echo "✅ MongoDB is running"
fi

# Initialize database
echo ""
echo "🗄️  Initializing database..."
cd backend
npm run init-db
if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully"
else
    echo "❌ Database initialization failed"
    exit 1
fi

# Start backend server
echo ""
echo "🚀 Starting backend server..."
npm run dev:server &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:5001"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend server
echo ""
echo "🌐 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server is running on http://localhost:3000"
else
    echo "❌ Frontend server failed to start"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Both servers are running!"
echo "📊 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo "🔍 Health check: http://localhost:5001/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt signal
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Keep script running
wait
