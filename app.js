require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bodyparser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"))
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgresql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//   model schema
const post = sequelize.define("post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await post.create({ title, content });
    res.json(newPost);
  } catch (err) {
    console.log(err);
  }
});

app.get("/get-posts", async (req, res) => {
  try {
    const allPosts = await post.findAll();
    res.json(allPosts);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
