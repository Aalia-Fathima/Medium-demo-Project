const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitedSchema = new Schema({
    username: String,
    count: Number,
});
module.exports = mongoose.model("Visited", visitedSchema);