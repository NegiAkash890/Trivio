var express                     =   require("express"),
    app                         =   express(),
    bodyParser                  =   require('body-parser'),
    dashboardRoutes             =   require("./routes/dashboard"),
    path                        =   require("path"),
    fs                          =   require("fs"),
    multer                      =   require("multer"),
    mongoose                    =   require("mongoose");

const mongoUrl = process.env.DATABASEURL || "mongodb://wecbr:wecbr123@ds219459.mlab.com:19459/wecbr";
mongoose.set('useUnifiedTopology', true);
const connection = mongoose.connect(mongoUrl, {useNewUrlParser: true}).catch(err=> console.log("Error connecting to DB: "+err));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());


app.use('/', dashboardRoutes);

app.listen(process.env.PORT || 8080, process.env.IP, function(req, res){
    console.log("Server connected ..."); 
});