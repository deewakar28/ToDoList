import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/ToDoList`)
        console.log("MongoDB Connected!!")
    }catch(error){
        console.log("MONGODB connection is Failed!!", error);
        process.exit(1);
    }
    
}

export default connectDB;