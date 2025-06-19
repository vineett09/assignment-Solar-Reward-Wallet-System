🌞 Solar Reward Wallet System

A lightweight Express.js-based backend application that simulates a solar and wind energy rewards system. Users subscribe to green energy projects and earn wallet credits based on kWh energy generation.

📦 Tech Stack

Backend: Node.js, Express.js

Data Storage: In-memory (via Maps)

Testing: Postman (with provided collection)

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

Node.js

npm (comes with Node)

Postman (for testing APIs)

Installation

npm init -y
npm install express

Running the Server

node server.js

The server will be available at: http://localhost:3000

📚 Features

✅ List all users, projects, and subscriptions

⚡ Distribute rewards based on energy generation

💰 Track wallet balances and reward history

🧠 Simple logic, no external database required

📡 API Endpoints

Method

Endpoint

Description

GET

/health

Check server status

GET

/users

Retrieve all users

GET

/projects

Retrieve all available projects

GET

/subscriptions

Get all project-user subscriptions

GET

/user/:id/wallet

Get wallet balance and reward history by user ID

POST

/rewards/distribute

Distribute rewards based on energy generation

🧪 Postman API Testing

Use Postman to test all endpoints. A ready-made collection is available:

➡️ Instructions.txt

Steps:

Import the collection into Postman

Use the environment variable {{baseUrl}} set to http://localhost:3000

Follow the structured test cases (Health check → Get data → Distribute → Verify)

For complete walkthrough, refer to the Postman Instruction Guide.

📁 Project Structure

project-directory/
├── server.js                         # Main application file
├── Solar_Reward_API_Postman_Collection.json  # Postman collection for API testing
└── Instructions.txt                        # Project overview and setup



