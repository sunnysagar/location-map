const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

module.exports = mongoose.model("Location", locationSchema);
