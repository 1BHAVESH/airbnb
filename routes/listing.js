const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner, validateListing} = require("../middleweres.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


//index route and create route

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single("listing[image]"),(req, res)=>{
    res.send(req.file);
});
// .post(validateListing, isLoggedIn, wrapAsync(listingController.createNewListings));

//new route

router.get("/new", isLoggedIn, listingController.renderNewForm)

// update route and delete route and delete route

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroy));

 




// Edit route

router.get("/:id/edits", isLoggedIn,isOwner, wrapAsync(listingController.editListing));


module.exports = router;
