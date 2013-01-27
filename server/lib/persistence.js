(function(){

	var mongoose = require('mongoose');
	mongoose.connect(process.env.MONGODB_URL);

	console.log("MONGODB_URL => " + process.env.MONGODB_URL);

	var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

	/**
	* MongoDBSchema
	*/
	var UserSchema = new Schema({
		ghId : {type: String, index: {unique: true, dropDups: true}},
		ghUsername : String,
		ghDisplayName: String,
		currentLevel : Number,
		score : Number
	});

	var User = mongoose.model('User', UserSchema);


	/**
	* d011y Persistence API
	* This allows to switch between memory and mongodb modules
	*/
	var UserProvider = function(){
		console.log("User provider initialized");
	};

	UserProvider.prototype.create = function(callback){
		console.log("[Persistence] create a new User");
		var newUser = new User();
		newUser.currentLevel = 0;
        newUser.score = 0;
		callback(newUser);
	};

	UserProvider.prototype.save = function(user, callback){
		user.save(callback);
		console.log("[Persistence] saved user " + user._id);
	};

	UserProvider.prototype.getAll = function(callback){
		var query = User.find();
		query.exec(function(err, users){
			if(err){
				console.log(err);
			}else{
				console.log("users loaded from database");
				callback(users);
			}
		});
		
	};

	UserProvider.prototype.get = function(ghId, callback){
		mongoose.findOne({ 'ghId': ghId },'', function(err, user){
			if(err){
				console.log(err);
			}else{
				console.log("user loaded from database");
				callback(user);
			}
		});
	};

	module.exports = {
		user_provider : new UserProvider()
	};

})();