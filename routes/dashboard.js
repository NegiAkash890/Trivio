var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz"),
    multer                      =   require("multer"),
    shortid                     =   require('shortid'),
    upload                      =   multer({dest: __dirname + '/uploads/images'});


router.get('/', isLoggedIn, function(req, res) {
    res.render('index');
});
 
router.post('/quiz/new', isLoggedIn, upload.any(), function(req, res) {   
    var uniqueId    = shortid.generate();
    var quizObj     = {
        uniqueID    : uniqueId,
        topic       : req.body.topic,
        description : req.body.description,
        date        : new Date(req.body.date),
        duration    : req.body.duration,
        image       : req.body.image
    };
    quiz.author = req.user;
    Quiz.register(quizObj, function(err, quiz){
        if(err || !quiz) {
            res.redirect('/');
        } else {
            res.redirect('/quiz/addQuestion/'+uniqueId);
        }
    });
});

router.get('/quiz/addQuestion/:id', isLoggedIn ,function(req, res) {
    Quiz.findOne({uniqueId: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz.author === req.user) {
            res.render('question', {quiz: quiz});
        } else {
            res.redirect('/');
        }
    });
});

router.get('/quiz/:id', isLoggedIn ,function(req, res) {
    Quiz.findOne({uniqueId: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz) {
            res.render('filename', {quiz: quiz});
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