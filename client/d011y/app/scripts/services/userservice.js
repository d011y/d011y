'use strict';

d011yApp.factory('userservice', function($http, $log) {
  

  console.log('userservice initialized');

	var user;

  // Public API here
  return {
    isAuthenticated: function() {
      return user !== undefined;
    },

    initialize: function(){
      $http.get('api/user.json').success(function(data, status){
        if(status !== 404){
          user = data;
        }else{
          $log.log("You're not logged in");
        }
      });    
    }
  };
});