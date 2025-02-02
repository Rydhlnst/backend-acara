import mongoose from "mongoose";
import {DATABASE_URL} from "./env"

const db = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: "db-acara"
        });
        return Promise.resolve("Database Connected!");
    } catch (error) {
        return Promise.reject(error);
    }
}

export default db;