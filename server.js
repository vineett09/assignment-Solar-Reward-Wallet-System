const express = require("express");
const app = express();

app.use(express.json());

// In-memory data storage
const users = new Map();
const projects = new Map();
const subscriptions = new Map();
const rewardHistory = new Map();

// Models
class User {
  constructor(id, name, email, walletBalance = 0) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.walletBalance = walletBalance;
  }
}

class Project {
  constructor(id, name, location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }
}

class Subscription {
  constructor(id, userId, projectId, subscribedAmount) {
    this.id = id;
    this.userId = userId;
    this.projectId = projectId;
    this.subscribedAmount = subscribedAmount;
  }
}

// Initialize sample data
function initializeData() {
  //  sample users
  const user1 = new User(1, "Vineet Kumar", "vineet@example.com", 150.75);
  const user2 = new User(2, "Kunal Chaudhary", "kunal@example.com", 89.25);
  const user3 = new User(3, "Salman Khan", "salman@example.com", 0);

  users.set(1, user1);
  users.set(2, user2);
  users.set(3, user3);

  //  sample projects
  const project1 = new Project(1, "Sunrise Solar Farm", "Mumbai, India");
  const project2 = new Project(2, "Desert Wind & Solar", "Hyderabad, India");

  projects.set(1, project1);
  projects.set(2, project2);

  //  sample subscriptions
  const sub1 = new Subscription(1, 1, 1, 2000);
  const sub2 = new Subscription(2, 2, 1, 1500);
  const sub3 = new Subscription(3, 3, 2, 3000);

  subscriptions.set(1, sub1);
  subscriptions.set(2, sub2);
  subscriptions.set(3, sub3);

  // Initialize reward history
  rewardHistory.set(1, [
    {
      date: "2024-01-15",
      projectName: "Sunrise Solar Farm",
      kWhGenerated: 1200,
      creditsEarned: 3.6,
      balance: 147.15,
    },
    {
      date: "2024-01-10",
      projectName: "Sunrise Solar Farm",
      kWhGenerated: 800,
      creditsEarned: 2.4,
      balance: 143.55,
    },
  ]);

  rewardHistory.set(2, [
    {
      date: "2024-01-12",
      projectName: "Sunrise Solar Farm",
      kWhGenerated: 1000,
      creditsEarned: 2.25,
      balance: 87.0,
    },
  ]);

  rewardHistory.set(3, []);
}

function getSubscriptionsByProject(projectId) {
  return Array.from(subscriptions.values()).filter(
    (sub) => sub.projectId === projectId
  );
}

// API Endpoints

//rewards/distribute
app.post("/rewards/distribute", (req, res) => {
  try {
    const { projectId, kWh_generated } = req.body;

    // Validation
    if (!projectId || !kWh_generated) {
      return res.status(400).json({
        error: "Missing required fields: projectId and kWh_generated",
      });
    }

    if (kWh_generated <= 0) {
      return res.status(400).json({
        error: "kWh_generated must be positive",
      });
    }

    // Check if project exists
    const project = projects.get(projectId);
    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    // Get all subscriptions for this project
    const projectSubscriptions = getSubscriptionsByProject(projectId);

    if (projectSubscriptions.length === 0) {
      return res.status(404).json({
        error: "No subscriptions found for this project",
      });
    }

    const results = [];

    projectSubscriptions.forEach((subscription) => {
      const user = users.get(subscription.userId);
      if (!user) return;
      // Calculate reward
      const creditsEarned =
        kWh_generated * 1.5 * (subscription.subscribedAmount / 1000);

      // Update user's wallet balance
      user.walletBalance += creditsEarned;

      // Add to reward history
      if (!rewardHistory.has(user.id)) {
        rewardHistory.set(user.id, []);
      }

      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        projectName: project.name,
        kWhGenerated: kWh_generated,
        creditsEarned: parseFloat(creditsEarned.toFixed(2)),
        balance: parseFloat(user.walletBalance.toFixed(2)),
      };

      rewardHistory.get(user.id).unshift(historyEntry);

      results.push({
        userId: user.id,
        userName: user.name,
        creditsEarned: parseFloat(creditsEarned.toFixed(2)),
        newWalletBalance: parseFloat(user.walletBalance.toFixed(2)),
      });
    });

    res.json({
      message: "Rewards distributed successfully",
      projectId: projectId,
      projectName: project.name,
      kWhGenerated: kWh_generated,
      totalRecipientsCount: results.length,
      distributions: results,
    });
  } catch (error) {
    console.error("Error distributing rewards:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//user/:id/wallet
app.get("/user/:id/wallet", (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Validation
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // Check if user exists
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Get user's reward history
    const userRewardHistory = rewardHistory.get(userId) || [];

    res.json({
      userId: user.id,
      userName: user.name,
      email: user.email,
      walletBalance: parseFloat(user.walletBalance.toFixed(2)),
      rewardHistory: userRewardHistory,
    });
  } catch (error) {
    console.error("Error fetching user wallet:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//users
app.get("/users", (req, res) => {
  const userList = Array.from(users.values()).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    walletBalance: parseFloat(user.walletBalance.toFixed(2)),
  }));

  res.json(userList);
});

//projects
app.get("/projects", (req, res) => {
  const projectList = Array.from(projects.values());
  res.json(projectList);
});

// subscriptions
app.get("/subscriptions", (req, res) => {
  const subscriptionList = Array.from(subscriptions.values()).map((sub) => {
    const user = users.get(sub.userId);
    const project = projects.get(sub.projectId);

    return {
      id: sub.id,
      userId: sub.userId,
      userName: user ? user.name : "Unknown",
      projectId: sub.projectId,
      projectName: project ? project.name : "Unknown",
      subscribedAmount: sub.subscribedAmount,
    };
  });

  res.json(subscriptionList);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    usersCount: users.size,
    projectsCount: projects.size,
    subscriptionsCount: subscriptions.size,
  });
});

// start server
initializeData();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solar Reward Wallet System running on port ${PORT}`);
});

module.exports = app;
