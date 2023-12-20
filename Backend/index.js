import { app,port } from "./app";
import dotenv from 'dotenv';
import connectDB from "./db";
import { Todo } from "./models/Todo";

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is runnit at: ${port}`);
    })
})
.catch((error)=>{
    console.log (error);
})

app.get("/api",(req,res)=>{
    
})
