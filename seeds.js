const mongoose = require("mongoose");
const Product = require("./models/product");
const Comment = require("./models/comment");

const data = [
    {
        name:"Clouding",
        image:"https://images.unsplash.com/photo-1512303385664-9f4339ecc3f2?auto=format&fit=crop&w=1525&q=80",
        description:"For advanced cases, you can access the form-data object itself via r.form(). This can be modified until the request is fired on the next cycle of the event-loop. (Note that this calling form() will clear the currently set form data for that request.)"

    },

    {
        name:"Bold9",
        image:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1502&q=80",
        description:"For advanced cases, you can access the form-data object itself via r.form(). This can be modified until the request is fired on the next cycle of the event-loop. (Note that this calling form() will clear the currently set form data for that request.)"

    },

    {
        name:"images",
        image:"https://images.unsplash.com/photo-1510297182321-a75bdc5b1299?auto=format&fit=crop&w=1378&q=80",
        description:"For advanced cases, you can access the form-data object itself via r.form(). This can be modified until the request is fired on the next cycle of the event-loop. (Note that this calling form() will clear the currently set form data for that request.)"

    } 

]

function seedDB(){
    // Remove all products
    Product.remove({}, (err) =>{
        if(err){
            console.log(err);
        } 
            console.log("remove products");
     // add a few products 
     data.forEach((seed) => {
        Product.create(seed, (err, product) => {
            if(err){
                console.log(err);
            } else {
                console.log("added a product")
                //create a comment
                Comment.create(
                    {   text: "wow! lots of cool stuffs we have here",
                        author: "Smith"
                    }, (err, comment) =>{
                        if(err){
                            console.log(err);
                        } else{
                            product.comments.unshift(comment)
                            console.log("created new comment");
                             return product.save()
                        }
                        
                    }); 
            }
        });
    });
    
    });  
}

module.exports = seedDB;
