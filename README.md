# Notion Random Book Generator (Backend)

I have a database of books in my Notion workspace named `Reading Log`. It contains all the books I've read, the books I'm currently reading, and the books on my "TBR" (To Be Read) list. My TBR list is quite extensive so it's overwhelming to pick a book to read. I developed a random book generation application to address this problem. This is the backend for the application. It supports GET requests for three endpoints:

- `/random-tbr-book`
- `/random-tbr-book/:genre`
- `/tbr-genres`

## Get a Random Unread Book

Returns a random book with the status `To Read` in my `Reading Log` database in Notion.

```
GET /random-tbr-book
```

### Response Headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 945
ETag: W/"3b1-Mvf1LHY773W5ugmA9mwOcmlbqhQ"
Date: Wed, 29 Jun 2022 16:14:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### Response Body

```json
{
  "title": "Leviathan Wakes",
  "bookCover": "http://books.google.com/books/content?id=yud-foXqGUEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  "author": "James S. A. Corey",
  "ownedFormats": ["Kindle 📘"],
  "url": "https://www.notion.so/Leviathan-Wakes-0a84fe11dec246c0bd0745d6c713f560",
  "description": "From a New York Times bestselling and Hugo award-winning author comes a modern masterwork of science fiction, introducing a captain, his crew, and a detective as they unravel a horrifying solar system wide conspiracy that begins with a single missing girl. Now a Prime Original series. Humanity has colonized the solar system—Mars, the Moon, the Asteroid Belt and beyond—but the stars are still out of our reach. Jim Holden is XO of an ice miner making runs from the rings of Saturn to the mining stations of the Belt. When he and his crew stumble upon a derelict ship, the Scopuli, they find themselves in possession of a secret they never wanted. A secret that someone is willing to kill for—and kill on a scale unfathomable to Jim and his crew. War is brewing in the system unless he can find out who left the ship and why. Detective Miller is looking for a girl. One girl in a system of billions, but her parents have money and money talks. When the trail leads him to the Scopuli and rebel sympathizer Holden, he realizes that this girl may be the key to everything. Holden and Miller must thread the needle between the Earth government, the Outer Planet revolutionaries, and secretive corporations—and the odds are against them. But out in the Belt, the rules are different, and one small ship can change the fate of the universe. \"Interplanetary adventure the way it ought to be written.\" —George R. R. Martin The Expanse Leviathan Wakes Caliban's War Abaddon's Gate Cibola Burn Nemesis Games Babylon's Ashes Persepolis Rising Tiamat's Wrath ​Leviathan Falls Memory's Legion The Expanse Short Fiction Drive The Butcher of Anderson Station Gods of Risk The Churn The Vital Abyss Strange Dogs Auberon The Sins of Our Fathers",
  "isbn": "9780316134675"
}
```

## Get a Random Book of a Particular Genre

Returns a random book with the status `To Read` and with the specified genre in my `Reading Log` database in Notion.

```
GET /random-tbr-book/:genre
```

### Response Headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 1322
ETag: W/"52a-EDmsKH6nZgbb3Ie5o2IonOt64LY"
Date: Wed, 29 Jun 2022 16:16:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### Response Body

```json
{
  "title": "Exhalation",
  "bookCover": "http://books.google.com/books/content?id=L61oDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  "author": "Ted Chiang",
  "ownedFormats": ["Kindle 📘", "Audiobook 🎧"],
  "url": "https://www.notion.so/Exhalation-040bb6d3bc99469989918abdc5fef52a",
  "description": "NATIONAL BESTSELLER • ONE OF THE NEW YORK TIMES BEST BOOKS OF THE YEAR • Nine stunningly original, provocative, and poignant stories—two published for the very first time—all from the mind of the incomparable author of Stories of Your Life and Others Tackling some of humanity’s oldest questions along with new quandaries only he could imagine, these stories will change the way you think, feel, and see the world. They are Ted Chiang at his best: profound, sympathetic, revelatory. Ted Chiang tackles some of humanity’s oldest questions along with new quandaries only he could imagine. In “The Merchant and the Alchemist’s Gate,” a portal through time forces a fabric seller in ancient Baghdad to grapple with past mistakes and second chances. In “Exhalation,” an alien scientist makes a shocking discovery with ramifications that are literally universal. In “Anxiety Is the Dizziness of Freedom,” the ability to glimpse into alternate universes necessitates a radically new examination of the concepts of choice and free will.",
  "isbn": "9781101947906"
}
```

## Get All Genres

Returns a list of the unique genres for all books with the status `To Read` in my `Reading Log` database in Notion.

```
GET /tbr-genres
```

### Response Headers

```
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 146
Date: Wed, 29 Jun 2022 16:21:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### Response Body

```json
{
  "genres": [
    "Nonfiction",
    "Science",
    "Health",
    "Psychology",
    "Self Help",
    "Audiobook",
    "Biology",
    "Neuroscience",
    "Personal Development",
    "Medicine",
    "Productivity",
    "Education",
    "Business",
    "Leadership",
    "Entrepreneurship",
    "Reference",
    "Science Fiction",
    "Fiction",
    "Fantasy",
    "Religion",
    "Science Fiction Fantasy",
    "Speculative Fiction",
    "Aliens",
    "Adult",
    "Book Club",
    "Novels",
    "Dystopia",
    "Apocalyptic",
    "Post Apocalyptic",
    "Magic",
    "Brain",
    "LGBT",
    "Space",
    "Space Opera",
    "Queer",
    "Mental Health",
    "Unfinished",
    "Mystery",
    "Historical",
    "Historical Fiction",
    "Thriller",
    "Mystery Thriller",
    "Crime",
    "Cultural",
    "African American",
    "Urban",
    "Young Adult",
    "Contemporary",
    "Adult Fiction",
    "Classics",
    "Realistic Fiction",
    "Computer Science",
    "Programming",
    "Technology",
    "Software",
    "Technical",
    "Coding",
    "Computers",
    "Engineering",
    "Africa",
    "Academic",
    "School",
    "Literature",
    "Western Africa",
    "Nigeria",
    "Read For School",
    "African Literature",
    "Sports",
    "Fitness",
    "Philosophy",
    "Romance",
    "Time Travel",
    "Historical Romance",
    "Scotland",
    "Paranormal",
    "Horror",
    "Urban Fantasy",
    "Buddhism",
    "Spirituality",
    "Gothic",
    "Parenting",
    "Sociology",
    "Hinduism",
    "High Fantasy",
    "Management",
    "History",
    "Anthropology",
    "Politics",
    "Architecture",
    "Design",
    "Short Stories",
    "Anthologies",
    "Buisness",
    "Autobiography",
    "Memoir",
    "Biography",
    "Biography Memoir",
    "Japan",
    "Magical Realism",
    "Asian Literature",
    "Japanese Literature",
    "Literary Fiction",
    "Feminism",
    "Sequential Art",
    "Comics",
    "Graphic Novels",
    "Dc Comics",
    "Batman",
    "Superheroes",
    "Comic Book",
    "Graphic Novels Comics",
    "Comics Manga",
    "Epic Fantasy",
    "Adventure",
    "Dragons",
    "Epic"
  ]
}
```

---

## Getting Started

Follow the instructions below to get this application running locally.

## Prerequisites

You must have Node.js and npm installed. You must also have a Notion account and have a database set up in Notion. To use this application exactly as is without modifying the `app.js` file, you must have the following properties in your database:

| Property Name | Property Type |
| ------------- | ------------- |
| `Title`       | Title         |
| `Author`      | Text          |
| `Book Cover`  | Files & media |
| `Owned`       | Multi-select  |
| `Status`      | Select        |
| `Genres`      | Multi-select  |

The options for `Status` must include `To Read`.

## Installation

Clone this repository:

```sh
$ git clone https://github.com/jasminjohal/notion-random-book-backend.git
$ cd notion-random-book-backend
```

Install the dependencies:

```sh
$ npm install
```

## Usage

### Creating a .env file

Create a new file with the extension `.env` in the same folder as the `index.js` file and name it `.env`.
Add the following two lines to the file. Make sure to replace both `{your_notion_key}` and `{your_database_id}` with your Notion API key and the unique ID of your database, respectively.

```
NOTION_API_KEY={your_notion_key}
DATABASE_ID={your_database_id}
```

### Running the app

```sh
$ node app.js
```
