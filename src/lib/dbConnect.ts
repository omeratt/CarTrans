import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_URI = "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("connected from cached");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      dbName: "CyberApp",
    };
    mongoose.set("strictQuery", false);
    try {
      cached.promise = await mongoose.connect(MONGODB_URI as string, opts);
      console.log("new connection");
    } catch (err: any) {
      console.log(err.message);
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
