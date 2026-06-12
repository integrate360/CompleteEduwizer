const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const databaseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const databaseUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.trim()
  : "";
const databaseName = process.env.DATABASE_NAME
  ? process.env.DATABASE_NAME.trim()
  : "";

mongoose
  .connect(
    `${databaseUrl}${databaseName}?retryWrites=true&w=majority`,
    databaseOptions,
  )
  .then(() => {
    console.log("✅ Database successfully connected.");
  })
  .catch((err) => {
    console.error("❌ Error in connecting database:", err);
  });

const db = mongoose.connection;

db.on("close", () => {
  console.log("🔌 Database disconnected.");
});

module.exports = mongoose;
