// const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const async = require("async");


exports.save_post = function(req, res, next) { //Save post
  try {
    const post = new Post({ //creates new model object
      username: req.body.user,    //
      post: req.body.messageText
    }); 
    const result = post.save(); //
    res.redirect("/");  //send back to index
  }
    catch(err){
    return next(err) 
  }
};

exports.delete_post = async(req, res, next) => { //Delete post 
  console.log('//////////')
  console.log(req); 

  await Post.deleteOne({_id: req.body.id} );
  // const posts = await Post.find();
  
  res.redirect("/");  
  // res.render("index", { 
  //   user:req.user, 
  //   post_list: posts,
  //   message: req.flash('error')
  // });

}


exports.post_list = async (req, res, next) => {
  const posts = await Post.find();

  res.render("index", { 
        user:req.user, 
        post_list: posts,
        message: req.flash('error')
      });
}

// exports.post_list = function (req, res, next) {
//   async.parallel( 
//     {
//       posts(callback){
//         Post.find().then( ); //find all posts
//       }

//     }, 
//     (err, results) => {      
//       if (err) {
//         return next(err);
//       }
//       else 
//       //Successful, so render
//       res.render("index", { 
//         user:req.user, 
//         post_list: results.posts});
//     });
// };