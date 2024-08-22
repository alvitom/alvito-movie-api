const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const watchlistSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    posterPath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;
