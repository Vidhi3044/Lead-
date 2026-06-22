const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const reservationRoutes = require("./routes/reservationRoutes");
const leadRoutes = require("./routes/leadRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://lead-1qo5.onrender.com",
      "https://bookinghh.vercel.app"
    ],
    credentials: true,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.use("/api/reservations", reservationRoutes);
app.use("/api/leads", leadRoutes);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
