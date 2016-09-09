(function(){
	var	app = angular.module('mathQuiz', ['katex','auth0', 'angular-storage', 'angular-jwt', 'ngRoute']);
	app.controller('QuizController',
	 ['$scope', '$http', '$sce', 'auth', 'store', 'katexConfig', function($scope, $http, $sce, auth, store, katexConfig){
	 	$scope.baseurl = "http://quizapi.pamelalim.me"
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;
		$scope.percentage = 0;
		$scope.maxile = 0;
		$scope.myAnswers ={'question_id':[], 'answer':[]};
		// function to get questions
		getQuestions = function(questionUrl, $answers){
			$scope.myAnswers ={'question_id':[], 'answer':[]};
		    $http.post(questionUrl,$answers ).then(function(response){
		    	if (response.data.code == 206) {
		    		$scope.percentage = response.data.percentage;
		    		$scope.score = response.data.score;
		    		$scope.maxile = response.data.maxile;
					$scope.totalQuestions = 0;
			        $scope.activeQuestion = 0;
			        $scope.myQuestions = [];
		    	} else if (response.data.code == 203) {
		    		getQuestions(questionUrl,$answers);
		    	} else {
					$scope.myQuestions =[];
			    	$scope.myAnswers['test'] = response.data.test;
			    	var questions = response.data.questions;
			    	if (questions === undefined) {
			    		alert("no questions found");
			    	}
				    for(var i=0; i<questions.length; i++){
				    	$scope.myQuestions.push({
				    		"id": questions[i].id,
				    		"question":questions[i].question,
				    		"question_image":questions[i].question_image,
				    		"answers":[{"id":0, "text":questions[i].answer0, "image":questions[i].answer0_image},
									  {"id":1, "text":questions[i].answer1, "image":questions[i].answer1_image},
									  {"id":2, "text":questions[i].answer2, "image":questions[i].answer2_image},
									  {"id":3, "text":questions[i].answer3, "image":questions[i].answer3_image}],
							"correct" : questions[i].correct_answer,
							"type": questions[i].type_id			    					
				    	});
				    }

					$scope.totalQuestions = $scope.myQuestions.length;
			        $scope.activeQuestion = 0;
			    }
			});
		}

		// login and then get the questions from api
		$scope.login = function(){
		    // Set popup to true to use popup
		    if (auth.isAuthenticated){
				getQuestions($scope.baseurl+'/qa','');
		    }
		    else {
		    	auth.signin({
		    		popup: true,
		            title: "Login me in",
		            gravatar:false,
		            icon: "http://school.all-gifted.com/pluginfile.php/1/theme_lambda/logo/1472088488/newlogo.png",
		            authParams: {
		                scope: 'openid email name picture' 
		            }		    		
		    	}, function(profile, token){
			        store.set('profile', profile);
			        store.set('token', token);
			        getQuestions($scope.baseurl+'/qa','');
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
			// check if answered
			if (questionState != 'answered'){
				$scope.myAnswers['question_id'].push($scope.myQuestions[qIndex].id);
				if ($scope.myQuestions[qIndex].type == 1) {
					$scope.myQuestions[qIndex].selectedAnswer=aIndex;
					var correctAnswer = $scope.myQuestions[qIndex].correct;
					$scope.myQuestions[qIndex].correctAnswer = correctAnswer;
					$scope.myAnswers['answer'].push(aIndex);
					if (aIndex === correctAnswer){
						$scope.myQuestions[qIndex].correctness = 'correct';
						$scope.score += 1;	
					} else {
						$scope.myQuestions[qIndex].correctness = 'incorrect';
					}
				} else if ($scope.myQuestions[qIndex].type == 2) {
					if ($scope.myQuestions[qIndex].answers[0].text != $scope.myAnswers.answer[qIndex][0] ||
						$scope.myQuestions[qIndex].answers[1].text != $scope.myAnswers.answer[qIndex][1] ||
						$scope.myQuestions[qIndex].answers[2].text != $scope.myAnswers.answer[qIndex][2] ||
						$scope.myQuestions[qIndex].answers[3].text != $scope.myAnswers.answer[qIndex][3]) {
						$scope.myQuestions[qIndex].correctness = 'incorrect';
					} else {
						$scope.myQuestions[qIndex].correctness = 'correct';
						$scope.score += 1;							
					}
				}
				$scope.myQuestions[qIndex].questionState = 'answered';
			}
//			$scope.percentage = ($scope.score / $scope.totalQuestions)*100;
		}
		$scope.isSelected = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
		}
		$scope.isCorrect = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].correctAnswer === aIndex;
		}
		$scope.selectContinue = function(){
			if ($scope.totalQuestions == $scope.activeQuestion+1){
				getQuestions($scope.baseurl+'/qa/answer',$scope.myAnswers);
			} else
			return $scope.activeQuestion += 1;
		}
		$scope.createShareLinks = function(percentage){
			var url='http://www.all-gifted.com';
			var emailLink = '<a class="btn email" href = "mailto:ace.allgifted@gmail.com" ng-click="logout()">Email parent</a>';
			var twitterLink = '<a class="btn twitter" href="#" ng-click="logout()">Tweet parent</a>';
			var newMarkup = emailLink + twitterLink;
			return $sce.trustAsHtml(newMarkup);
		}
	  katexConfig.defaultOptions.delimiters = 
	  [
	      {left: "$$", right: "$$", display: false},
	      {left: "\\[", right: "\\]", display: true},
	      {left: "\\(", right: "\\)", display: false}
	  ];    

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