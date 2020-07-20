var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz"),
    multer                      =   require("multer"),
    shortid                     =   require('shortid');
    // upload                      =   multer({dest: 'uploads/images'});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

//  TO create new quiz - Create Quiz Page
router.get('/new', isLoggedIn, function(req, res) {
    var uniqueId    = shortid.generate();
    res.render('quiz/index', {uniqueID: uniqueId});
});
 
// To create new quiz in DB - POST request to insert details in DB.
router.post('/new', isLoggedIn, upload.single('quizImage'), function(req, res) {
    console.log(req.body);
    var quizObj     = {
        uniqueID    : req.body.uniqueId,
        topic       : req.body.topic,
        description : req.body.desc,
        date        : new Date(req.body.date+"T"+req.body.startTime+":00"),
        endDate     : new Date(req.body.enddate+"T"+req.body.endtime+":00"),
        duration    : req.body.duration,
        password    : req.body.pwd,
    };
    quizObj["author"] = req.user;
    if(req.files) question["image"]  = req.file.filename;
    Quiz.create(quizObj, function(err, quiz){
        if(err) {
            console.log(err);
            res.redirect('/quiz/new');
        } else {
            res.redirect('/quiz/addQuestion/'+req.body.uniqueId);
        }
    });
});


//  To add questions to a newly created quiz - Page.
router.get('/addQuestion/:id', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            console.log(err);
            res.redirect('/');
        } else if(quiz.author == req.user.id) {
            res.render('quiz/questions', {quiz: quiz});
        } else {
            res.redirect('/');
        }
    });
});

//  To add questions to a newly created quiz to DB - POST req.
router.post('/addQuestion/:id', isLoggedIn, upload.single('photo'), function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz.author == req.user.id) {
            var question    =   {
                question    : req.body.question,
                answer      : req.body.answer,
                editorial   : req.body.editorial
            };
            if(req.files) question["image"]  = req.file.filename;
            question['options'] = [{text: req.body.option1}, {text: req.body.option2}, {text: req.body.option3}, {text: req.body.option4}];
            quiz.questions.push(question);
            quiz.save();
            res.redirect('/quiz/addQuestion/'+req.params.id);
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