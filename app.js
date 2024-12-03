const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// MongoDB URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main().then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true })); // For handling form data
// app.use(express.json()); // For handling JSON data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get("/", (req, res) => {
    res.send("Hi, I am Root");
});

// Validation middleware
const validateListing = (req, res, next) => {
   let { error } = listingSchema.validate(req.body);
    if (error) {
       let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
   let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New Route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingId = id.trim(); // Trims any whitespace around the ID
    const listing = await Listing.findById(listingId);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingId = id.trim();
    const listing = await Listing.findById(listingId);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingId = id.trim();
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingId = id.trim();
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// POST Review Rout
app.post("/listings/:id/reviews",validateReview, 
    wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
