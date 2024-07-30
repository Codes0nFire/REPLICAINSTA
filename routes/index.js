var express = require('express');
var router = express.Router();
var localStrategy = require('passport-local');

const users=require("./users");
const postModel=require("./post");
var passport=require("passport");
const upload=require("./multer");
const imagekit=require("./imagekit");
const path=require("path");
passport.use(new localStrategy(users.authenticate()))

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed',async function(req, res) {
  const posts=await postModel.find().populate("user");
  const user=await users.findOne({username:req.session.passport.user});

  res.render('feed', {footer: true,posts,user});
  //  console.log(posts);
});

router.get('/profile',isloggedIn, async function(req, res) {

  const user=await users.findOne({username:req.session.passport.user}).populate('posts');
  // console.log("picturesis",userdata );
  res.render('profile', {footer:true,user});
});


router.get('/search',isloggedIn, async function(req, res) {
  let user=await users.findOne({username:req.session.passport.user});
  res.render('search', {footer: true,user});
});

router.get('/user/:search',async function(req, res) {
  const search=req.params.search;
  const user=await users.find({username: new RegExp('^'+search,'i')});
  res.json(user);
  console.log(user); 
});

router.get('/edit',async function(req, res) {
  var user=await users.findOne({username:req.session.passport.user});

  res.render('edit', {footer: true,user});
});


router.post('/update',async function(req, res) {
 
     var user= await  users.findOneAndUpdate(
          {username:req.session.passport.user},
          {username:req.body.username,name:req.body.name,bio:req.body.bio},
          {new:true}
          )

          req.login(user,function(err){
            if(err) throw err;
            else{
              res.redirect("/profile");
            }
          })

      
  
  
});


router.post('/edit/profilepicture',async function (req, res, next) {

   var user=await users.findOne({username:req.session.passport.user});

 
   const file=req.files.image;
   const modifiedfilename=`profileImage-${Date.now()}${path.extname(file.name)}`;


   if(user.profileImage.fileId !== ""){
    await imagekit.deleteFile(user.profileImage.fileId)
   }

   const {fileId,url}= await imagekit.upload({
    file:file.data,
    fileName:modifiedfilename
   });

  
   




   user.profileImage={fileId,url};
   await user.save();
   res.redirect("/profile");
   
})


router.get('/upload',isloggedIn, async function(req, res) {

  let user= await users.findOne({username:req.session.passport.user});
  res.render('upload', {footer: true,user});
});


router.post("/upload", async function(req,res){
  const user= await users.findOne({username:req.session.passport.user});


  
  const file=req.files.image;
  const modifiedfilename=`postimage-${Date.now()}${path.extname(file.name)}`;


  

  const {fileId,url}= await imagekit.upload({
   file:file.data,
   fileName:modifiedfilename
  });

  

  const post= await postModel.create({
    user:user._id,
    caption: req.body.caption,
    picture: {fileId,url}
  })

  user.posts.push(post._id);
  console.log("This is Post",post);
  await user.save();
  res.redirect("/profile");

})


router.post('/register', (req, res, next) => {
var newUser = {

  username:req.body.username,
  name:req.body.name,
  email:req.body.email,


};
users
.register(newUser, req.body.password)
.then((result) => {
passport.authenticate('local')(req, res, () => {
//destination after user register
res.redirect('/feed');
});
})
.catch((err) => {
res.send(err);
});
});


router.post(
'/login',
passport.authenticate('local', {
successRedirect: '/feed',
failureRedirect: '/login',
}),
(req, res, next) => {}
);



function isloggedIn(req, res, next) {
if (req.isAuthenticated()) return next();
else res.redirect('/login');
}




router.get('/logout', (req, res, next) => {
if (req.isAuthenticated())
req.logout((err) => {
if (err) res.send(err);
else res.redirect('/');
});
else {
res.redirect('/');
}
});








//saved
router.get("/save/:PostId", isloggedIn, async (req, res, next) => {
  let user = await users.findOne({ username: req.session.passport.user });

  if (user.saved.indexOf(req.params.PostId) == -1) {
    user.saved.push(req.params.PostId);
  } else {
    user.saved.splice(user.saved.indexOf(req.params.PostId), 1);
  }
  await user.save();
  console.log("saved",user.saved);
  res.redirect("back");
});





//likes
router.get("/like/:PostId", isloggedIn, async (req, res, next) => {
  let user = await users.findOne({ username: req.session.passport.user });

  let post = await postModel.findOne({_id:req.params.PostId});

  if (post.likes.indexOf(user.id) == -1) {
    post.likes.push(user.id);
  } else {
    post.likes.splice(post.likes.indexOf(user.id), 1);
  }
  await post.save();
  console.log("liked by",user.id,"post is ",post);
  res.redirect("back");
});










//usernprofile
router.get("/profile/:userId", isloggedIn, async (req, res, next) => {
  let user = await users.findOne({ _id: req.params.userId }).populate("posts");
  let loggedInUser= await users.findOne({username:req.session.passport.user});
  
  let userId= user._id;
  let loggedInUserId=loggedInUser._id;


  console.log(userId,loggedInUserId);

  if(loggedInUserId.equals(userId)){
    res.redirect("/profile");
  }


  else{

    res.render("userprofile",{user,footer: true,loggedInUser});

  }
  
  
 
 
  
  
});







//folllow 

router.get("/follow/:userId", isloggedIn, async (req, res, next) => {
  let user = await users.findOne({ _id: req.params.userId }).populate("posts");
  let loggedInUser= await users.findOne({username:req.session.passport.user});


  if(user.followers.indexOf(loggedInUser.id) == -1){

    user.followers.push(loggedInUser.id);
    loggedInUser.following.push(user.id);

  }

  else{

     user.followers.splice(user.followers.indexOf(loggedInUser.id),1);
     loggedInUser.following.splice(loggedInUser.following.indexOf(user.id),1);


  }



await user.save();

await loggedInUser.save();



  
console.log("you started following ",user.username);
  
  res.redirect("back");
 
 
  
  
});





// delete post 




router.get("/delete/:postId", isloggedIn, async (req, res, next) => {

  let post= await postModel.findOne({_id:req.params.postId});
 
  let deletedpost= await postModel.findOneAndDelete({_id:post.id});
  

console.log("you have deleted ",deletedpost);
  
  res.redirect("back");
 
 
  
  
});


//Navigate 





router.get("/navigate", isloggedIn, async (req, res, next) => {

  
 let user= await users.findOne({username:req.session.passport.user});


 res.render("navigator",{user});
 
 
  
  
});



//likedposts




router.get("/userposts", isloggedIn, async (req, res, next) => {

  
  let user= await users.findOne({username:req.session.passport.user}).populate("posts");
 
 
  res.render("userposts",{user,footer:true});
  
  
   
   
 });





 //saved posts

 
router.get("/savedposts", isloggedIn, async (req, res, next) => {

  
  let user= await users.findOne({username:req.session.passport.user})
  .populate({
    path: 'saved', // Field to populate
    populate: {
        path: 'user', // Nested field to populate
        model: 'user' // Model to use for nested population
    }
})
 
 
  res.render("savedposts",{user,footer:true});
 });



 //setting


 router.get("/setting", isloggedIn, async (req, res, next) => {

  
  let user= await users.findOne({username:req.session.passport.user})
  
 
 
  res.render("setting",{user,footer:true});
 });




 // delete account




 router.get("/deleteaccount", isloggedIn, async (req, res, next) => {

  
  let user= await users.findOne({username:req.session.passport.user});

  res.render("confirm",{user,footer:true});

 });



 //confirm

 router.post("/confirm", isloggedIn, async (req, res, next) => {

  let deleteduser= await users.findOneAndDelete({username:req.session.passport.user});

  console.log("This account is deleted", deleteduser);

  res.redirect("/");

 });




module.exports = router;
