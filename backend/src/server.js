import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "TenTenTen Backend API",
  });
});

// Auth routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Demo authentication - accept any valid email/password
  if (email && password && password.length >= 6) {
    res.json({
      id: "1",
      email: email,
      name: "Demo User",
      role: email.includes("admin") ? "admin" : "user",
      diamondBalance: 1000,
      avatar: "",
      token: "demo-jwt-token",
    });
  } else {
    res.status(401).json({
      error: "Invalid credentials",
      message: "Please provide valid email and password (min 6 characters)",
    });
  }
});

app.post("/api/auth/oauth", (req, res) => {
  const { provider, providerId, email, name, image } = req.body;

  // Demo OAuth response
  res.json({
    id: `${provider}-${providerId}`,
    email: email,
    name: name,
    role: "user",
    diamondBalance: 500,
    avatar: image || "",
    provider: provider,
  });
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;

  if (email && password && name && password.length >= 6) {
    res.json({
      id: Date.now().toString(),
      email: email,
      name: name,
      role: "user",
      diamondBalance: 100,
      avatar: "",
      token: "demo-jwt-token",
    });
  } else {
    res.status(400).json({
      error: "Invalid registration data",
      message: "Please provide valid email, password (min 6 chars), and name",
    });
  }
});

// User routes
app.get("/api/users/me", (req, res) => {
  res.json({
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    role: "user",
    diamondBalance: 1000,
    avatar: "",
    createdAt: "2024-01-01T00:00:00Z",
    stats: {
      tasksCompleted: 25,
      totalEarnings: 2500,
      currentStreak: 7,
    },
  });
});

// Tasks routes
app.get("/api/tasks", (req, res) => {
  const demoTasks = [
    {
      id: "1",
      title: "Follow on Instagram",
      description: "Follow our official Instagram account",
      reward: 50,
      type: "social",
      status: "available",
      difficulty: "easy",
    },
    {
      id: "2",
      title: "Share Latest Song",
      description: "Share our latest song on your social media",
      reward: 100,
      type: "social",
      status: "available",
      difficulty: "medium",
    },
    {
      id: "3",
      title: "Write a Review",
      description: "Write a review for our latest album",
      reward: 200,
      type: "content",
      status: "available",
      difficulty: "hard",
    },
  ];

  res.json({
    data: demoTasks,
    total: demoTasks.length,
    page: 1,
    pageSize: 10,
  });
});

// Dashboard stats
app.get("/api/dashboard/stats", (req, res) => {
  res.json({
    totalUsers: 1250,
    activeTasks: 15,
    totalRewards: 125000,
    completedTasks: 3420,
    recentActivity: [
      {
        id: "1",
        type: "task_completed",
        user: "Demo User",
        task: "Follow on Instagram",
        reward: 50,
        timestamp: new Date().toISOString(),
      },
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TenTenTen Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
});
