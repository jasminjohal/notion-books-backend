require("dotenv").config();
const { Client } = require("@notionhq/client");
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const { data } = require("jquery");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));

async function get_books(res) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Status",
        select: {
          equals: "To Read", // "In Progress", "To Read", "Completed"
        },
      },
      sorts: [
        {
          property: "Title",
          direction: "descending",
        },
      ],
    });
    let data = [];
    for (let i = 0; i < response.results.length; i++) {
      let book = response.results[i];
      let bookInfo = extractBookInfo(book);
      data.push(bookInfo);
    }
    res.render("home", { data: data });
  } catch (error) {
    console.error(error.body);
  }
}

// get title, book cover, and author from a book record in database
function extractBookInfo(book) {
  let bookProps = book.properties;
  let title = bookProps["Title"].title[0].plain_text;

  let bookCover = "https://via.placeholder.com/150";
  if (bookProps["Book Cover"].files.length !== 0) {
    bookCover = bookProps["Book Cover"].files[0].name;
  }

  let author = "";
  if (book.properties["Author"].rich_text.length !== 0) {
    author = book.properties["Author"].rich_text[0].plain_text;
  }

  return { title: title, bookCover: bookCover, author: author };
}

app.get("/", function (req, res) {
  get_books(res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}...`));

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
