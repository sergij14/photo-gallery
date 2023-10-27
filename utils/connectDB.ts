import { MongoClient } from "mongodb";

const DB_STRING = process.env.DB_URI as string;
const DB_PASS = process.env.DB_PASS as string;

const DB_URI = DB_STRING.replace("<password>", DB_PASS);

let isConnected = false;
let mongoClient: MongoClient;

export const connectToDB = async () => {
  if (isConnected) {
    return mongoClient;
  }

  try {
    mongoClient = await MongoClient.connect(DB_URI);
    isConnected = true;

    return mongoClient;
  } catch (err) {
    console.log("Couldn't connect to db");
  }
};
