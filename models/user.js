const mongoose = require("mongoose");

// Schema constructor
const Schema = mongoose.Schema;

// New schema constructor for user
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "comment"
    }
});

// User model schema
var User = mongoose.model("user", UserSchema);

module.exports = User;