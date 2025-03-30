const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    latitude: { type: Number,  default: null },
    longitude: { type: Number,  default: null },
});

module.exports = mongoose.model("Location", locationSchema);
