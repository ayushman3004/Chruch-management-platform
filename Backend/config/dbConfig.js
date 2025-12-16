import mongoose, { mongo } from "mongoose";

const dbConnect = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        if(conn){
            console.log("MongoDB Connected Successfully");
        }
        else{
            console.log("MongoDB Connection Failed");
        }
    } catch (error) {
        
        console.log("MongoDB Connection Failed", error);
    }
}
export default dbConnect;