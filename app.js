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
app.get("/", (req, res) => {
  getBooks("To Read")
    .then((books) => {
      let processedBooks = processBooks(books);
      //   res.render("home", { data: processedBooks });
      res.send(processedBooks);
    })
    .catch((e) => console.log(e));
});

// return all books read in a particular year
app.get("/year/:year", (req, res) => {
  getBooksByYear(req.params.year)
    .then((books) => {
      let processedBooks = processBooks(books);
      //   res.render("home", { data: processedBooks });
      res.send(processedBooks);
    })
    .catch((e) => console.log(e));
});

// return a random unread book in the database
app.get("/random", (req, res) => {
  getBooks("To Read")
    .then((books) => {
      const randomBook = generateRandomBook(books);
      let unreadBook = extractBookInfo(randomBook);
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${unreadBook.title}`
        )
        .then((response) => {
          let description = "";
          let isbn = "";
          let googleBookCover = "";
          if (response.data.items.length !== 0) {
            let firstResult = response.data.items[0].volumeInfo;
            description = firstResult.description;
            let isbnNos = firstResult.industryIdentifiers;
            for (let i = 0; i < isbnNos.length; i++) {
              if (isbnNos[i].type === "ISBN_13") {
                isbn = isbnNos[i].identifier;
              }
            }
            googleBookCover = firstResult.imageLinks.thumbnail;
          }
          // overrides existing book cover with Google Books API book cover
          if (googleBookCover) {
            unreadBook.bookCover = googleBookCover;
          }
          unreadBook.description = description;
          unreadBook.isbn = isbn;

          //   res.render("random", unreadBook);
          res.send(unreadBook);
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
});

app.get("/genres", (req, res) => {
  getBooks("To Read")
    .then((books) => {
      getGenres(books)
        .then((genres) => {
          res.send({ genres: genres });
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
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
