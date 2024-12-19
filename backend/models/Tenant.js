const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true }, // Subdomain or unique identifier
  dbUri: { type: String, required: true }, // URI for tenant-specific database
});

module.exports = mongoose.model("Tenant", tenantSchema);
