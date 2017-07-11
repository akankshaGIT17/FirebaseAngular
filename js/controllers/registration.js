myApp.controller('RegistrationController',
  [
  '$scope', '$rootScope', "$firebaseAuth", function($scope, $rootScope, $firebaseAuth){
   var ref = new Firebase('https://officedetails-38cef.firebaseio.com/');
    $rootScope.auth = $firebaseAuth(ref);
    
    $scope.login = function () {
      $scope.auth.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        }).then(function(user) {
        $rootScope.alert.message = '';
      }, function(error) {
        if (error = 'INVALID_EMAIL') {
          console.log('email invalid or not signed up — trying to sign you up!');
          $scope.register();
        } else if (error = 'INVALID_PASSWORD') {
          console.log('wrong password!');
        } else {
          console.log(error);
        }
      });
    }

    $scope.register = function() {
      $rootScope.auth.$createUser({ email: $scope.email, password: $scope.password,comapny: $scope.company,IsEmailVerified: false,IsActive: "1" })
                   .then(function() {
                       
                       console.log('User creation success');
          $scope.sendEmailVerification();
                   }, function(error) {
                      
                       $rootScope.alert.class = 'danger';
          $rootScope.alert.message = 'The username and password combination you entered is invalid.';
                   });
    }
    
    $scope.sendEmailVerification=function() {
      
      $rootScope.auth().$currentUser.sendEmailVerification().then(function() {
        
        console.log('Email Verification Sent!');
        
      });
      
    }
  }
]);