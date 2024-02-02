const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const getBooksAsync = async () => {
  try {
    // Directly return the books object
    return books;
  } catch (error) {
    throw error;
  }
};
public_users.get('/', async (req, res) => {
//   try {
//     const bookList = await getBooksAsync();
//     return res.status(200).json(bookList);
//   } catch (error) {
//     console.error('Error fetching books:', error.message);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
try {
  const bookList = await getBooksAsync();
  return res.status(200).json(bookList);
} catch (error) {
  console.error('Error fetching books:', error.message);
  return res.status(500).json({ message: 'Internal Server Error' });
}
});


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = Object.values(books); // Convert the books object into an array of book values
  return res.status(200).json(bookList);
  return res.status(300).json({message: " implemented"});
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
//   return res.status(300).json({message: "Yet to be implemented"});
//  });





// public_users.get('/isbn/:isbn', async function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

//task11
function searchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error('Book not found'));
    }
  });
}

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  searchBookByISBN(isbn)
    .then((bookDetails) => {
      return res.status(200).json(bookDetails);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'Book not found' });
    });
});









// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const authorToSearch = req.params.author;
//   const matchingBooks = [];

//   for (const isbn in books) {
//     if (books.hasOwnProperty(isbn) && books[isbn].author === authorToSearch) {
//       matchingBooks.push(books[isbn]);
//     }
//   }

//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "No books found for the provided author" });
//   }
//   // return res.status(300).json({message: "Yet to be implemented"});
// });
function searchBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn) && books[isbn].author === author) {
        matchingBooks.push(books[isbn]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error('No books found for the provided author'));
    }
  });
}

public_users.get('/author/:author', function (req, res) {
  const authorToSearch = req.params.author;
  searchBookByAuthor(authorToSearch)
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'No books found for the provided author' });
    });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleToSearch = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books.hasOwnProperty(isbn) && books[isbn].title === titleToSearch) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for the provided title" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});
// public_users.get('/title/:title', function (req, res) {
//   console.log('Handling Title request');
//   const titleToSearch = req.params.title;
//   console.log('Title:', titleToSearch);

//   // Use Axios to make a GET request to the book service
//   axios.get(`http://localhost:8000/title/${encodeURIComponent(titleToSearch)}`)
//     .then(response => {
//       const matchingBooks = response.data;

//       if (matchingBooks.length > 0) {
//         res.status(200).json(matchingBooks);
//       } else {
//         res.status(404).json({ message: "No books found for the provided title" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ message: "Internal Server Error" });
//     });
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnToSearch = req.params.isbn;
  if (books[isbnToSearch]) {
    const reviews = books[isbnToSearch].reviews;
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
