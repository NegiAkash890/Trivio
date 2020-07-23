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
            text    : String,
            isAnswer: Boolean
        }],
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
    password    : String
});

module.exports  =   mongoose.model('Quiz', quizSchema);