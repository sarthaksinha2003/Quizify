const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Leaderboard = require("./models/Leaderboard");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/quizzify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Leaderboard MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/api/leaderboard", async (req, res) => {
  const { username, score } = req.body;

  try {
    const existingUser = await Leaderboard.findOne({ username });
    if (existingUser) {
      if (score > existingUser.score) {
        existingUser.score = score;
        await existingUser.save();
        return res
          .status(200)
          .json({ message: "Score updated!", user: existingUser });
      }
      return res
        .status(200)
        .json({ message: "Score is not higher. No update made." });
    }

    const newEntry = new Leaderboard({ username, score });
    await newEntry.save();
    res
      .status(201)
      .json({ message: "New entry added to leaderboard!", user: newEntry });
  } catch (error) {
    res.status(500).json({ message: "Error adding/updating score", error });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 });
    res.status(200).json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
});

app.listen(PORT, () => {
  console.log(`Leaderboard server is running on port ${PORT}`);
});
