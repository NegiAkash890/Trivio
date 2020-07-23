var express                     =   require("express"),
    router                      =   express.Router(),
    User                        =   require("../models/user"),
    multer                      =   require("multer"),
    passport                    =   require('passport'),
    upload                      =   multer({dest: __dirname + '/uploads/images'});

//  Homepage
router.get("/", function(req, res){
  res.render('user/dashboard');
});
  
//   Login Page 
router.get("/login", function(req, res){
    res.render("user/login");
});
  
//  Register Page
router.get("/register", function(req, res) {
    res.render("user/register");
});   

//  Logout API
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});
  
//  POST API - To register User 
router.post("/register", function(req, res){
    User.register({username: req.body.username, firstName:req.body.firstName, lastName:req.body.lastName}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/");
        });
      }
    });
  
});
  
//     POST Api - To Login User
router.post("/login", function(req, res){
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/");
        });
      }
    });
});

module.exports = router;