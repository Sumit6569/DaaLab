import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { Student } from "../models/student.model.js"; // Correct path to your Student model

const updateProviderIds = async () => {
    await Student.updateMany(
        { providerId: null },
        { $unset: { providerId: "" } }
    );
};

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected !! DB Hosted on : ${connectionInstance.connection.host}`);

        await updateProviderIds();

        try {
            await Student.collection.dropIndex('providerId_1');
        } catch (indexError) {
        }

        // Ensure the index is sparse
        await Student.collection.createIndex({ providerId: 1 }, { unique: true, sparse: true });

    } catch (error) {
        console.log("MONGODB connection error: ", error.stack);
        process.exit(1);
    }
};

export default connectDB;
