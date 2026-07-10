# 🌊 SketchWaves

SketchWaves is a modern, real-time collaborative drawing application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It leverages Rough.js and Perfect-Freehand to provide an intuitive and natural sketching experience.

## ✨ Features

- **Real-Time Collaboration**: Draw together with other users in real-time, powered by Socket.io.
- **Natural Drawing Feel**: Smooth strokes and a hand-drawn aesthetic using Perfect-Freehand and Rough.js.
- **Drawing Tools**: A variety of tools including freehand drawing, lines, and shapes.
- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **Interactive UI**: Responsive and modern UI crafted with Tailwind CSS and Lucide React icons.
- **State Management**: Predictable state container with Redux Toolkit for seamless app state handling.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Rough.js](https://roughjs.com/)
- [Perfect-Freehand](https://github.com/steveruizok/perfect-freehand)
- [Socket.io-client](https://socket.io/)
- [React Router DOM](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with Mongoose
- [Socket.io](https://socket.io/)
- [JWT (JSON Web Tokens)](https://jwt.io/) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Running locally or a MongoDB Atlas URI)

### 1. Clone the repository

```bash
git clone https://github.com/ANURAGYADAV008/SketchWaves.git
cd SketchWaves
```

### 2. Backend Setup

Open a terminal and set up the Node.js backend:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend development server:
```bash
npm start
```

### 3. Frontend Setup

Open a new terminal session in the root folder (`SketchWaves`) and set up the React frontend:

```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
The frontend will start on your local Vite server (usually `http://localhost:5173`). Open this URL in your browser to start sketching!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📜 License

This project is licensed under the ISC License.
