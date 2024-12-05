const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
    }),
    image: Joi.string().uri(),
 
    price: Joi.number().positive().required().messages({
      "number.base": "Price must be a number.",
      "number.positive": "Price must be a positive number.",
      "number.empty": "Price is required.",
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required.",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required.",
    }),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required().min(1).messages({
      "string.empty": "Review text cannot be empty.",
      "string.min": "Review text must be at least 1 character long.",
    }),
    rating: Joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating must be at most 5.",
    }),
  }).required(),
});

// Export both schemas
module.exports = {
  listingSchema,
  reviewSchema,
};
