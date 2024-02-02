const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
{ username: 'SUBHAN', password: 'SUBHAN123' }
];
 
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the provided credentials are valid
  if (authenticatedUser(username, password)) {
    // Generate a JWT token for the session
    const token = jwt.sign({ username }, 'subhannaeem123', { expiresIn: '1h' });

    // Save the user credentials in the session (optional, depends on your use case)
    req.session.user = { username, token };

    // Return the token in the response
    return res.status(200).json({ token, username, message:"login successfully" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  ///Write your code here
  const { isbn } = req.params;
  const { review } = req.query;
  const { user } = req.session; // Use req.session.user if that's how it's stored

  if (!isbn || !review || !user || !user.username) {
    return res.status(400).json({ message: "ISBN, review, and username are required" });
  }

  const { username } = user;

  // Check if the book with the given ISBN exists
  if (books.hasOwnProperty(isbn)) {
    // Check if the user has already posted a review for this ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Modify the existing review for the same user and ISBN
      books[isbn].reviews[username] = review;
    } else {
      // Add a new review for a different user and/or ISBN
      books[isbn].reviews[username] = review;
    }

    return res.status(200).json({ message: "Review added or modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN" });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.user;

  if (!isbn || !username) {
    return res.status(400).json({ message: "ISBN and username are required" });
  }

  // Check if the book with the given ISBN exists
  if (books.hasOwnProperty(isbn)) {
    // Check if the user has posted a review for this ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Delete the review for the user and ISBN
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for the given ISBN and username" });
    }
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN" });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
