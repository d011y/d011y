'use strict';

d011yApp.controller('MainCtrl', function($scope, $log, userservice) {
userservice.initialize();
  $log.log("Is user authenticated? => " + userservice.isAuthenticated());
});
