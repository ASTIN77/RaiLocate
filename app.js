var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash");

    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "OiOiSavaloyGiesASwatch",
    resave: false,
    saveUninitialized: false }));
app.use(flash());
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.confirm = req.flash("confirm");
    next(); });

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/trains", function(req,res){
    res.render("trains");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Application Server Running");
});