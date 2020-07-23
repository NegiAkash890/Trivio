const { populate } = require("../models/quiz");

var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz"),
    multer                      =   require("multer"),
    shortid                     =   require('shortid');
    // upload                      =   multer({dest: 'uploads/images'});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.' + file.originalname.substr(file.originalname.lastIndexOf('.')+1))
    }
});
var upload = multer({ storage: storage });

router.get('/', isLoggedIn, function(req, res) {
    Quiz.find({}).populate('author').exec(function(err, quizzes) {
        res.render('quiz/renderquiz', {quizzes: quizzes});
    });
});

//  TO create new quiz - Create Quiz Page
router.get('/new', isLoggedIn, function(req, res) {
    var uniqueId    = shortid.generate();
    res.render('quiz/index', {uniqueID: uniqueId});
});
 
// To create new quiz in DB - POST request to insert details in DB.
router.post('/new', isLoggedIn, upload.single('quizImage'), function(req, res) {
    var quizObj     = {
        uniqueID    : req.body.uniqueId,
        topic       : req.body.topic,
        description : req.body.desc,
        date        : new Date(req.body.date+"T"+req.body.startTime+":00"),
        endDate     : new Date(req.body.enddate+"T"+req.body.endtime+":00"),
        totalDuration    : 0,
        password    : req.body.pwd,
        totalPoints : 0,
        image       : ""
    };
    quizObj["author"] = req.user;
    if(req.file) quizObj.image  = req.file.filename;
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
            res.render('quiz/questions1', {quiz: quiz});
        } else {
            res.redirect('/');
        }
    });
});

//  To add questions to a newly created quiz to DB - POST req.
var cpUpload = upload.fields([{ name: 'quesimg', maxCount: 1 }, { name: 'optionimg', maxCount: 4 }])
router.post('/addQuestion/:id', isLoggedIn, cpUpload, function(req, res) {
    console.log(req.body);
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz.author == req.user.id) {
            var question    =   {
                question    : req.body.question,
                editorial   : req.body.editorial,
                points      : req.body.points,
                duration    : req.body.duration,
                options     : []
            };
            for(var i=1; i<=4; i++) {
                var options = {};
                if(req.body['option'+i] != "") {
                    options = {text: req.body['option'+i], isAnswer: req.body['option'+i+'answer'] == '' ? true : false};
                }
                if(req.files && req.files['optionimg'] && req.files['optionimg'][i-1]) {
                    options['image'] = req.files['optionimg'][i-1].filename;
                };
                question.options.push(options);
            }
            if(req.files && req.files['quesimg'] && req.files['quesimg'][0]) {
                question["image"]  = req.files['quesimg'][0].filename;
            }
            quiz.totalDuration += parseInt(req.body.duration);
            quiz.totalPoints   += parseInt(req.body.points);
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
    console.log(req.params.id);
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else {
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