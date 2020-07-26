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
        totalPoints : 0,
        image       : "",
        isPwdProtected : false,
        password    : ""
    };
    if(req.body.isPwdProtected == '1') {
        quizObj.isPwdProtected  =   true,
        quizObj.password        =   req.body.pwd;
    }
    quizObj["author"] = req.user;
    if(req.file) quizObj.image  = req.file.filename;
    Quiz.create(quizObj, function(err, quiz){
        if(err) {
            console.log(err);
            res.redirect('/quiz/new');
        } else {
            req.user.quizCreated.push(quiz);
            req.user.save();
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
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/');
        } else if(quiz.author == req.user.id) {
            var question    =   {
                question    : req.body.question,
                editorial   : req.body.editorial,
                points      : req.body.points,
                duration    : req.body.duration,
                options     : [],
                answer      : []
            };
            for(var i=1; i<=4; i++) {
                var options = {};
                if(req.body['option'+i] != "") {
                    options = {text: req.body['option'+i]};
                }
                if(req.files && req.files['optionimg'] && req.files['optionimg'][i-1]) {
                    options['image'] = req.files['optionimg'][i-1].filename;
                };
                if(req.body['option'+i+'answer'] == '' ? true : false) {
                    question.answer.push (i);
                }
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

// To attempt the quiz.
router.get('/:id', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/quiz');
        } else {
            res.render('quiz/attemptQuiz', {quiz: quiz});
        }
    });
});

//  To play the quiz acc. to uniqueID.
router.get('/attempt/:id/:idx', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        var idx = parseInt(req.params.idx);
        if(err || !quiz) {
            res.redirect('/quiz');
        } else if(idx>=quiz.questions.length) {
            res.redirect('/quiz/score/'+req.params.id);
        } else {
            function findIdx(obj) {
                return obj.id == quiz.uniqueID;
            }

            //Shuffling questions
            var options = [];
            var currentIndex = quiz.questions.length, temporaryValue, randomIndex;
            for(var i=0; i<currentIndex; i++) {
                options.push({ques: i, score: 0, option: []});
            }
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = options[currentIndex];
                options[currentIndex] = options[randomIndex];
                options[randomIndex] = temporaryValue;
            }

            if(quiz.isPwdProtected && req.user.quizAttempted.findIndex(findIdx) == -1) {
                if(quiz.password == req.query.pwd) {
                    req.user.quizAttempted.push({id: quiz.uniqueID, score: 0, topic: quiz.topic, options: options, quesAttempt: 1});
                    req.user.save();  
                    quiz.leaderBoard.push({name: req.user.firstName, score: 0});
                    quiz.save();
                    res.render('quiz/quizlayout', {question: quiz.questions[options[0].ques], current: 0, total: quiz.questions.length, id: quiz.uniqueID});
                } else {
                    res.redirect('/quiz/'+req.params.id);
                }
            } else if(quiz.isPwdProtected && req.user.quizAttempted.findIndex(findIdx) != -1) {
                function checkidx(obj) {
                    return obj.id == req.params.id;
                }
                var index = req.user.quizAttempted.findIndex(checkidx);
                var quizIdx = req.user.quizAttempted[index].quesAttempt;
                if(quizIdx >= quiz.questions.length) res.redirect('/quiz/score/'+req.params.id);
                res.render('quiz/quizlayout', {question: quiz.questions[quizIdx], current: quizIdx, total: quiz.questions.length, id: quiz.uniqueID});
            } else if(!quiz.isPwdProtected && req.user.quizAttempted.findIndex(findIdx) == -1) {
                req.user.quizAttempted.push({id: quiz.uniqueID, score: 0, topic: quiz.topic, options: options, quesAttempt: 1});
                req.user.save();
                quiz.leaderBoard.push({name: req.user.firstName, score: 0});
                quiz.save();
                res.render('quiz/quizlayout', {question: quiz.questions[options[0].ques], current: 0, total: quiz.questions.length, id: quiz.uniqueID});
            } else {
                function checkidx(obj) {
                    return obj.id == req.params.id;
                }
                var index = req.user.quizAttempted.findIndex(checkidx);
                var quizIdx = req.user.quizAttempted[index].quesAttempt;
                if(quizIdx >= quiz.questions.length) res.redirect('/quiz/score/'+req.params.id);
                res.render('quiz/quizlayout', {question: quiz.questions[quizIdx], current: quizIdx, total: quiz.questions.length, id: quiz.uniqueID});
            }
        }
    });
});


router.post('/attempt/:id/:idx', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        var idx = parseInt(req.params.idx);
        if(err || !quiz) {
            res.redirect('/quiz');
        } else if(idx>quiz.questions.length) {
            res.redirect('/quiz/score'+req.params.id);
        } else {
            function checkidx(obj) {
                return obj.id == req.params.id;
            }
            var index = req.user.quizAttempted.findIndex(checkidx);
            var options = [];
            for(var i=0; i<4; i++) {
                if(req.body['option'+i] == '') {
                    options.push(i+1);
                }
            }
            var Score = 0;
            var value = quiz.questions[req.user.quizAttempted[index].options[idx-1].ques].points/quiz.questions[req.user.quizAttempted[index].options[idx-1].ques].answer.length;
            for(var i=0; i<options.length; i++) {
                if(quiz.questions[req.user.quizAttempted[index].options[idx-1].ques].answer.includes(options[i])) {
                    Score++;
                }
            }
            if(Score == quiz.questions[req.user.quizAttempted[index].options[idx-1].ques].answer.length) {
                Score = quiz.questions[req.user.quizAttempted[index].options[idx-1].ques].points;
            } else {
                Score = Score*value;
            }
            req.user.quizAttempted[index].score += Score;
            req.user.quizAttempted[index].options[idx-1].score = Score;
            req.user.quizAttempted[index].options[idx-1].option = options;
            req.user.quizAttempted[index].quesAttempt += 1;
            req.user.save();
            function checkquizidx(quiz) {
                return quiz.name == req.user.firstName;
            }
            var quizIndex = quiz.leaderBoard.findIndex(checkquizidx);
            quiz.leaderBoard[quizIndex].score += Score;
            quiz.save();
            if(idx == quiz.questions.length) {
                res.redirect('/quiz/score/'+req.params.id);
            } else {
                res.render('quiz/quizlayout', {question: quiz.questions[req.user.quizAttempted[index].options[idx].ques], current: idx, total: quiz.questions.length, id:quiz.uniqueID});
            }
        }
    });
});

//  To show the quiz details acc. to uniqueID.
router.get('/score/:id', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/quiz');
        } else {
            function checkidx(obj) {
                return obj.id == req.params.id;
            }
            var index = req.user.quizAttempted.findIndex(checkidx);
            if(index != -1) {
                res.render('quiz/scores', {quiz: quiz, response: req.user.quizAttempted[index]});
            } else {
                res.redirect('/quiz/leaderboard/'+req.params.id, {quiz: quiz});
            }
        }
    });
});

//  To show the quiz details acc. to uniqueID.
router.get('/leaderboard/:id', function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/quiz');
        } else {
            function checkidx(obj) {
                return obj.id == req.params.id;
            }
            var index = -1;
            if(req.user) {
                index = req.user.quizAttempted.findIndex(checkidx);
            }
            var array = quiz.leaderBoard;
            array.sort(function(a, b){return b.score-a.score});
            res.render('quiz/table', {quiz: quiz, leaderboard: array, index: index});
        }
    });
});

// To delete questions from quiz.
router.post('/:id/delete/:idx', isLoggedIn, function(req, res) {
    Quiz.findOne({uniqueID: req.params.id}, function(err, quiz) {
        if(err || !quiz) {
            res.redirect('/quiz/addQuestion/'+req.params.id);
        } else if(req.user.id == quiz.author) {
            if(req.params.idx >= 0 && req.params.idx < quiz.questions.length) {
                var question = quiz.questions[req.params.idx];
                quiz.questions.splice(req.params.idx, 1);
                quiz.totalDuration -= question.duration;
                quiz.totalPoints   -= question.points;
                quiz.save();
            }
            res.redirect('/quiz/addQuestion/'+req.params.id);
        } else {
            res.redirect('/quiz/addQuestion/'+req.params.id);
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