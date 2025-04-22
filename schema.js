const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri(),
 
    price: Joi.number().positive().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required().min(1),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

// Export both schemas
module.exports = {
  listingSchema,
  reviewSchema,
};
