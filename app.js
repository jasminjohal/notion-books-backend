require("dotenv").config();
const path = require("path");

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const { data } = require("jquery");
const axios = require("axios");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// return all unread books in database
app.get("/", async (req, res) => {
  let unreadBooks = await getBooks("To Read");
  let processedBooks = processBooks(unreadBooks);
  res.send(processedBooks);
});

// return all books read in a particular year
app.get("/year/:year", async (req, res) => {
  let books = await getBooksByYear(req.params.year);
  let processedBooks = processBooks(books);
  res.send(processedBooks);
});

// return a random unread book in the database
app.get("/random", async (req, res) => {
  let unreadBooks = await getBooks("To Read");
  let randomBook = await generateRandomBook(unreadBooks);
  randomBook = extractBookInfo(randomBook);
  await updateWithGoogleAPIInfo(randomBook);
  res.send(randomBook);
});

// return a random unread book of a particular genre in the database
app.get("/random/:genre", async (req, res) => {
  let unreadBooks = await getBooksByGenre(req.params.genre);
  let randomBook = await generateRandomBook(unreadBooks);
  randomBook = extractBookInfo(randomBook);
  await updateWithGoogleAPIInfo(randomBook);
  res.send(randomBook);
});

// return unique genres in the database
app.get("/genres", async (req, res) => {
  let unreadBooks = await getBooks("To Read");
  let genres = await getGenres(unreadBooks);
  res.send({ genres: genres });
});

// return all books in database
async function getAllBooks() {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results;
}

// return books with specific status ("Completed", "To Read", or "In Progress")
async function getBooks(status) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      select: {
        equals: status,
      },
    },
    sorts: [
      {
        property: "Title",
        direction: "descending",
      },
    ],
  });
  return response.results;
}

// returns a list of unique genres for the passed books
async function getGenres(books) {
  let genres = new Set();

  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    let bookProps = book.properties;
    const bookGenres = bookProps.Genres.multi_select;
    for (let j = 0; j < bookGenres.length; j++) {
      genres.add(bookGenres[j].name);
    }
  }

  return [...genres];
}

// return books read in specific year
async function getBooksByYear(year) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "Completed",
          },
        },
        {
          property: "End Date",
          date: {
            on_or_after: `${year}-01-01`,
          },
        },
        {
          property: "End Date",
          date: {
            on_or_before: `${year}-12-31`,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Title",
        direction: "descending",
      },
    ],
  });

  return response.results;
}

// return unread books of a particular genre
async function getBooksByGenre(genre) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "To Read",
          },
        },
        {
          property: "Genres",
          multi_select: {
            contains: genre,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Title",
        direction: "descending",
      },
    ],
  });

  return response.results;
}

// get title, book cover, author, owned formats, and Notion URL from a book record in database
function extractBookInfo(book) {
  let bookProps = book.properties;
  let title = bookProps["Title"].title[0];
  title = title ? title.plain_text : "Unknown";

  let bookCover = bookProps["Book Cover"].files[0];
  bookCover = bookCover ? bookCover.name : "https://via.placeholder.com/150";

  let author = bookProps["Author"].rich_text[0];
  author = author ? author.plain_text : "Unknown";

  let owned = bookProps["Owned"].multi_select;
  let ownedFormats = [];
  owned.forEach((format) => ownedFormats.push(format.name));

  return {
    title: title,
    bookCover: bookCover,
    author: author,
    ownedFormats: ownedFormats,
    url: book.url,
  };
}

// mutates passed book object by adding description & ISBN-13 from Google Books API and
// overwriting book cover with book cover from Google Books API
async function updateWithGoogleAPIInfo(book) {
  const response = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${book.title}`
  );

  let description = "";
  let isbn = "";
  let googleBookCover = "";
  if (response.data.items.length !== 0) {
    let firstResult = response.data.items[0].volumeInfo;
    description = firstResult.description;
    let isbnNos = firstResult.industryIdentifiers;
    if (isbnNos) {
      for (let i = 0; i < isbnNos.length; i++) {
        if (isbnNos[i].type === "ISBN_13") {
          isbn = isbnNos[i].identifier;
        }
      }
    }

    if (firstResult.imageLinks) {
      googleBookCover = firstResult.imageLinks.thumbnail;
    }
  }
  // overrides existing book cover with Google Books API book cover
  if (googleBookCover) {
    book.bookCover = googleBookCover;
  }
  book.description = description;
  book.isbn = isbn;
}

// return concise version of Notion API JSON response
function processBooks(books) {
  let processedBooks = [];

  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    let bookInfo = extractBookInfo(book);
    processedBooks.push(bookInfo);
  }

  return processedBooks;
}

// return a random book from a list of books
function generateRandomBook(books) {
  const randomNumber = Math.floor(Math.random() * books.length);
  const randomBook = books[randomNumber];
  return randomBook;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}...`));
