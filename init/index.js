const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "67a2f949c4b86cfa63c0e6eb",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    mongoose.connection.close();
  } catch (err) {
    console.log("Error initializing DB:", err);
  }
}; 

initDB();

 
