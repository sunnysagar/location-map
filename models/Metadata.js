const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
});

module.exports = mongoose.model("Metadata", metadataSchema);
