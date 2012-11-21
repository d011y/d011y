'use strict';

describe('Service: userservice for Unauthorized user', function () {

  console.log("suite running");
  // instantiate service
  var service, $httpBackend;

  // load the service's module
  beforeEach(module('d011yApp'));
  beforeEach(inject(function(userservice, _$httpBackend_) {
    service = userservice;
    $httpBackend = _$httpBackend_;

    $httpBackend.
      when('GET', 'api/user.json')
      .respond([200, {error: 401, message:'Unauthorized access'}]);

    service.initialize();
    $httpBackend.flush();
  }));

  /*Context text*/
  it('should call server to retrieve user data', function(){
    $httpBackend.expect('GET', 'api/user.json');
  });

  it('should be authenticated', function () {
    expect(service.isAuthenticated()).toBe(false);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
