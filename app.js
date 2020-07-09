var express                     =   require("express"),
    dashboardRoutes             =   require("./routes/dashboard"),
    mongoose                    =   require("mongoose");

const mongoUrl = process.env.DATABASEURL || "";
mongoose.set('useUnifiedTopology', true);
const connection = mongoose.connect(mongoUrl, {useNewUrlParser: true}).catch(err=> console.log("Error connecting to DB: "+err));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());


app.use('/dashboard', dashboardRoutes);

http.listen(process.env.PORT || 8080, process.env.IP, function(req, res){
    console.log("Server connected ..."); 
});