var express = require("express"),
  app = express(),
  session = require("express-session"),
  cookieParser = require("cookie-parser"),
  memoryStore = require("session-memory-store")(session),
  bodyParser = require("body-parser"),
  router = express.Router(),
  axios = require("axios"),
  Promise = require("promise"),
  methodOverride = require("method-override"),
  XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(
  require("express-session")({
    secret: "OiOiSavaloyGiesASwatch",
    resave: false,
    saveUninitialized: false,
    store: new memoryStore(),
  })
);

app.use(flash());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.confirm = req.flash("confirm");
  next();
});

app.set("port", process.env.PORT || 3004);

// INDEX ROUTE
app.get("/", function (req, res) {
  res.render("landing");
});

// TRAIN ROUTES

app.get("/trains", function (req, res) {
  res.render("trains");
});

app.post("/trains", function (req, res) {
  var departing = req.body.departing;
  var destination = req.body.destination;
  /* test */
  var url =
    //"http://huxleyapp.azurewebsites.net/departures/" +
    "https://huxley2.azurewebsites.net/departures/" +
    departing +
    "/to/" +
    destination +
    "/?accessToken=f48868d3-6a1f-42d1-a40b-1389e7129139&expand=true";
  console.log(url);

  axios
    .get(url)
    .then((response) => {
      var trainResults = response.data;
      if (trainResults.trainServices) {
        req.flash(
          "success",
          "We have found matching results for your journey."
        );
        res.render("trainResults", {
          success: req.flash("success"),
          trainResults: trainResults,
        });
      } else {
        console.log(trainResults.trainServices);
        req.flash(
          "error",
          "I'm sorry, there are currently no direct services between these two stations.."
        );
        res.redirect("back");
      }
    })
    .catch((error) => {
      console.log(error.response);
      req.flash("error", "Search criteria returned zero results");
      res.redirect("back");
    });
});

app.listen(app.get("port"), () => {
  console.log("Application Server Running on port " + app.get("port"));
});
