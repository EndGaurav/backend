import { config } from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"


config({
    path: "./env"
})
connectDB()
.then(() => {
    app.listen(process.env.PORT || 9000, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Mongodb connection failed !!! ", error);
})



// one way for connecting db.
/*
const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error;
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}port`);
        })
    } catch (error) {
        console.error("ERROR: ", error);
        throw err;
    }

})()
*/