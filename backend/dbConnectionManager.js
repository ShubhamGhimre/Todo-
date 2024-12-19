const mongoose = require("mongoose");

const Tenant = require("./models/Tenant");

const connections = {}; // Store tenant-specific database connections


const bdConnectionManager = async (req, res, next) => {
    const host = req.headers.host;
    const tenantId = host.split(".")[0]; // Extract subdomain from host

    console.log("Tenant ID: ", tenantId);
    if (!tenantId) return res.status(400).json({ error: "Tenant ID is missing" });
    

  if (!connections[tenantId]) {
    try {
      const tenant = await Tenant.findOne({ tenantId });
      if (!tenant) return res.status(404).json({ error: "Tenant not found" });
      // Create and cache the connection
      const conn = mongoose.createConnection(tenant.dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      connections[tenantId] = conn;
    } catch (error) {
      return res.status(500).json({ error: "Failed to connect to tenant database" });
    }
  }

  // Attach the tenant's connection to the request
  req.dbConnection = connections[tenantId];
  next();
}

module.exports = bdConnectionManager;