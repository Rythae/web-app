const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Product = require("./models/product");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

//requiring routes 
const commentRoutes = require("./routes/comments");
const productRoutes = require("./routes/products");
const indexRoutes = require("./routes/index");

mongoose.connect("mongodb://127.0.0.1/demo_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static( "./public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love the auth part of coding",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use(commentRoutes);

 





app.listen(3000, () => console.log("server has started!"));