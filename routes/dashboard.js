var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz");

router.get('/', isLoggedIn, function(req, res) {
    res.render('index');
});

    //  Home page route 
router.post('/new', function(req, res){
    
    Quiz.register(, function(err, quiz){
        if(err) {
            res.json({'error': err});
        } else {

        }
    });
});

        //  Middleware for checking authentication

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports  =   router;