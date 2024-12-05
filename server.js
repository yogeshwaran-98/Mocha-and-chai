import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import registerRoute from "./routes/registerRoute.js";
import userRoute from "./routes/userRoute.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/try_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/api/auth", registerRoute);
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
