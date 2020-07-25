var mongoose                    =   require("mongoose");

var quizSchema                  =   new mongoose.Schema({
    uniqueID    : String,
    topic       : String,
    description : String,
    date        : {type: Date},
    endDate     : {type: Date},
    image       : String,
    questions   : [{
        question    : String,
        image       : String,
        options     : [{
            image   : String,
            text    : String
        }],
        answer      : [Number],
        editorial   : String,
        points      : Number,
        duration    : Number
    }],
    author    : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalPoints : Number,
    totalDuration : Number,
    isPwdProtected : Boolean,
    password    : String,
    leaderBoard : [{
        name    : String,
        score   : Number
    }]
});

module.exports  =   mongoose.model('Quiz', quizSchema);