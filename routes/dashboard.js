var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz"),
    multer                      =   require("multer");
    upload                      =   multer({dest: __dirname + '/uploads/images'});


router.get('/', isLoggedIn, function(req, res) {
    res.render('index');
});
 
router.post('/quiz/new', isLoggedIn, upload.any(), function(req, res) {   
    
    var quizObj    = {
        uniqueID    : req.body.uniqueID,
        topic       : req.body.topic,
        description : req.body.description,
        date        : new Date(req.body.date),
        duration    : req.body.duration,
        image       : req.body.image
    };
    quiz.author = req.user;
    for(var i=0; i<req.body.totalQuestions; i++) {
        var quizQues    = {
            question    : req.body['question'+i],
            image       : req.body['image'+i],
            answer      : req.body['answer'+i]
        };
        for(var j=0; j<4; j++) {
            quizQues.options.push(req.body['options'+i+j]);
        }
        quiz.question.push(quizQues);
    } 
    Quiz.register(quizObj, function(err, quiz){
        if(err || !quiz) {
            res.redirect('/');
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