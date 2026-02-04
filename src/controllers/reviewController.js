const Review = require("../models/Review");
const Movie = require("../models/Movie");
const mongoose = require("mongoose");

/**
 * @route POST /api/movies/:movieId/reviews
 * @access Private
 * @desc Add a review to a movie
 */
//adding review to a given movie
const addReview = async (req, res) => {
    try {
        const { movieId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        const movieExists = await Movie.findById(movieId);
        if (!movieExists) {
            return res.status(404).json({ message: "Movie not found" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { rating, comment } = req.body;
        const parsedRating = Number(rating);
        if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res
                .status(400)
                .json({ message: "Rating must be a number between 1 and 5" });
        }

        // const existingReview = await Review.findOne({
        //     movie: movieId,
        //     user: req.user.id,
        // });
        // if (existingReview) {
        //     return res
        //         .status(400)
        //         .json({ message: "You already reviewed this movie" });
        // }

        const review = await Review.create({
            movie: movieId,
            user: req.user.id, 
            rating: parsedRating,
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        if (error && error.code === 11000) {
            return res
                .status(400)
                .json({ message: "You already reviewed this movie" });
        }
        res.status(400).json({message:error.message});
    }
}

/**
 * @route GET /api/movies/:movieId/reviews
 * @access Public
 * @desc Get reviews for a movie
 */
//GET reviews for a movie
const getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const reviews = await Review.find({ movie: movieId });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route DELETE /api/reviews/:reviewId
 * @access Private
 * @desc Delete a review
 */
//delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route PUT /api/reviews/:reviewId
 * @access Private
 * @desc Update a review
 */
// UPDATE review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const updates = {};
    if (req.body.rating !== undefined) {
      const parsedRating = Number(req.body.rating);
      if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be a number between 1 and 5" });
      }
      updates.rating = parsedRating;
    }
    if (req.body.comment !== undefined) updates.comment = req.body.comment;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByMovie,
  deleteReview,
  updateReview,
};
