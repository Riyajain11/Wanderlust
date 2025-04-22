const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingControllers.index))
    .post(isLoggedIn,
        //  validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingControllers.createListing)
    );
      
      // Route to show listings by category
      router.get("/category/:categoryName", async (req, res) => {
        try {
            const { categoryName } = req.params;
            const filteredListings = await Listing.find({ category: categoryName });
    
            res.render("listings/index", { 
                allListings: filteredListings, 
                selectedCategory: categoryName
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    
      
      
// New Route
router.get("/new", isLoggedIn, wrapAsync(listingControllers.renderNewForm));

router
    .route("/:id")
    .get(wrapAsync(listingControllers.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingControllers.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingControllers.deleteListing)
    );

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.renderEditForm)
);

module.exports = router;