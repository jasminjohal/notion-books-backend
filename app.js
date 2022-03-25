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

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// return all unread books in database
app.get("/", (req, res) => {
  getBooks("To Read")
    .then((books) => {
      let unreadBooks = [];
      for (let i = 0; i < books.length; i++) {
        let book = response.results[i];
        let bookInfo = extractBookInfo(book);
        books.push(bookInfo);
      }
      res.render("home", { data: unreadBooks });
    })
    .catch((e) => console.log(e));
});

// return a random unread book in the database
app.get("/random", (req, res) => {
  getBooks("To Read")
    .then((books) => {
      const randomBook = generateRandomBook(books);
      let unreadBook = extractBookInfo(randomBook);
      res.render("home", { data: [unreadBook] });
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

// get title, book cover, author, and owned formats from a book record in database
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
  };
}

// return a random book from a list of books
function generateRandomBook(books) {
  const randomNumber = Math.floor(Math.random() * books.length);
  const randomBook = books[randomNumber];
  console.log(randomNumber);
  return randomBook;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}...`));
