import mongoose from 'mongoose';

export class MongoDBClient {
    static connect() {
        mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`)
        .then(conn => {
            console.log(`MongoDB is connected: ${conn.connection.host}`);
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        });
    }
}