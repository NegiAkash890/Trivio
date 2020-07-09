var mongoose                    =   require("mongoose");

var quizSchema                  =   new mongoose.Schema({
    uniqueID    : String,
    topic       : String,
    description : String,
    date        : {type: Date, default: Date.now},
    duration    : Number,
    image       : String,
    questions   : [{
        question    : String,
        image       : String,
        options     : [{option : String}],
        answer      : Number
    }],
    author    : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

module.exports  =   mongoose.model('User', userSchema);