var mongoose                    =   require("mongoose"),
    passportLocalMongoose       =   require("passport-local-mongoose");

const user2Schema = new mongoose.Schema ({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    quizCreated: [{
    	type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }],
    quizAttempted: [{
        id: String, 
        topic: String, 
        score: Number,
        quesAttempt: Number,
        options: [{
            ques: Number,
            score: Number,
            option: [Number]
        }]
    }]
  });
  
user2Schema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model("User", user2Schema);