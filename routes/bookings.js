const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :listingId from parent route if needed
const { isLoggedIn , validateListing} = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const bookingControllers = require("../controllers/bookings");

// Route to create a new booking for a listing
router.post("/", isLoggedIn , wrapAsync(bookingControllers.createBooking));

// Route to show a specific booking
router.get("/:id", isLoggedIn , wrapAsync(bookingControllers.showBooking));

module.exports = router;
