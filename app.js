const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const visited = require("./models/visited.js");

require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// MongoDB URL from environment variables
const dbUrl = process.env.MONGODB_URL;

// Connect to MongoDB using mongoose
main().then(() => {
  console.log('Connected to DB...')
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1); // Exit the process if unable to connect to database
});

async function main() {
  await mongoose.connect(dbUrl);
}


app.get('/', (req, res) => {
  res.render('home.ejs');
});


app.post('/visitors', async (req, res) => {
  try {
    const { username } = req.body;
    const isthere = await visited.findOne({ username });
    if (isthere) {
      isthere.count = isthere.count + 1;
      const newvisiter = await isthere.save();
      return res.status(200).render('visited.ejs', { newvisiter });
    } else {
      const createvisitor = new visited({
        username,
        count: 1,
      });
      const newvisiter = await createvisitor.save();
      return res.status(200).render('visited.ejs', { newvisiter });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
