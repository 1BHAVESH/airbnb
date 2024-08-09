const Listing = require("../models/listing.js");

module.exports.index = async(req, res) =>{
    let allListings =  await Listing.find({});
    res.render("./listings/index.ejs", {allListings}); 
 };

 module.exports.renderNewForm = (req, res) =>{

    res.render("./listings/new.ejs");
 };

 module.exports.showListings = async(req, res) =>{

    let {id} = req.params;
    console.log(id);
    let listing = await Listing.findById(id).populate
    ({path: "reviews",
     populate: {
        path: "author",
     },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings"); 
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
}

module.exports.createNewListings = async(req, res, next) =>{
   
    let listing = req.body.listing;
   const newListing = new Listing(listing);
   newListing.owner = req.user._id;
   await newListing.save(); 
   req.flash("success", "New listing is created!");
   res.redirect("/listings"); 
}

module.exports.editListing = async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings"); 
    }
    res.render("./listings/edit.ejs", {listing});
}

module.exports.updateListings = async(req, res) =>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("success", "Listing is updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.destroy = async(req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); 
    req.flash("success", "Listing is deleted!");
    res.redirect("/listings");
    
}