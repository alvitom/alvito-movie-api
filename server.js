const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./config/dbConnection");
dbConnection();
const app = express();
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: process.env.ALVITO_MOVIE_CLIENT_BASE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1", require("./routes/index"));

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
