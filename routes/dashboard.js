var express                     =   require("express"),
    router                      =   express.Router(),
    Quiz                        =   require("../models/quiz"),
    multer                      =   require("multer");
    upload                      =   multer({dest: __dirname + '/uploads/images'});

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/uploads/images')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
//     });
// var upload = multer({ storage: storage });

router.get('/', function(req, res) {
    res.render('index');
});
 
router.post('/quiz/new', upload.any(), function(req, res) {    
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