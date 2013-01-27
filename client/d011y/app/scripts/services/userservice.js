'use strict';

d011yApp.factory('userservice', function($http, $log) {
  
	var user;

  // Public API here
  return {
    isAuthenticated: function() {
      return user !== undefined;
    },

    initialize: function(){
      $http.get('api/user.json').success(function(data, status){
        user = data;
      }).error(function(data, status){
        $log.log("not authenticated");
      });    
    },

    login: function(){
      window.location ="/auth/github";
    }
  };
});