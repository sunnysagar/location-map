import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant, Hotel, LocalCafe, Park, Museum, FilterList } from "@mui/icons-material";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";
import { getCountPerType, getAverageRatings, getTopReviewed, getIncompleteData, getLocations } from "../services/LocationServices";

// Custom Marker Icon
const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [25, 25],
});
// Icons Mapping
const typeIcons = {
    restaurant: <Restaurant style={{ color: "#FFD700", fontSize: 50 }} />, // Gold
    hotel: <Hotel style={{ color: "#FF6B81", fontSize: 50 }} />, // Coral
    cafe: <LocalCafe style={{ color: "#FFB347", fontSize: 50 }} />, // Orange
    park: <Park style={{ color: "#66CDAA", fontSize: 50 }} />, // Medium Aquamarine
    museum: <Museum style={{ color: "#5D8AA8", fontSize: 50 }} />, // Steel Blue
};

const Dashboard = () => {
    const [counts, setCounts] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [topLocation, setTopLocation] = useState({});
    const [selectedType, setSelectedType] = useState("");
    const [incomplete, setIncomplete] = useState([]);
    const [locations, setLocations] = useState([]); 

    useEffect(() => {
        async function fetchData() {
            setCounts((await getCountPerType()).data);
            setRatings((await getAverageRatings()).data);
            setTopLocation((await getTopReviewed()).data);
            setIncomplete((await getIncompleteData()).data);
            setLocations((await getLocations()).data);
        }
        fetchData();
    }, []);

    return (
        <Container  className="dashboard-container" >
            <Typography variant="h3" className="dashboard-title">
                 Location Dashboard
            </Typography>

            {/* 🔍 Filter Dropdown */}
            <Grid container justifyContent="center" style={{ marginBottom: "20px" }}>
                <FormControl variant="outlined" sx={{ minWidth: 400, backgroundColor: "#333", borderRadius: "8px",  color:"#fff"}}>
                    <InputLabel style={{ color: "#f25f0a" }}>Filter by Type</InputLabel>
                    <Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={{ color: "#fff", padding: "10px" }}
                    >
                        <MenuItem value=""><FilterList sx={{ mr: 1 }} /> All</MenuItem>
                        {counts.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {typeIcons[item._id]} {item._id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* 📊 Summary Cards */}
            <Grid container spacing={3} justifyContent="center" className="item-container">
                {counts.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card style={{
                                background: "linear-gradient(135deg, #2E2E2E, #3A3A3A)",
                                borderRadius: "12px",
                                color: "#FFF",
                                textAlign: "center",
                                padding: "20px",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.3s ease-in-out",
                            }} className="summary-card">
                                <CardContent className="card-content">
                                    {typeIcons[item._id]}
                                    <Typography variant="h6" style={{ marginTop: "10px" }}>{item._id}</Typography>
                                    <Typography variant="h4" style={{ fontWeight: "bold", marginTop: "5px" }}>{item.count}</Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* 📈 Bar Charts */}
            <Grid container spacing={3} sx={{ mt: 3 }} className="chart-container">
                <Grid item xs={12} md={6} className="chart-grid">
                    <motion.div whileHover={{ scale: 1.03 }}>
                        <Card style={{ background: "#2D2D2D", borderRadius: "12px", padding: "20px", color: "white", textAlign: "center" }} className="chart-card">
                            <Typography variant="h6">Valid Points per Type</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={counts}>
                                    <XAxis dataKey="_id" stroke="white" />
                                    <YAxis stroke="white" />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#00BFFF" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6} className="chart-grid">
                    <motion.div whileHover={{ scale: 1.03 }}>
                        <Card style={{ background: "#2D2D2D", borderRadius: "12px", padding: "20px", color: "white", textAlign: "center" }} className="chart-card">
                            <Typography variant="h6">Average Ratings</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ratings}>
                                    <XAxis dataKey="_id" stroke="white" />
                                    <YAxis stroke="white" domain={[0, 5]} />
                                    <Tooltip />
                                    <Bar dataKey="avgRating" fill="#FF6B81" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>

            {/* 🏆 Most Reviewed Location */}
            <motion.div whileHover={{ scale: 1.05 }}>
                <Card style={{ background: "#333", borderRadius: "12px", padding: "15px", textAlign: "center", marginTop: "20px", color: "#fff" }} className="highlight-card">
                    <Typography variant="h6">🏆 Most Reviewed Location</Typography>
                    {topLocation ? (
                        <Typography>
                            <strong>Type:</strong> {topLocation.type} | <strong>Reviews:</strong> {topLocation.reviews}
                        </Typography>
                    ) : (
                        <Typography>No data available</Typography>
                    )}
                </Card>
            </motion.div>

            {incomplete.length > 0 && (
            <Card className="incomplete-card" 
                    style={{ background: "#333", borderRadius: "12px", padding: "15px", marginTop: "20px", color: "#fff" }}>
                <Typography variant="h6" sx={{ color: "#D32F2F", textAlign: "center" }}>
                ⚠ Incomplete Locations
                </Typography>
                <TableContainer component={Paper} sx={{ background: "#222" }}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Latitude</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Longitude</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {incomplete.map((loc, index) => (
                        <TableRow key={index}>
                        <TableCell sx={{ color: "#fff" }}>{loc.id}</TableCell>
                        <TableCell sx={{ color: loc.latitude ? "#fff" : "#D32F2F" }}>
                            {loc.latitude ?? "Missing"}
                        </TableCell>
                        <TableCell sx={{ color: loc.longitude ? "#fff" : "#D32F2F" }}>
                            {loc.longitude ?? "Missing"}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Card>
            )}

            {/* Interactive Map */}
            <Card sx={{ mt: 3, p: 2 }} style={{ marginTop: "30px", padding: "10px", borderRadius: "12px", background: "#2D2D2D", color: "#fff" }}>
                <Typography variant="h6" sx={{ textAlign: "center" }}>🌍 Map View</Typography>
                <MapContainer center={[37.7749, -122.4194]} zoom={3} className="map-container">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {locations
                     .filter((loc) => loc.latitude !== null && loc.longitude !== null)
                    .map((loc) => (
                        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={customIcon}>
                            <Popup>
                                <strong>Type:</strong> {loc.type} <br />
                                <strong>Rating:</strong> {loc.rating} ⭐ <br />
                                <strong>Reviews:</strong> {loc.reviews}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                </Card>
        </Container>
    );
};

export default Dashboard;
