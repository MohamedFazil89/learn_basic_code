require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bodyparser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));


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
const player = sequelize.define("player", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const host = sequelize.define("host", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

app.get("/", (req, res) => {
  res.render("index.ejs", { role: roles, state: usestate });
});

let roles;
var usestate;

app.post("/submit", async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    if (role === "player") {
      const newPost = await player.create({ username, password, email });
      // res.send("Succussfully Registered! as a Player");
      roles = role;
      usestate = true;
      setTimeout(()=>{
      res.redirect("/");
      }, 5000)
    } else {
      const newPost = await host.create({ username, password, email });
      // res.send("Succussfully Registered! as a Host");
      roles = role
      usestate = true;
      setTimeout(()=>{
        res.redirect("/");
        }, 5000)


    }

    // res.json(newPost);
  } catch (err) {
    console.log(err);
    usestate = false;
  }
});

// app.get("/list-data", async (req, res) => {
//   const { username, password, email } = req.body;
//   try {
//     const allPosts = await host.findAll();
//     res.json(allPosts);
//   } catch (err) {
//     console.log(err);
//   }
// });

app.post("/login", async (req, res) => {

  const { username, password, role } = req.body;

  try {
    if (role === "player") {
      const user = await player.findOne({ where: { username, password } });
      if ((user) && (password == user.password)) {
        res.render("home.ejs");
        console.log("login succussfull");

      }
    } else {
      const user = await host.findOne({ where: { username, password } });
      if ((user) && (password == user.password)) {
        res.render("home.ejs");
        console.log("login succussfull");
      }

    }

  

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred during login" });
  }
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

