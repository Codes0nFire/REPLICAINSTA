var mongoose= require("mongoose");

const plm=require("passport-local-mongoose");

mongoose.connect("mongodb://0.0.0.0/newinstadb").then(()=>{
 console.log(`connected to DB`);
})
.catch((err)=>{
console.log(`error yah hai => err`);
})
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username must be at most 30 characters long"],
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
    trim: true
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
  story: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "story"
    }
  ],
  messages: [],
  profileImage: {
    type: Object,
    default: {
      fileId: "",
      url: "https://i.pinimg.com/564x/d4/37/4b/d4374b6dc2934880eaa7a5e8989c1f64.jpg"
    }
  },
  bio: {
    type: String,
    maxlength: [200, "Bio must be at most 200 characters long"],
    trim: true
  },
  password: {
    type: String,
  
    minlength: [5, "Password must be at least 5 characters long"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
       
        return /^\S+@\S+\.\S+$/.test(v); 
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  saved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  contact: {
    type: Number,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit contact number`
    }
  }
});

userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);







