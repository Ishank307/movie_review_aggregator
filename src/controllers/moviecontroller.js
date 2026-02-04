const Movie = require("../models/Movie");
const mongoose = require("mongoose");

/**
 * @route POST /api/movies
 * @access Private
 * @desc Create a movie
 */
// CREATE movie
const createMovie = async (req, res) => {
  try {
    const { title, description, genre, releaseYear } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      releaseYear,
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/**
 * @route GET /api/movies
 * @access Public
 * @desc Get all movies with average rating and total reviews
 */
// used to get aggregate review of movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      {
        $lookup: {
          from: "reviews",          //Collection name
          localField: "_id",        //movies._id
          foreignField: "movie",    //reviews.movie
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0,
            ],
          },
          totalReviews: { $size: "$reviews" },
        },
      },
      {
        $project: {
          reviews: 0,
        },
      },
    ]);

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @route GET /api/movies/:id
 * @access Public
 * @desc Get movie by ID
 */
// GET movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route PUT /api/movies/:id
 * @access Private
 * @desc Update movie by ID
 */
// UPDATE movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const { title, description, genre, releaseYear } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (genre !== undefined) updates.genre = genre;
    if (releaseYear !== undefined) updates.releaseYear = releaseYear;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @route DELETE /api/movies/:id
 * @access Private
 * @desc Delete movie by ID
 */
// DELETE movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
