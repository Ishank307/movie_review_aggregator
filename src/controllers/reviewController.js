const Review = require("../models/Review");
const Movie = require("../models/Movie");
const { default: mongoose } = require("mongoose");

//adding review to a given movie
const addReview = async (req, res) => {
    try {
        const { movieId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: "invalid movie ID" });
        }

        const movieExists = await Movie.findById(movieId);
        if (!movieExists) {
            return res.status(404).json({ messager: "Movie not found" });
        }


        const review = await Review.create({
            movie: movieId,
            user: req.body.user, 
            rating: req.body.rating,
            comment: req.body.comment,
        });

        res.status(201).json(review);
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

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

module.exports = {
  addReview,
  getReviewsByMovie,
  deleteReview,
};