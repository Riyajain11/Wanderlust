const opencage = require('opencage-api-client');

const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
// const mapToken = process.env.MAPBOX_TOKEN; 
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings , selectedCategory: null});
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Server Error");
    }
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
}; 

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
        path:"author",
    },
})
    .populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist!"); 
        res.redirect("/listings");
    }
    // console.log(listing); 
    res.render("listings/show.ejs", { listing });
} 

module.exports.createListing = async (req, res, next) => {  
    let geoData = await opencage.geocode({ 
        q: req.body.listing.location, 
        key: process.env.OPENCAGE_API_KEY 
    });

    if (!geoData || geoData.results.length === 0) {
        req.flash("error", "Location not found. Try again.");
        return res.redirect("/listings/new");
    }

    let coordinates = geoData.results[0].geometry;

    let url = req.file.path;
    let filename = req.file.filename;  
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };  
    newListing.geometry = {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat]
    };
    newListing.category = req.body.listing.category;

    await newListing.save(); 
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");

    // let response = await geocodingClient
    //     .forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1,
    //  }) 
    // .send()
    

    // let url = req.file.path;
    // let filename = req.file.filename;  
    // const newListing = new Listing(req.body.listing); 
    // newListing.owner = req.user._id; 
    // newListing.image = { url, filename };  
    // newListing.geometry = response.body.features[0].geometry;
    // newListing.category = req.body.listing.category;  // ✅ Save category

    // let savedListing = await newListing.save();
    // await newListing.save(); 
    // req.flash("success" , "New Listing Created!");
    // res.redirect("/listings");
}; 

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist!"); 
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url; 
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250") 
    
    res.render("listings/edit.ejs", { listing , originalImageUrl});
}; 

module.exports.updateListing = async (req, res) => { 
    let { id } = req.params; 
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); 
    
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
} 

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
}  


