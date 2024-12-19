require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dbConnectionManager = require("./dbConnectionManager");
const app = express();
const cors = require("cors");
// Middleware
app.use(express.json());
app.use(cookieParser());

// Custom Dynamic CORS Middleware
app.use(async (req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return next(); // Skip if there's no origin (e.g., server-to-server requests)
  }

  try {
    // extract the tenentId from domain
    const tenantSubdomain = new URL(origin).hostname.split('.')[0];

    // Check if the tenant exists in the central database
    const tenantExists = await Tenant.findOne({ tenantId: tenantSubdomain });

    if (tenantExists) {
      // If tenant exists, allow CORS
      cors({
        origin: origin,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })(req, res, next);
    }
    else {
      if(!tenantExists){
          
      }else{

        // Deny access if tenant doesn't exist
        res.status(403).json({ message: "Unauthorized origin" });
      }
    }
  } catch (err) {
    console.error("Error validating tenant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Centralized Tenant Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Central Tenant Database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Tenant Registration Route
app.post("/api/tenant/register", async (req, res) => {
  const { tenantName } = req.body;

  if (!tenantName) {
    return res.status(400).json({ message: "Tenant name is required" });
  }

  // Step 1: Dynamically create a tenant database URI
  try {
    const tenantDbUri = `mongodb://localhost:27017/${tenantName}_db`; // Dynamically create tenant database URI
    const tenantDbConnection = mongoose.createConnection(tenantDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Step 2: Create tenant-specific collections in their database
    const tenantTodoModel = tenantDbConnection.model(
      "Todo",
      new mongoose.Schema({
        task: { type: String, required: true },
        completed: { type: Boolean, default: false },
      })
    );

    // Step 3: Save tenant info in the central database (tenant management)
    // const tenantModel = mongoose.model('Tenant', new mongoose.Schema({
    //   tenantId: String,
    //   dbUri: String
    // }));

    const tenant = new Tenant({ tenantId: tenantName, dbUri: tenantDbUri });
    await tenant.save();

    console.log(`New tenant database created at ${tenantDbUri}`);

    return res
      .status(201)
      .json({ message: `Tenant '${tenantName}' registered successfully.` });
  } catch (err) {
    console.error("Error creating tenant:", err);
    return res
      .status(500)
      .json({ message: "Error creating tenant", error: err });
  }
});

// Use dbConnectionManager for dynamic tenant DB connections
app.use(dbConnectionManager); // This will be applied to all routes below

// Routes for authentication and todos
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const Tenant = require("./models/Tenant");

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
