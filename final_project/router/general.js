const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve,reject) => {
        resolve(books);
    }).then((data)=>{
        return res.status(300).json(data);
    }).catch((error)=>{
        return res.status(500).json({message : error});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    new Promise((resolve,reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        resolve(book);
    }).then((book)=>{
        return res.status(200).json(book);
    }).catch((error)=>{
        return res.status(500).json({message : error});
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise((resolve,reject) => {
        const bks = Object.values(books).filter((b) => b.author === req.params.author)
        resolve(bks);
    }).then((bks)=>{
        return res.status(bks.length > 1 ? 300:200).json(bks)
    }).catch((error)=>{
        return res.status(500).json({message : error});
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve,reject) => {
        const book = Object.values(books).filter((b) => b.title === req.params.title)
        resolve(book);
    }).then((book)=>{
        return res.status(book.length > 1 ? 300:200).json({book});
    }).catch((error)=>{
        return res.status(500).json({message : error});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  const reviews = books[isbn]?.reviews;
  return res.status(200).json({reviews});
});

module.exports.general = public_users;
