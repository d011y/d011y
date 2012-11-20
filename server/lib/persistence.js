(function(){

	var mongoose = require('mongoose');
	mongoose.connect(process.env.MONGODB_URL);

	var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

	/**
	* MongoDBSchema
	*/
	var UserSchema = new Schema({
		id : ObjectId,
		username : String,
		displayName: String,
		currentLevel : Number,
		score : Number
	});

	var User = mongoose.model('User', UserSchema);

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
		console.log("[Persistence] save user " + user.id);
		
		user.save(callback);
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

	UserProvider.prototype.get = function(id, callback){
		mongoose.findOne({ 'id': id },'', function(err, user){
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