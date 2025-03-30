import React, { useEffect, useState } from "react";
import { getCountPerType, getAverageRatings, getTopReviewed, getIncompleteData } from "../services/locationServices";
import { Container, Typography, Card, CardContent, Grid, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant, Hotel, LocalCafe, Park, Museum, FilterList } from "@mui/icons-material";
import { motion } from "framer-motion";
import "../styles/Dashboard.css"; // Import CSS

// Icons Mapping
const typeIcons = {
    restaurant: <Restaurant className="summary-icon" />,
    hotel: <Hotel className="summary-icon" />,
    cafe: <LocalCafe className="summary-icon" />,
    park: <Park className="summary-icon" />,
    museum: <Museum className="summary-icon" />,
};

const Dashboard = () => {
    const [counts, setCounts] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [topLocation, setTopLocation] = useState({});
    const [incomplete, setIncomplete] = useState([]);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        async function fetchData() {
            setCounts((await getCountPerType()).data);
            setRatings((await getAverageRatings()).data);
            setTopLocation((await getTopReviewed()).data);
            setIncomplete((await getIncompleteData()).data);
        }
        fetchData();
    }, []);

    return (
        <Container className="dashboard-container">
            <Typography variant="h3" className="dashboard-title">
                📍 Interactive Location Dashboard
            </Typography>

            {/* Filter Dropdown */}
            <Grid container justifyContent="center" className="filter-container">
                <FormControl variant="outlined" sx={{ minWidth: 500 }}>
                    <InputLabel>Filter by Type</InputLabel>
                    <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} label="Filter by Type">
                        <MenuItem value=""><FilterList sx={{ mr: 1 }} /> All</MenuItem>
                        {counts.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {typeIcons[item._id]} {item._id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Summary Cards */}
            <Grid container spacing={3} className="item-container">
                {counts.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card className="summary-card">
                                <CardContent>
                                    {typeIcons[item._id]}
                                    <Typography variant="h6">{item._id}</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>{item.count}</Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Bar Charts */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <motion.div whileHover={{ scale: 1.03 }}>
                        <Card className="chart-card">
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Valid Points per Type</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={counts}>
                                    <XAxis dataKey="_id" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#64B5F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <motion.div whileHover={{ scale: 1.03 }}>
                        <Card className="chart-card">
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Average Ratings</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ratings}>
                                    <XAxis dataKey="_id" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Bar dataKey="avgRating" fill="#81C784" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Most Reviewed Location */}
            <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="highlight-card">
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

            {/* Incomplete Data */}
            {incomplete.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Card className="incomplete-card">
                        <Typography variant="h6" sx={{ color: "#D32F2F" }}>⚠ Incomplete Data</Typography>
                        <pre>{JSON.stringify(incomplete, null, 2)}</pre>
                    </Card>
                </motion.div>
            )}

            {/* Interactive Map */}
            <Card sx={{ mt: 3, p: 2 }}>
                <Typography variant="h6" sx={{ textAlign: "center" }}>🌍 Map View</Typography>
                <MapContainer center={[37.7749, -122.4194]} zoom={3} className="map-container">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </Card>
        </Container>
    );
};

export default Dashboard;
