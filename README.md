# Rule Engine with AST

## Description

The **Rule Engine with AST** is a web application that allows users to create, combine, and evaluate rules based on various attributes. It utilizes an Abstract Syntax Tree (AST) to represent the rules and perform evaluations efficiently. This application is designed to be user-friendly and extensible, making it suitable for various rule-based scenarios.

## Features

- Create rules using a simple text input.
- Combine multiple rules using logical operators (AND, OR).
- Evaluate rules against user-provided data.
- Display the resulting Abstract Syntax Tree (AST).

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [MongoDB](https://www.mongodb.com/) (for data persistence)
- A modern web browser (e.g., Chrome, Firefox)

## Dependencies

This application uses the following dependencies:

- **Express**: A web framework for Node.js
- **Mongoose**: MongoDB object modeling tool
- **Body-parser**: Middleware for parsing request bodies
- **CORS**: Middleware to enable CORS (Cross-Origin Resource Sharing)
- **Nodemon** (optional): Development tool for automatically restarting the server

## Installation

Follow these steps to set up the application locally:

1. **Clone the repository**:

2. **Install server dependencies**:

    Navigate to the server directory and install the necessary packages:
    cd server
    npm install

3. **Install client dependencies**:

    Navigate to the client directory and install the necessary packages:
    cd ../client
    npm install

4. **Set up the MongoDB database**:

    Ensure MongoDB is running on your machine or set up a cloud instance.

    Create a .env file in the server directory and add your MongoDB connection string:
    MONGODB_URI=mongodb://localhost:27017/rule-engine

5. **Run the server**:

    Navigate back to the server directory and start the server:
    cd server
    npm start

    For development, you can use Nodemon to automatically restart the server on file changes:
    nodemon index.js
6. **Run the client**:

    Open a new terminal window, navigate to the client directory, and start the client:

## Usage
    1. Open your web browser and go to http://localhost:3000.
    2. Use the provided input fields to create rules, combine them, and evaluate against input data.
    3. The application will display the Abstract Syntax Tree (AST) and evaluation results.

