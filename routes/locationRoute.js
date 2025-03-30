const express = require("express");
const Location = require("../models/location");
const Metadata = require("../models/Metadata")   

const router = express.Router();

// Load Initial Data into MongoDB
router.post("/load-data", async (req, res) => {
    try {
        const { locations, metadata } = req.body;

        await Location.insertMany(locations);
        await Metadata.insertMany(metadata);

        res.json({ message: "Data Loaded Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

//  Get All Merged Data
router.get("/locations", async (req, res) => {
    try {
        const locations = await Location.find();
        const metadata = await Metadata.find();

        const mergedData = locations.map((loc) => {
            const meta = metadata.find((m) => m.id === loc.id);
            return meta ? { ...loc.toObject(), ...meta.toObject() } : loc.toObject();
        });

        res.json(mergedData);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// Get valid points per type
router.get("/count-per-type", async (req, res) => {
    try {
        const counts = await Metadata.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);
        res.json(counts);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get average ratings per type
router.get("/average-rating", async (req, res) => {
    try {
        const ratings = await Metadata.aggregate([
            { $group: { _id: "$type", avgRating: { $avg: "$rating" } } },
        ]);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get the location with the most reviews
router.get("/top-reviewed", async (req, res) => {
    try {
        const topLocation = await Metadata.findOne().sort("-reviews").limit(1);
        res.json(topLocation);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get locations with incomplete data
router.get("/incomplete", async (req, res) => {
    try {
        const incomplete = await Location.find({
            $or: [{ latitude: null }, { longitude: null }],
        });

        res.json(incomplete);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
