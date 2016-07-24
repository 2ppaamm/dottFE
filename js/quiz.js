(function(){
	var	app = angular.module('mathQuiz', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute']);
	app.controller('QuizController',
	 ['$scope', '$http', '$sce', 'auth', 'store', function($scope, $http, $sce, auth, store){
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;
		$scope.percentage = 0;

		getQuestions = function(){

		    $http.get('http://localhost:8000/test/protected').then(function(response){
		    	$scope.myQuestions =[];
		    	var questions = response.data.questions;
			    for(var i=0; i<questions.length; i++){
			    	$scope.myQuestions.push({
			    		"question":questions[i].question,
			    		"question_image":questions[i].question_image,
			    		"answers":[{"id":0, "text":questions[i].answer0, "image":questions[i].answer0_image},
								  {"id":1, "text":questions[i].answer1, "image":questions[i].answer1_image},
								  {"id":2, "text":questions[i].answer2, "image":questions[i].answer2_image},
								  {"id":3, "text":questions[i].answer3, "image":questions[i].answer3_image}],
						"correct" : questions[i].correct_answer			    					
			    	});
			    }
				$scope.totalQuestions = $scope.myQuestions.length;
			});
	        $scope.activeQuestion = 0;
		}

		$scope.login = function(){
		    // Set popup to true to use popup
		    if (auth.isAuthenticated){
				getQuestions();
		    }
		    else {
		    	auth.signin({
		    		popup: true,
		            title: "Login me in",
		            gravatar:false,
		            icon: "http://www.all-gifted.com/images/allgifted-smalllogo.jpg",
		            authParams: {
		                scope: 'openid email name picture' 
		            }		    		
		    	}, function(profile, token){
			        store.set('profile', profile);
			        store.set('token', token);
			        getQuestions();
			    }, function(err){
			    	alert('unable to signin');
		    	})
		    };

		};

		$scope.logout = function(){
			store.remove('profile');
			store.remove('token');
			auth.signout();
		};

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
			var emailLink = '<a class="btn email" href = "mailto:ace.allgifted@gmail.com" ng-click="logout()">Email parent</a>';
			var twitterLink = '<a class="btn twitter" href="#" ng-click="logout()">Tweet parent</a>';
			var newMarkup = emailLink + twitterLink;
			return $sce.trustAsHtml(newMarkup);
		}

	}]);

	app.config( function(authProvider, $httpProvider, jwtInterceptorProvider) {
		authProvider.init({
		    domain: 'pamelalim.auth0.com',
		    clientID: 'eVJv6UFM9GVdukBWiURczRCxmb6iaUYG'
		});

		jwtInterceptorProvider.tokenGetter = function(store) {
			return store.get('token');
		}

		$httpProvider.interceptors.push('jwtInterceptor');
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