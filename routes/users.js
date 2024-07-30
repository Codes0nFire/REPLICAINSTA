var mongoose= require("mongoose");

const plm=require("passport-local-mongoose");

mongoose.connect("mongodb://0.0.0.0/newinstadb").then(()=>{
 console.log(`connected to DB`);
})
.catch((err)=>{
console.log(`error yah hai => err`);
})
var userSchema=mongoose.Schema({

username:String,
name:String,

posts:[
  {
    type:mongoose.Schema.Types.ObjectId,
      ref:"post"
  }
],
story:[],
messages:[],
profileImage: {
  type: Object,
  default:{
    fileId:"",
    url:"https://i.pinimg.com/564x/d4/37/4b/d4374b6dc2934880eaa7a5e8989c1f64.jpg"
  }
},
bio:String,
password:String,
email:String,

saved: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
],


followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
],
following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
],



})
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);







