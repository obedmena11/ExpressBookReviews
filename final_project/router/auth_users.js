const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// returns true if username is NOT already taken (valid to register)
const isValid = (username) => {
  return !users.some((u) => u.username === username);
};

// returns true if username/password match an existing user
const authenticatedUser = (username, password) => {
  return users.some((u) => u.username === username && u.password === password);
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create access token
  const accessToken = jwt.sign(
    { username },
    "fingerprint_customer",
    { expiresIn: "1h" }
  );

  // Store token in session (session authorization feature)
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in" });
});

// Add / modify a book review (logged-in users only)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // lab typically uses query param ?review=...

  if (!review) {
    return res.status(400).json({ message: "Review is required as query param: ?review=..." });
  }

  // Identify logged-in user (from session)
  const username = req.session?.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized: please login first" });
  }

  // Check book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews object exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review under this username
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    isbn,
    review: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;