
require("dotenv").config()

const express = require("express");
const app = express();

const prisma = require("./prisma")

const PORT = 3000;

app.use(express.json());
app.use(require("morgan")("dev"));
const cors = require("cors");
app.use(cors({ origin: ["http://localhost:5173"] }));



const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const verifyToken = require("./verify")


app.post("/api/register", async (req, res, next) => {
  const {username, password} = req.body
  const newUser = await prisma.administrator.create({
    data: {username, password: await bcrypt.hash(password, 5)}
  })
  const token = jwt.sign({id: newUser.id, username: newUser.username}, process.env.JWT_SECRET)

  res.status(201).json(token)
})

app.post("/api/login", async (req, res, next) => {
  const {username, password} = req.body
  const user = await prisma.administrator.findUnique({
    where: {username}
  })
  if (!user) return res.status(400).json("User not found.")
    console.log(user);
    
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) return res.status(401).json("Account not found")
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET)

  res.status(201).json(token)
})

app.get("/api/account", verifyToken, async (req, res, next) => {
  try {
    const userId = req.userId; 

    const user = await prisma.administrator.findUnique({
      where: { id: userId },
      select: { id: true, username: true } 
    });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching account details:", error);
    next(error);
  }
});


app.use("/api", require("./api"));

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status ?? 500;
    const message = err.message ?? 'Internal server error.';
    res.status(status).json({ message });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });

