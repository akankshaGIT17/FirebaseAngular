myApp.factory('Authentication', 
  ['$rootScope', '$firebaseAuth', '$firebaseObject',
  '$location', 'FIREBASE_URL',
  function($rootScope, $firebaseAuth, $firebaseObject,
    $location, FIREBASE_URL) {

  var ref = new Firebase("https://officedetails-38cef.firebaseio.com/");
  var auth = $firebaseAuth(ref);

  auth.$onAuth(function(authUser) {
      debugger
    if (authUser) {
      var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid );
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });


  return {
    login: function(user) {
      auth.$authWithPassword({
        email: user.email,
        password: user.password,
          location: user.location,
          IsEmailVerified: true,
          IsActive: "1"
      }).then(function(regUser) {
        $location.path('/success');
      }).catch(function(error) {
       $rootScope.message = error.message;
      });
    }, 

    logout: function() {
      return auth.$unauth();
    }, 

    requireAuth: function() {
      return auth.$requireAuth();
    }, 

    register: function(user) {
      auth.$createUser({
        email: user.email,
        password: user.password
      }).then(function(regUser) {

        var regRef = new Firebase(FIREBASE_URL + 'users')
        .child(regUser.uid).set({
          date: Firebase.ServerValue.TIMESTAMP,
          regUser: regUser.uid,
          firstname: user.firstname,
          lastname: user.lastname,
          email:  user.email,
          location : user.location,
            IsActive: "1",
            IsEmailVerified: false
        }); 

        $rootScope.message = "Hi " + user.firstname +
        ", Your organisation details are";
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); 
    } 
  };

}]); 
