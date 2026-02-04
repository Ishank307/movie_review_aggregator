# Movie Review Aggregator API

A RESTful backend for a Movie Review Aggregator built with **Node.js**, **Express**, and **MongoDB**. It keeps things simple while covering movie & review CRUD, JWT authentication, and an aggregation endpoint that returns average ratings per movie.

## Features
- Movie CRUD
- Review CRUD (per movie)
- JWT-based authentication
- Aggregation for average rating and review count
- Basic validation and error handling
- One review per user per movie

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcrypt

## Project Structure
```
server.js
src/
  app.js
  controllers/
    authcontroller.js
    moviecontroller.js
    reviewController.js
  middlewares/
    authMiddleware.js
  models/
    Movie.js
    Review.js
    User.js
  routes/
    authRoutes.js
    movieRoutes.js
    reviewRoutes.js
  database/
    db.js
```

## Setup Instructions

### 1) Clone & install
```bash
npm install
```

### 2) Configure environment
Create a `.env` file in the project root:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3) Start server
```bash
npm start
```
Server runs on `http://localhost:3000`

### 3a) Development mode
```bash
npm run dev
```

### 4) Health check
```
GET /health
```
Response:
```
API is running
```

## API Documentation

Base URL: `/api`

### Auth

#### Register
```
POST /api/auth/register
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
Response:
```json
{ "message": "User registered successfully" }
```

#### Login
```
POST /api/auth/login
```
Body:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```
Response:
```json
{ "token": "<jwt>" }
```

### Movies

#### Create Movie (Protected)
```
POST /api/movies
Authorization: Bearer <token>
```
Body:
```json
{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "genre": "Sci-Fi",
  "releaseYear": 2010
}
```

#### Get All Movies (with aggregation)
```
GET /api/movies
```
Response includes:
- `averageRating`
- `totalReviews`

#### Get Movie by ID
```
GET /api/movies/:id
```

#### Update Movie (Protected)
```
PUT /api/movies/:id
Authorization: Bearer <token>
```

#### Delete Movie (Protected)
```
DELETE /api/movies/:id
Authorization: Bearer <token>
```

### Reviews

#### Add Review to a Movie (Protected)
```
POST /api/movies/:movieId/reviews
Authorization: Bearer <token>
```
Body:
```json
{
  "rating": 5,
  "comment": "Amazing movie!"
}
```

#### Get Reviews for a Movie
```
GET /api/movies/:movieId/reviews
```

#### Delete Review (Protected)
```
DELETE /api/reviews/:reviewId
Authorization: Bearer <token>
```

#### Update Review (Protected)
```
PUT /api/reviews/:reviewId
Authorization: Bearer <token>
```
Body:
```json
{
  "rating": 4,
  "comment": "Updated thoughts after rewatch"
}
```

## Aggregation Details
The `GET /api/movies` endpoint performs a MongoDB aggregation:
- `$lookup` reviews for each movie
- `$avg` ratings for `averageRating`
- `$size` for `totalReviews`

## Error Handling
Common error responses:
```json
{ "message": "Invalid movie ID" }
{ "message": "Movie not found" }
{ "message": "Not authorized, token missing" }
{ "message": "You already reviewed this movie" }
```

## Validation Notes
- `title` is required for creating movies.
- `rating` must be a number between `1` and `5`.
- `email` and `password` are required for login.
- A user can submit only one review per movie.

## Notes
- JWT token must be included in `Authorization` header as: `Bearer <token>`
- Mongoose validation runs on create/update
- Only the review owner can update or delete their review

## License
MIT
