(function(){
	var	app = angular.module('mathQuiz', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute']);
	app.controller('QuizController', ['$scope', '$http', '$sce', 'auth', 'store', function($scope, $http, $sce, auth, store){
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;
		$scope.percentage = 0;

		$scope.login = function(){
			$scope.activeQuestion = 0;
		    // Set popup to true to use popup
		    auth.signin({popup: true}, function(profile, token){
		      store.set('profile', profile);
		      store.set('token', token);
		    }, function(err){
		      console.log('unable to signin through Auth0');
		    });
		}

		$http.get('quiz_data.json').then(function(quizData){
			$scope.myQuestions = quizData.data;
			$scope.totalQuestions = $scope.myQuestions.length;
		});

		$scope.selectAnswer = function(qIndex, aIndex){
			var questionState = $scope.myQuestions[qIndex].questionState;
			
			if (questionState != 'answered'){
				$scope.myQuestions[qIndex].selectedAnswer=aIndex;
				var correctAnswer = $scope.myQuestions[qIndex].correct;

				$scope.myQuestions[qIndex].correctAnswer = correctAnswer;

				if (aIndex === correctAnswer){
					$scope.myQuestions[qIndex].correctness = 'correct';
					$scope.score += 1;	
				} else {
					$scope.myQuestions[qIndex].correctness = 'incorrect';
				}
				$scope.myQuestions[qIndex].questionState = 'answered';
			}
			$scope.percentage = ($scope.score / $scope.totalQuestions)*100;
		}
		$scope.isSelected = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
		}
		$scope.isCorrect = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].correctAnswer === aIndex;
		}
		$scope.selectContinue = function(){
			return $scope.activeQuestion += 1;
		}
		$scope.createShareLinks = function(percentage){
			var url='http://www.all-gifted.com';
			var emailLink = '<a class="btn email" href = "#">Email parent</a>';
			var twitterLink = '<a class="btn twitter" target="_blank" href="#">Tweet parent</a>';
			var newMarkup = emailLink + twitterLink;
			return $sce.trustAsHtml(newMarkup);
		}

	}]);

	app.config( function myAppConfig (authProvider) {
		authProvider.init({
		    domain: 'pamelalim.auth0.com',
		    clientID: 'eVJv6UFM9GVdukBWiURczRCxmb6iaUYG'
		});
		authProvider.on('loginSuccess', ['$location', 'profilePromise', 'idToken', 'store', function($location, profilePromise, idToken, store) {
		  // Successfully log in
		  // Access to user profile and token
		  profilePromise.then(function(profile){
		    // profile
		    store.set('profile', profile);
		    store.set('token', token);
		  });
		  $location.url('/');
		}]);
		//Called when login fails
		authProvider.on('loginFailure', function() {
		  console.log('login failed');
		});
	});

	app.run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', function($rootScope, auth, store, jwtHelper, $location) {
	  // Listen to a location change event
	  $rootScope.$on('$locationChangeStart', function() {
	    // Grab the user's token
	    var token = store.get('token');
	    // Check if token was actually stored
	    if (token) {
	      // Check if token is yet to expire
	      if (!jwtHelper.isTokenExpired(token)) {
	        // Check if the user is not authenticated
	        if (!auth.isAuthenticated) {
	          // Re-authenticate with the user's profile
	          // Calls authProvider.on('authenticated')
	          auth.authenticate(store.get('profile'), token);
	        }
	      } else {
	        // Either show the login page
	        // $location.path('/');
	        // .. or
	        // or use the refresh token to get a new idToken
	        auth.refreshIdToken(token);
	      }
	    }

	  });
	}]);
	
})();