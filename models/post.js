const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema =   new Schema({
  username: { type: String, required: true },
  post: { type: String, required: true }
});



// Export model
module.exports = mongoose.model("Post", PostSchema);    