const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    try {
      const { listingId } = req.params;
      console.log("Received listingId:", listingId);
  
      const { startDate, endDate, guests } = req.body.booking;
      const listing = await Listing.findById(listingId);
  
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
  
    //Booking Details
      const start = new Date(startDate);
      const end = new Date(endDate);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * listing.price;
  
      const booking = new Booking({
        listing: listingId,
        user: req.user._id,
        startDate,
        endDate,
        guests,
        totalPrice,
      });
  
      await booking.save();
      req.flash("success", "Booking confirmed!");
      res.redirect(`/listings/${listingId}/bookings/${booking._id}`);


    } catch (error) {
      console.error("Booking creation error:", error);
      req.flash("error", "Booking failed.");
      res.redirect("back");
    }
  };
  

module.exports.showBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
        .populate("listing")
        .populate("user");
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/litings");
    }
    res.render("bookings/show", { booking });
}; 
