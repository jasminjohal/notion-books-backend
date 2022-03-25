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
      let title = book.properties["Title"].title[0].plain_text;

      let book_cover = "https://via.placeholder.com/150";
      if (book.properties["Book Cover"].files.length !== 0) {
        book_cover = book.properties["Book Cover"].files[0].name;
      }

      let author = "";
      if (book.properties["Author"].rich_text.length !== 0) {
        author = book.properties["Author"].rich_text[0].plain_text;
      }

      data.push({ title: title, book_cover: book_cover, author: author });
    }
    // console.log(data);
    res.render("home", { data: data });
    // return data;
  } catch (error) {
    console.error(error.body);
  }
}

app.get("/", function (req, res) {
  get_books(res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}...`));

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
