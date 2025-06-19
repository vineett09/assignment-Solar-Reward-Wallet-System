Solar Reward Wallet System

A simple Express-based backend to simulate a green energy reward system. Users subscribe to solar/wind projects and earn wallet credits based on kWh energy generation.

🚀 Getting Started

Prerequisites

Node.js

npm

Postman (for testing)

Installation

npm init -y
npm install express

Run Server

node server.js

Server will start on: http://localhost:3000

📚 Features

View all users, projects, and subscriptions

Distribute energy rewards to users based on project generation

Track wallet balance and reward history

Simple in-memory storage (no DB needed)

🔌 API Endpoints

Method

Endpoint

Description

GET

/health

Check server status

GET

/users

Get all users

GET

/projects

Get all projects

GET

/subscriptions

Get all subscriptions

GET

/user/:id/wallet

Get user's wallet and reward history

POST

/rewards/distribute

Distribute rewards to all users of a project

🧪 Postman Testing

A complete guide is available in the Postman Testing Guide - Solar Reward Wallet System document.

To test APIs:

Use Postman to send requests

Import the provided collection: Solar_Reward_API_Postman_Collection.json

📂 Project Structure

project-directory/
├── server.js
├── Solar_Reward_API_Postman_Collection.json
└── README.md

📄 License

This project is for educational and testing purposes only.

