# Troubleshooting Guide

## Common Issues and Solutions

### 1. "POST http://localhost:5001/api/patient net::ERR_FAILED"

**Cause:** Backend server is not running or MongoDB is not connected.

**Solution:**
1. Make sure MongoDB is running:

   ```bash
   # Check if MongoDB is running
   pgrep -x "mongod"

   # If not running, start it:
   brew services start mongodb-community
   # or
   mongod
   ```

2. Start the backend server:

   ```bash
   cd backend
   npm install
   npm run dev:server
   ```

3. Check if the backend is responding:

   ```bash
   curl http://localhost:5001/health
   ```

### 2. "Cannot connect to server" Error

**Cause:** Network connectivity issues or server not started.

**Solution:**

1. Verify both servers are running:

   - Backend: `http://localhost:5001`
   - Frontend: `http://localhost:3000`

2. Check the browser console for detailed error messages

3. Try the health check endpoint: `http://localhost:5001/health`

### 3. MongoDB Connection Issues

**Cause:** MongoDB not installed or not running.

**Solution:**

1. Install MongoDB (if not installed):

   ```bash
   brew install mongodb-community
   ```

2. Start MongoDB:

   ```bash
   brew services start mongodb-community
   ```

3. Verify MongoDB is running:
   ```bash
   brew services list | grep mongodb
   ```

### 4. Port Already in Use

**Cause:** Another application is using port 5000 or 3000.

**Solution:**

1. Find what's using the port:

   ```bash
   lsof -i :5000
   lsof -i :3000
   ```

2. Kill the process or change the port in the configuration

### 5. Database Not Initialized

**Cause:** The ICU resource hasn't been created.

**Solution:**

1. Initialize the database:
   ```bash
   cd backend
   npm run init-db
   ```

## Quick Start

Use the provided startup script:

```bash
./start.sh
```

This script will:

1. Check if MongoDB is running
2. Initialize the database
3. Start both backend and frontend servers
4. Verify everything is working

## Manual Startup

If the startup script doesn't work, follow these steps manually:

1. **Start MongoDB:**

   ```bash
   brew services start mongodb-community
   ```

2. **Initialize Database:**

   ```bash
   cd backend
   npm install
   npm run init-db
   ```

3. **Start Backend:**

   ```bash
   npm run dev:server
   ```

4. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Health Checks

- Backend health: `http://localhost:5001/health`
- Frontend: `http://localhost:3000`
- API endpoint: `http://localhost:5001/api/patient`

## Logs

Check the terminal where you started the servers for error messages. The improved error handling will now show more detailed information about what went wrong.
