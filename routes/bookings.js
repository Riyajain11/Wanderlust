const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :listingId from parent route if needed
const { isLoggedIn , validateListing} = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const bookingControllers = require("../controllers/bookings");

router.post("/", isLoggedIn , wrapAsync(bookingControllers.createBooking));
router.get("/:id", isLoggedIn , wrapAsync(bookingControllers.showBooking));

module.exports = router;
