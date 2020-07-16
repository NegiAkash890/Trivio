var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz"),
    multer                      =   require("multer"),
    shortid                     =   require('shortid'),
    upload                      =   multer({dest: '/uploads/images'});

//  TO create new quiz - Create Quiz Page
router.get('/new', isLoggedIn, function(req, res) {
    res.render('quiz/index');
});
 
// To create new quiz in DB - POST request to insert details in DB.
router.post('/new', isLoggedIn, upload.single('photo'), function(req, res) {  
    console.log(req.body); 
    var uniqueId    = shortid.generate();
    var quizObj     = {
        uniqueID    : uniqueId,
        topic       : req.body.topic,
        description : req.body.description,
        date        : new Date(req.body.date),
        duration    : req.body.duration,
        image       : request.file.filename
    };
    quiz.author = req.user;
    Quiz.register(quizObj, function(err, quiz){
        if(err || !quiz) {
            res.redirect('quiz/new');
        } else {
            res.redirect('quiz/addQuestion/'+uniqueId);
        }
    });
});


//  To add questions to a newly created quiz - Page.
router.get('/addQuestion/:id', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueId: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz.author === req.user) {
            res.render('quiz/question', {quiz: quiz});
        } else {
            res.redirect('/');
        }
    });
});

//  To add questions to a newly created quiz to DB - POST req.
router.post('/addQuestion/:id', isLoggedIn, upload.single('photo'), function(req, res) {
    Quiz.findOne({uniqueId: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz.author === req.user) {
            var question    =   {
                question    : req.body.question,
                image       : request.file.filename,
                answer      : req.body.correctAnswer,
                editorial   : req.body.editorialText
            };
            question['options'] = [req.body.ans1, req.body.ans2, req.body.ans2, req.body.ans4];
            quiz.push(question);
            quiz.save();
            res.redirect('quiz/addQuestion/'+req.params.id, {quiz: quiz});
        } else {
            res.redirect('/');
        }
    });
});

//  To show the quiz details acc. to uniqueID.
router.get('/:id', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueId: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz) {
            res.render('quiz/filename', {quiz: quiz});
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