(function(){

var generateClientObject = function(user){

	if(user === undefined){
		return  {
				isLoggedIn	: user !== undefined
			};		
	}

	return  {
				displayName : user.displayName,
				avatar_url  : user._json.avatar_url,
				login		: user._json.login,
				isLoggedIn	: user !== undefined
			};
}


	module.exports = {
		//Generate javascript to be loaded by client application
		generate : function(req){
			return "var githubdata = " + JSON.stringify(generateClientObject(req.user));
		}
	}
})();