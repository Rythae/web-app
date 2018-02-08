const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const middleware = require("../middleware");

//INDEX - SHOW ALL PRODUCTS 
router.get("/",(req,res) => {
    //Get all products from DB
        Product.find({},(err, allProducts) => {
            if(err){
                console.log(err);
            } else {
                res.render("products/index", {products: allProducts});
            }
        });
    });
    
    //CREATE - ADD NEW PRODUCTS TO DB 
    router.post("/", middleware.isLoggedIn, (req,res) => {
    //get data from form and add to products
        let name = req.body.name;
        let image = req.body.image;
        let desc = req.body.description;
        let author = {
            id: req.user._id,
            username: req.user.username
        }
        let newProduct = {name: name, image: image, description: desc, author: author}
    //Create a new product and save to DB
        Product.create(newProduct,(err, newlyCreated) => {
            if(err){
                console.log(err);
            } else {
                res.redirect("/products");
            }
        });
        // redirect back to products page
    });
    
    // NEW- SHOW FORM TO CREATE NEW PRODUCTS 
    router.get("/new", middleware.isLoggedIn, (req, res) => {
        res.render("products/new");
    });
    
    //SHOW PAGE - SHOWS MORE INFO ABOUT ONE PRODUCT
    router.get("/:id",(req, res) => {
    //find the product with provided ID
        Product.findById(req.params.id).populate("comments").then((product) => {
    //  render show template with that product
        res.render("products/show", {product: product});   
        }).catch((err) => {
            console.log(err.message);
        })
        
    });

    //EDIT PRODUCT ROUTE 
    router.get("/:id/edit", middleware.checkProductOwnership, (req, res) => {
        Product.findById(req.params.id, (err, product) => {
            if(err){
                res.redirect("/products")
            } else {
                res.render("products/edit", {product: product});
            }
        });
        
    });
    // UPDATE PRODUCT ROUTE
    router.put("/:id", middleware.checkProductOwnership, (req, res) => {
        //find and update the correct product
        Product.findByIdAndUpdate(req.params.id, req.body.product, (err, updatedProduct) => {
            if(err){
                res.redirect("/products");
            } else {
                res.redirect("/products/" + req.params.id);
                // redirect somewhere(show page)
            }
        }) 
    });

    //DESTROY PRODUCT ROUTE
    router.delete("/:id", middleware.checkProductOwnership, (req, res) => {
        Product.findByIdAndRemove(req.params.id, (err) => {
            if(err){
                res.redirect("/products");
            } else {
                res.redirect("/products");
            }
        });
    });



    module.exports = router;


    