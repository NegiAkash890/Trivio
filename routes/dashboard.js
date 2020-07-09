var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz");

router.get('/', function(req, res) {
    res.render('index');
});

    //  Home page route 
router.post('/quiz/new', function(req, res){
    Quiz.register(req.body, function(err, quiz){
        if(err) {
            res.json({'error': err});
        } else if(quiz) {
            res.redirect('/');
        } else {
            res.redirect('/');
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