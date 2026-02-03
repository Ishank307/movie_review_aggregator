const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviewsByMovie,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/movies/:movieId/reviews", addReview);
router.get("/movies/:movieId/reviews", getReviewsByMovie);
router.delete("/reviews/:reviewId", deleteReview);

module.exports = router;
