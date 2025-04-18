// import express from "express";
// import cors from "cors";
// import axios from "axios";

// const app = express();
// const PORT = 5000;

// // CORS configuration for frontend access
// const corsOptions = {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// let numberStore = []; // Stores up to 10 unique numbers

// // Function to fetch numbers from third-party APIs
// const fetchNumber = async (type) => {
//     const apiEndpoints = {
//         p: "https://20.244.56.144/evaluation-service/primes",
//         e: "https://20.244.56.144/evaluation-service/even",
//         r: "https://20.244.56.144/evaluation-service/fibo",
//     };

//     const url = apiEndpoints[type];
//     if (!url) return null;

//     try {
//         const response = await axios.get(url);

//         // Ensure correct response format
//         if (response.data && typeof response.data.number !== "undefined") {
//             return response.data.number;
//         } else {
//             console.error("Unexpected API response format:", response.data);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching number:", error.message);
//         return null;
//     }
// };

// // API route to fetch and store numbers
// app.post("/fetch", async (req, res) => {
//     const { type } = req.body;

//     if (!["p", "e", "r"].includes(type)) {
//         return res.status(400).json({ error: "Invalid type. Use 'p', 'e', or 'r'." });
//     }

//     const number = await fetchNumber(type);
//     if (number === null) {
//         return res.status(500).json({ error: "Failed to fetch number." });
//     }

//     // Store number while keeping window size 10 and ensuring uniqueness
//     if (!numberStore.includes(number)) {
//         if (numberStore.length >= 10) numberStore.shift(); // Remove oldest element if exceeding limit
//         numberStore.push(number);
//     }

//     // Calculate average if numbers exist
//     const average =
//         numberStore.length > 0
//             ? numberStore.reduce((sum, num) => sum + num, 0) / numberStore.length
//             : null;

//     res.json({ storedNumbers: numberStore, average });
// });

// // Handle preflight requests
// app.options("*", cors());

// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";

const app = express();
const PORT = 5000;
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

let numberStore = []; 


const httpsAgent = new https.Agent({
    rejectUnauthorized: false, 
});

const fetchNumber = async (type) => {
    const apiEndpoints = {
        p: "https://20.244.56.144/evaluation-service/primes",
        e: "https://20.244.56.144/evaluation-service/even",
        r: "https://20.244.56.144/evaluation-service/fibo",
    };

    const url = apiEndpoints[type];
    if (!url) {
        console.error(`Invalid type '${type}' received`);
        return null;
    }

    try {
        console.log(`Fetching number from ${url}`);
        const response = await axios.get(url, { httpsAgent }); 

       
        if (response.data && typeof response.data.number !== "undefined") {
            console.log(`Fetched number: ${response.data.number}`);
            return response.data.number;
        } else {
            console.error("Unexpected API response format:", response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching number from ${url}: ${error.message}`);
        return null;
    }
};


app.post("/fetch", async (req, res) => {
    console.log("Received request body:", req.body);
    const { type } = req.body;

    if (!["p", "e", "r"].includes(type)) {
        console.error(`Invalid request type: ${type}`);
        return res.status(400).json({ error: "Invalid type. Use 'p', 'e', or 'r'." });
    }

    const number = await fetchNumber(type);
    if (number === null) {
        console.error("Failed to fetch number");
        return res.status(500).json({ error: "Failed to fetch number." });
    }

    if (!numberStore.includes(number)) {
        if (numberStore.length >= 10) {
            console.log("Window size exceeded. Removing oldest number.");
            numberStore.shift(); 
        }
        numberStore.push(number);
    }

    const average =
        numberStore.length > 0
            ? numberStore.reduce((sum, num) => sum + num, 0) / numberStore.length
            : null;

    console.log(`Stored Numbers: ${numberStore}`);
    console.log(`Calculated Average: ${average}`);

    res.json({ storedNumbers: numberStore, average });
});


app.options("*", cors());

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
