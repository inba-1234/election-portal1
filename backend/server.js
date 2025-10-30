const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://InbavananK:inba1234@cluster0.z5oyifs.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/elections", require("./routes/elections"));
app.use("/api/votes", require("./routes/votes"));

// Serve React build in production
const frontendBuildPath = path.join(__dirname, "../frontend/build");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendBuildPath));

  // Send React's index.html for any unknown routes (client-side routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
