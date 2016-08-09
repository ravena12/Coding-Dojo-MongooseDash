var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require('mongoose');
var path = require('path');
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/mongoDashdb');
var UserSchema = new mongoose.Schema({
 type: String,
 name: String,
})
mongoose.model('User', UserSchema); 
var User = mongoose.model('User') 
/* ************************************
	Render Pages  
   ************************************ */
app.get('/', function(req, res) {
	User.find({}, function(err, users) {
		console.log(users);
    res.render('index', { users : users });
	})
})

app.get('/animals/new', function(req, res) {
    res.render('create');
})

app.get('/animals/:id', function (req, res) {
	User.find({_id: req.params.id}, function(err, user) {
	console.log("The user id requested is:", req.params.id);
 	res.render('show', { user : user });
})

 })
app.get('/animals/:id/edit', function (req, res) {
	User.find({_id: req.params.id}, function(err, user) {
 	res.render('edit', { user : user });
	})
})
	

/* ************************************
	Processes  
   ************************************ */
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    var user = new User({type: req.body.type, name: req.body.name });
    user.save(function(err) {
    	if(err) {
    		console.log('something went wrong');
    	} else { 
    		console.log('successfully added a user!');
    		res.redirect('/');
    	}
    })
})
app.post('/update/:id', function(req, res) {
	User.findOne({_id: req.params.id}, function(err, user){
	user.type = req.body.type;
	user.name = req.body.name;
	user.save(function(err){
	 	console.log('changes saved');
	 	res.redirect('/');
 		})
	})

})
app.get('/animals/:id/destroy', function(req, res) {
	User.remove({_id: req.params.id}, function(err){
		res.redirect('/');
	})
})
    


app.listen(8000, function() {
    console.log("listening on port 8000");
})