const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comments New 
    router.get("/products/:id/comments/new", middleware.isLoggedIn, (req, res) => {
        //find product by id
        Product.findById(req.params.id, (err, product) =>{
            if(err){
                console.log(err);
            } else {
                res.render("comments/new", {product: product}); 
            }
        })
    });

    //Comments Create 
    router.post("/products/:productId/comments", middleware.isLoggedIn, (req, res) => {
        //look up product using ID
        Product.findById(req.params.id, (err, product) => {
            if(err){
                console.log(err);
                res.redirect("/products");
            } else {             // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username  and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment 
            // connect new comment to product(using the above product found with ID in the above url(Product.findById..))
                comment.save().then((comment) => {
                    return Product.findById(req.params.productId)
                }).then((product) => {
                    product.comments.unshift(comment)
                    return product.save()
                }).then((product) => {
                    req.flash("success", "Successfully added comment");
                    res.redirect('/products/' +  product._id);  // redirect to product show page
                }).catch((err) => {
                    console.log(err);
                })
                }
            });
            }
        });
    });
    //COMMENT EDIT ROUTE 
    router.get("/products/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {product_id: req.params.id, comment: foundComment});
            }
        });
    });

    //COMMENT UPDATE
    router.put("/products/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
            if(err){
                res.redirect("back");
            } else {
                res.redirect("/products/" +  req.params.id);
            }

        });
    });
    // "/products/:id/comments/:comment_id" 
    //COMMENT DESTROY ROUTE
    router.delete("/products/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
        // findByIdAndRemove
        Comment.findByIdAndRemove(req.params.comment_id, (err) => {
            if(err){
                res.redirect("back");
            } else {
                req.flash("success", "Comment deleted");
                res.redirect("/products/" + req.params.id);
            }
        }); 
        
    });


    module.exports = router;