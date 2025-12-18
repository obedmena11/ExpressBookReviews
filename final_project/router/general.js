const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * -----------------------------
 * Task 6: Register a new user
 * -----------------------------
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/**
 * -----------------------------
 * Task 1: Get all books
 * -----------------------------
 */
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/**
 * -----------------------------
 * Task 2: Get book by ISBN
 * -----------------------------
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});

/**
 * -----------------------------
 * Task 3: Get books by author
 * -----------------------------
 */
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let result = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      result.push(books[key]);
    }
  }

  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }

  return res.status(404).json({ message: "No books found for this author" });
});

/**
 * -----------------------------
 * Task 4: Get books by title
 * -----------------------------
 */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let result = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      result.push(books[key]);
    }
  }

  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }

  return res.status(404).json({ message: "No books found with this title" });
});

/**
 * -----------------------------
 * Task 5: Get book review
 * -----------------------------
 */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.status(404).json({ message: "Reviews not found for this book" });
});



/**
 * Task 10: Get all books using async/await + Axios
 */
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books (async/axios)",
      error: error.message
    });
  }
});

/**
 * Task 11: Get book by ISBN using async/await + Axios
 */
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Error fetching book (async/axios)",
      error: error.message
    };
    return res.status(status).json(data);
  }
});

/**
 * Task 12: Get books by author using async/await + Axios
 */
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Error fetching books by author (async/axios)",
      error: error.message
    };
    return res.status(status).json(data);
  }
});

/**
 * Task 13: Get books by title using async/await + Axios
 */
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Error fetching books by title (async/axios)",
      error: error.message
    };
    return res.status(status).json(data);
  }
});

module.exports.general = public_users;