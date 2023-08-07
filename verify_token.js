const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'Yo'); // Replace 'your-secret-key' with your actual secret key
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Call the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;


//  use

// const express = require('express');
// const verifyToken = require('./verifyToken');

// const app = express();

// app.post('/submit', verifyToken, (req, res) => {
//   // Access the authenticated user's information from req.user
//   const userId = req.user.id;

//   // Handle the submit request
//   // ...
// });

// // Other routes and server configurations

// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });
