import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getCountPerType = async () => {
    return await axios.get(`${API_URL}/count-per-type`);
};

export const getAverageRatings = async () => {
    return await axios.get(`${API_URL}/average-rating`);
};

export const getTopReviewed = async () => {
    return await axios.get(`${API_URL}/top-reviewed`);
};

export const getIncompleteData = async () => {
    return await axios.get(`${API_URL}/incomplete`);
};

export const getLocations = async () =>{
    return await axios.get(`${API_URL}/locations`)
}