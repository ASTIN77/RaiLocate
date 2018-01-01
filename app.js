var express                 = require("express"),
    app                     = express(),
    session                 = require("express-session"),
    bodyParser              = require("body-parser"),
    router                  = express.Router(),
    axios                   = require("axios"),
    Promise                 = require("promise"),
    methodOverride          = require("method-override"),
    XMLHttpRequest          = require("xmlhttprequest").XMLHttpRequest,
    csv                     = require("fast-csv"),
    flash                   = require("connect-flash");

    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "OiOiSavaloyGiesASwatch",
    resave: false,
    saveUninitialized: false }));
app.use(session());
app.use(flash());
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.confirm = req.flash("confirm");
    next(); });

// INDEX ROUTE
app.get("/", function(req,res){
    res.render("landing");
});

// TRAIN ROUTES

app.get("/trains", function(req,res){
    res.render("trains");
    
});

app.post("/trains", function(req,res){
    var departing = req.body.departing;
    var destination = req.body.destination;
    
    var url = "http://huxleyapp.azurewebsites.net/departures/" + departing + "/to/" + destination +"/?accessToken=420b5ac9-3385-4b10-8419-5cfb557cfe2e&expand=true";
    console.log(url);

    

    axios.get(url)
    .then(function(response) {
        var trainResults = response.data;
        if(trainResults.trainServices) {
            req.flash("success","We have found matching results for your journey.");
            res.render("trainResults", { success: req.flash("success"), trainResults: trainResults});
        } else {
            req.flash("error", "I'm sorry, there are currently no direct services between these two stations..");
            res.redirect("back");
        }
    })
    .catch(function(error) {
        req.flash("error", "Search criteria returned zero results");
        res.redirect("back");
    });
    
});
    


    

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Application Server Running");
});



