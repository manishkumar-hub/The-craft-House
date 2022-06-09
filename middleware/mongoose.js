import mongoose  from "mongoose";

const { MongoClient, ServerApiVersion } = require('mongodb');


const connectDb = handler => async (req,res)=>{
    if (mongoose.connections[0].readyState) {
        return handler (req,res) 
    }
    
    await mongoose.connect(process.env.MONGO_URI, {  useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    return handler(req,res);
}

export default connectDb ; 