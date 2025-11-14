==========================================
HOW TO CREATE .env FILE
==========================================

STEP 1: Create .env file in backend folder
- Open backend folder
- Create new file named: .env (with the dot at the beginning)

STEP 2: Copy this content to .env file:

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleaning-service?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=30d

STEP 3: Get MongoDB Atlas connection string
- Go to: https://www.mongodb.com/cloud/atlas
- Login to your account
- Click "Connect" next to your Cluster
- Choose "Connect your application"
- Choose "Node.js" and "Version: 5.5 or later"
- Copy the connection string

STEP 4: Replace in .env file
- Replace <username> with your MongoDB username
- Replace <password> with your MongoDB password
- Add /cleaning-service before ? (database name)

Example:
Before: mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
After:  mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/cleaning-service?retryWrites=true&w=majority

STEP 5: Test connection
cd backend
node server.js

You should see:
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running in development mode on port 5000

==========================================
For detailed instructions in Arabic, see:
- backend/CREATE_ENV.md
- backend/MONGODB_SETUP.md
- backend/FIX_CONNECTION.md
==========================================

