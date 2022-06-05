const mongoose=require('mongoose')
// import mongoose from 'mongoose'
const URI="mongodb://localhost:27017/notes-pro"

const connectToMongo=()=>{
    mongoose.connect(URI, ()=>{
        console.log("connected to mongo successfully")
    })
}


// module.exports=connectToMongo;

// export {connectToMongo}

module.exports=connectToMongo;