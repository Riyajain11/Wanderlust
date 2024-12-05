const Joi = require('joi');
const { listingSchema, reviewSchema } = require('../schema.js'); // Adjust if your schema file is in a different location

// Middleware to validate listing data
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Middleware to validate review data
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateListing,
  validateReview,
};
