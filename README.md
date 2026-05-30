# RelocateHub

RelocateHub is a comprehensive, one-stop relocation platform designed to simplify the moving process for individuals and families. The platform provides detailed city guides, service listings (housing, schools, healthcare), and a robust admin management panel to streamline finding verified services in a new city.

## 🚀 Tech Stack

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS** (for styling and responsive layouts)
- **React Router** (for navigation)
- **Lucide React** (for modern icons)
- **Axios** (for API communication)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database and ODM)
- **JWT** (JSON Web Tokens via Cookies for secure authentication)
- **Bcrypt** (for secure password hashing)

---

## 🌟 Key Features

- **Dynamic City Guides**: Explore target cities, understand cost of living, key neighborhoods, and local essentials.
- **Service Listings Filter & Search**: Search for housing, schools, and healthcare with advanced filtering by category, rating, and real-time popularity sorting.
- **User Authentication**: Secure user registration, login, and cookie-based session persistence.
- **User Dashboard**: Save favorite service listings and view personalized relocation workflows.
- **Review System**: Rate and review services to maintain quality and help other users.
- **Admin Control Panel**: Admins can securely add new cities, overview data, and manage service listings across the platform.

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas connection string.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/relocatehub.git
cd relocatehub/version2
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# Server should run on http://localhost:5000
```

### 3. Frontend Setup
Navigate into the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
# App should run on http://localhost:5173
```

---

## 📂 Project Structure

```
relocatehub/version2/
├── backend/
│   ├── middleware/      # Authentication middleware (JWT checks)
│   ├── models/          # Mongoose Schema definitions (User, City, Listing, Review)
│   ├── routes/          # Express API routes (auth, cities, listings, reviews)
│   └── server.js        # Entry point for backend
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React Context (AuthContext)
    │   ├── pages/       # Route-based views (Home, Dashboard, AdminPanel, DetailPage, etc.)
    │   ├── App.jsx      # Main application router
    │   └── main.jsx     # Frontend entry point
```

---

## 📜 License

This project is open-source and available under the MIT License.
