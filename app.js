var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg",
//         description: "This is a huge granite hill, no bathrooms, no water, beautiful granite!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("newly created campground: ");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("index", {campgrounds: allcampgrounds});
        }
    })
    
});

app.post("/campgrounds", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image: image, description: desc};
   
   // Create a new campground, save to db
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/campgrounds");
       }
   });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("show", {campground: foundCampground});
       }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});