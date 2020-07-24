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
    }]
  });
  
user2Schema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model("User", user2Schema);