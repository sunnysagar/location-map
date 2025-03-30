#  SpotIQ - Intellegence Location Mapper

This project is a **Node.js + Express API** that serves **location-based data** stored in **MongoDB**. It provides endpoints to **analyze, retrieve, and process location information**.

---

##  Features
✔ **Store & Manage Location Data** in MongoDB.  
✔ **Merge Location & Metadata** dynamically.  
✔ **Analyze Data** (Valid Points, Average Ratings, Top Locations).  
✔ **Identify Incomplete Data** for corrections.  

---

##  Tech Stack
- **Node.js & Express.js** - Backend Framework  
- **MongoDB & Mongoose** - Database & ORM  
- **Cors & Morgan** - Middleware for security & logging  

---

##  Setup & Installation
```bash
# 1️⃣ Clone the Repository
git clone https://github.com/your-repo/backend.git
cd backend

# 2️⃣ Install Dependencies
npm install

# 3️⃣ Setup Environment Variables
touch .env
MONGO_URI=mongodb+srv://your-connection-string
PORT=5000

