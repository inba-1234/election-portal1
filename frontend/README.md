## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)

## Backend Setup

1. Open a terminal and navigate to the backend directory:

   ```javascript
   cd election-portal/backend
   ```

2. Install dependencies:

   ```javascript
   npm install
   ```

3. Start the backend server:

   ```javascript
   npm start
   ```

   The server will run on [](http://localhost:5000)<http://localhost:5000>

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```javascript
   cd election-portal/frontend
   ```

2. Install dependencies:

   ```javascript
   npm install
   ```

3. Start the React development server:

   ```javascript
   npm start
   ```

   The app will open in your browser at [](http://localhost:3000)<http://localhost:3000>

## Database

- Ensure MongoDB is running on your system

- The backend connects to `mongodb://localhost:27017/election-portal` by default

- If you need a different MongoDB URI, create a `.env` file in the backend directory with:

  ```javascript
  MONGO_URI=your_mongodb_connection_string
  ```

## Usage

- Access the application at [](http://localhost:3000)<http://localhost:3000>
- Register as a user or admin
- Admin users can create elections
- Users can register as candidates and vote in active elections
- View results after elections complete

The backend API will be available at [](http://localhost:5000/api)<http://localhost:5000/api>
