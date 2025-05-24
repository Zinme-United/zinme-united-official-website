import dotenv from "dotenv";
import app from "./app";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});
