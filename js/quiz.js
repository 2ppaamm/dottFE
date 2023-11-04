(function(){
	var	app = angular.module('mathQuiz', ['katex','auth0', 'angular-storage', 'angular-jwt', 'ngRoute','ngLoadingSpinner']);
	app.controller('QuizController',
	 ['$scope', '$http', '$sce', 'auth', 'store', 'katexConfig','$window', function($scope, $http, $sce, auth, store, katexConfig,$window){
		//$scope.baseurl = "https://mathapi.pamelalim.me";
		$scope.baseurl = "http://localhost:8000";
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;
		$scope.percentage = 0;
		$scope.message ="Hello!";
		$scope.maxile = 0;
		$scope.kudos = 0;
		$scope.enrolled = true;
		$scope.mastercode = {};
		$scope.myAnswers ={'question_id':[], 'answer':[]};
		$scope.questsow='1';
		$scope.scratchpad = false;
		$scope.calculator = false;
		$scope.cindex = "";
		$scope.resultmsg = "";
		$scope.showskills = 0;
		$scope.trackbuttons = 0;
		$scope.showtest = 0;
		$scope.showcontinue = 0;
		$scope.showwelcome = 0;
		$scope.unauthenticated = 1;
		$scope.skills = 0;
		$scope.showback = 0;
		$scope.completedskills = 0;
		$scope.tracks = 0;
		$scope.welcome = 1;
	
		getLoginInfo = function(loginUrl, $loginInfo){
			console.log(loginUrl);
//			$scope.myAnswers ={'question_id':[], 'answer':[]};\
		    $http.post(loginUrl,$loginInfo).then(function(response){
		    	if (response.data.code == 206) {       // user does not have an account
		    		alert(response.data.code);
/*					$scope.questsow='0';
		    		$scope.resultmsg = response.data.message;
		    		$scope.percentage = response.data.percentage;
		    		$scope.score = response.data.score;
		    		$scope.maxile = response.data.maxile;
					$scope.kudos = response.data.kudos;
					$scope.message = response.data.message;
					alert($scope.message);
					$scope.totalQuestions = 0;
			        $scope.activeQuestion = 0;
			        $scope.myQuestions = []; */	
		    	} else if (response.data.code == 205){ // user has not done any tests
		    		alert (response.data.code);
		    	} else if (response.data.code == 203) {  //user is not enrolled
					$scope.enrolled = false;
					$scope.sendMastercode = function(){
						if($scope.mastercode.mastercode == undefined){
							alert("Please insert mastercode");
						}
						else
						{
							if($scope.mastercode.firstname == undefined){
								alert("Please insert First Name");
							}
							else{
								if($scope.mastercode.lastname == undefined){
									alert("Please insert Last Name");
								}
								else{
									if($scope.mastercode.date_of_birth == undefined){
										alert("Please insert Date Of Birth");
									}
									else{
										if (store.inMemoryCache.profile.email_verified) {
											getQuestions($scope.baseurl+'/test/mastercode',$scope.mastercode);	
										} else {
											alert("Please verify your email before accessing the account.");
											store.remove('profile');
											store.remove('token');
											auth.signout();
											window.location.reload();
										}
									}
								}
							}
						}
			    	}
		    	} else {
		    		if (response.data.tracks.length > 0) {
						$scope.showskills = 1;
						$scope.tracks = response.data.tracks;
						$scope.completedskills = response.data.completedskills;
						$scope.firstname = response.data.user.firstname;
						//console.log($scope.user.firstname);

		    		}
		    		console.log(response.data);
		    		$scope.showcontinue = 1;
		    		$scope.showtest = 1;
		    		$scope.showwelcome = 1;
					/*$scope.myQuestions =[];
			    	$scope.myAnswers['test'] = response.data.test;
			    	var questions = response.data.questions;*/
			    	/*if (questions === undefined) {
			    		alert("No questions found");
						$scope.questsow='0';
			    	}
					else
					{
						for(var i=0; i<questions.length; i++){
							$scope.myQuestions.push({
								"id": questions[i].id,
								"source": questions[i].source,
								"question":questions[i].question,
								"question_image":questions[i].question_image,
								"answers":[{"id":0, "text":questions[i].answer0, "image":questions[i].answer0_image},
										  {"id":1, "text":questions[i].answer1, "image":questions[i].answer1_image},
										  {"id":2, "text":questions[i].answer2, "image":questions[i].answer2_image},
										  {"id":3, "text":questions[i].answer3, "image":questions[i].answer3_image}],
								"correct" : questions[i].correct_answer,
								"type": questions[i].type_id,
								"calculator":questions[i].calculator
							});
						}
						if($scope.myQuestions[0].calculator == "s" || $scope.myQuestions[0].calculator == "S"){
							$scope.cindex = "s";
						}
						else{
							if($scope.myQuestions[0].calculator == null || $scope.myQuestions[0].calculator == undefined){
								$scope.cindex="x";
							}
							else{
								$scope.cindex="x";
							}
						}
					}						
					$scope.totalQuestions = $scope.myQuestions.length;
					$scope.activeQuestion = 0;*/
			    }
			},function(err){
				if (err.status == 500){
					alert(err.data.message);
				}
				else alert(err.data.message);
			});
		}

		// function to get questions
		getQuestions = function(questionUrl, $answers){
			console.log("getquestions");
			console.log(questionUrl);
			$scope.myAnswers ={'question_id':[], 'answer':[]};
		    $http.post(questionUrl,$answers ).then(function(response){
		    	if (response.data.code == 206) {
					$scope.questsow='0';
		    		$scope.resultmsg = response.data.message;
		    		$scope.percentage = response.data.percentage;
		    		$scope.score = response.data.score;
		    		$scope.maxile = response.data.maxile;
					$scope.kudos = response.data.kudos;
					$scope.message = response.data.message;
					alert($scope.message);
					$scope.totalQuestions = 0;
			        $scope.activeQuestion = 0;
			        $scope.myQuestions = [];	
		    	} else if (response.data.code == 203) {
					$scope.enrolled = false;
					$scope.sendMastercode = function(){
						if($scope.mastercode.mastercode == undefined){
							alert("Please insert mastercode");
						}
						else
						{
							if($scope.mastercode.firstname == undefined){
								alert("Please insert First Name");
							}
							else{
								if($scope.mastercode.lastname == undefined){
									alert("Please insert Last Name");
								}
								else{
									if($scope.mastercode.date_of_birth == undefined){
										alert("Please insert Date Of Birth");
									}
									else{
										if (store.inMemoryCache.profile.email_verified) {
											getQuestions($scope.baseurl+'/test/mastercode',$scope.mastercode);	
										} else {
											alert("Please verify your email before accessing the account.");
											store.remove('profile');
											store.remove('token');
											auth.signout();
											window.location.reload();
										}
									}
								}
							}
						}
			    	}
		    	} else {
		    		// 
		    		console.log(response.data);
		    		console.log(response.data.test);
					$scope.myQuestions =[];
			    	$scope.myAnswers['test'] = response.data.test;
			    	$scope.questions = response.data.questions;
			    	var questions = response.data.questions;
			    	if (questions === undefined) {
			    		alert("No questions found");
						$scope.questsow='0';
			    	}
					else
					{
						for(var i=0; i<questions.length; i++){
							$scope.myQuestions.push({
								"id": questions[i].id,
								"source": questions[i].source,
								"question":questions[i].question,
								"question_image":questions[i].question_image,
								"answers":[{"id":0, "text":questions[i].answer0, "image":questions[i].answer0_image},
										  {"id":1, "text":questions[i].answer1, "image":questions[i].answer1_image},
										  {"id":2, "text":questions[i].answer2, "image":questions[i].answer2_image},
										  {"id":3, "text":questions[i].answer3, "image":questions[i].answer3_image}],
								"correct" : questions[i].correct_answer,
								"type": questions[i].type_id,
								"calculator":questions[i].calculator
							});
						}
						if($scope.myQuestions[0].calculator == "s" || $scope.myQuestions[0].calculator == "S"){
							$scope.cindex = "s";
						}
						else{
							if($scope.myQuestions[0].calculator == null || $scope.myQuestions[0].calculator == undefined){
								$scope.cindex="x";
							}
							else{
								$scope.cindex="x";
							}
						}
					}						
					$scope.totalQuestions = $scope.myQuestions.length;
					$scope.activeQuestion = 0;
			    }
			},function(err){
				if (err.status == 500){
					alert(err.data.message);
				}
				else alert(err.data.message);
			});
		}

		// turn scratchpad on/off
		$scope.scratchpadSwitch = function(){
			$scope.scratchpad = $scope.scratchpad ? false : true;
		}	

		$scope.calculatorSwitch = function(){
			$scope.calculator = $scope.calculator ? false : true;
		}
		
		$scope.calculatorswitches = function(){
			if($scope.cindex == "s"){
				return true;
			}
			else{
				return false;
			}
			
		}
		
		// login and then get the questions from api

/*		$scope.login = function(type){
		    // Set popup to true to use popup
		    if (auth.isAuthenticated){
				getQuestions($scope.baseurl+'/test/protected','' + "/" + type);
				$scope.percentage=0;
				$scope.questsow = '1';
				$scope.score=0;
		    }
		    else {
		    	auth.signin({
					sso: false,
		    		popup: true,
		            title: "Login me in",
		            gravatar:false,
		            icon: "https://www.allgifted.com/wp-content/uploads/2020/06/ags@2x-trans.png",
		            authParams: {
		                scope: 'openid email name picture' 
		            }		    		
		    	}, function(profile, token){
			        store.set('profile', profile);
			        store.set('token', token);
					getQuestions($scope.baseurl+'/test/protected','' + "/" + type);
			    }, function(err){
			    	alert('unable to signin');
		    	})
		    };

		};
*/
		// hides main menu and display back button
		hidemenu = function(){
			$scope.showtest = 0;
			$scope.showcontinue = 0;
			$scope.showskills = 0;
			$scope.showback = 1;
			$scope.showwelcome = 0;
		}

		trackupdate = function(){
			console.log("hello");
			const trackCount = {};
			for (const skill of $scope.completedskills) {
				const trackId = skill.track_id;
				if (trackCount[trackId]) {
					trackCount[trackId]++;
				} else {
					trackCount[trackId] = 1;
				}
			}
			const trackPercentages = {};
			for (const track of $scope.tracks) {
				const trackId = track.id;
				const completedSkillsCount = trackCount[trackId] || 0;
				const totalSkillsCountInTrack = track.skills.length;
				const percentage = totalSkillsCountInTrack === 0 ? 0 : (completedSkillsCount / totalSkillsCountInTrack) * 100;
				trackPercentages[trackId] = Math.round(percentage); // Rounding to 2 decimal places
			}

			for (const trackId in trackPercentages) {
				const percentage = trackPercentages[trackId];
				const trackDiv = document.getElementById(trackId);
				if (trackDiv) {
					trackDiv.style.width = `${percentage}%`;
				}
				console.log(trackDiv);
			}

		}

		$scope.menu = function(type){
			// main menu
			$scope.welcome = 0;
			if (type == "continue") {
				console.log(type);
				getQuestions($scope.baseurl+'/test/protected' + "/" + type);
				hidemenu();
				$scope.showback = 0;
			} else if (type == "test") {
				console.log(type);
				getQuestions($scope.baseurl+'/test/protected' + "/" + type);
				hidemenu();
				$scope.showback = 0;
			} else if (type == "skills") {
				//post to update track and skill info
				trackupdate();
				console.log(type);
				$scope.trackbuttons = 1;
				hidemenu();
				//$scope.skills = 1;
			} else {
				// back button
				$scope.showtest = 1;
				$scope.showcontinue = 1;
				$scope.showwelcome = 1;
				$scope.showskills = 1;
				$scope.showback = 0;
				$scope.trackbuttons = 0;
			}
		}


		$scope.tracktest = function(type){
			// Field questions from 1 track only
			console.log(type);
		}

		$scope.login = function(type){
		    // Set popup to true to use popup
		    if (auth.isAuthenticated){
				getLoginInfo($scope.baseurl+'/loginInfo');
				//getQuestions($scope.baseurl+'/test/protected','' + "/" + type);
//				$scope.percentage=0;
//				$scope.questsow = '1';
//				$scope.score=0;
				// display buttons
				//document.getElementById("continue").style.visibility = "visible";
				//document.getElementById("test").style.visibility = "visible";
				//document.getElementById("skills").style.visibility = "visible";
		    }
		    else {
		    	auth.signin({
					sso: false,
		    		popup: true,
		            title: "Login me in",
		            gravatar:false,
		            icon: "https://www.allgifted.com/wp-content/uploads/2020/06/ags@2x-trans.png",
		            authParams: {
		                scope: 'openid email name picture' 
		            }		    		
		    	}, function(profile, token){
			        store.set('profile', profile);
			        store.set('token', token);
					getLoginInfo($scope.baseurl+'/loginInfo');
			    }, function(err){
			    	alert('unable to signin');
		    	})
		    };
		    $scope.unauthenticated = 0;

		};

		$scope.logout = function(){
			store.remove('profile');
			store.remove('token');
			auth.signout();
			$window.location.href="http://localhost";
			//$window.location.href="https://quiz.allgifted.com";
		};
		
		$scope.selectAnswer = function(qIndex, aIndex){	
			var questionState = $scope.myQuestions[qIndex].questionState;
			// check if answered
			if (questionState != 'answered'){
				$scope.myAnswers['question_id'].push($scope.myQuestions[qIndex].id);
				//$scope.myAnswers['answer'].push([]);
				if ($scope.myQuestions[qIndex].type == 1) {
					$scope.myQuestions[qIndex].selectedAnswer=aIndex;
					var correctAnswer = $scope.myQuestions[qIndex].correct;
					$scope.myQuestions[qIndex].correctAnswer = correctAnswer;
					$scope.myAnswers['answer'].push(aIndex);
					if (aIndex === correctAnswer){
						$scope.myQuestions[qIndex].correctness = 'correct';
						$scope.myQuestions[qIndex].crts = 'correct';
						$scope.score += 1;	
					} else {
						$scope.myQuestions[qIndex].correctness = 'incorrect';
						$scope.myQuestions[qIndex].crts = 'incorrect';
					}
				} else if ($scope.myQuestions[qIndex].type == 2) {
					$scope.myAnswers['answer'].push([]);
					$scope.myAnswers.answer[qIndex].push($scope.myQuestions[qIndex].answers[0].text != null ? $('#question_'+$scope.myQuestions[qIndex].id).children("input[type='number']:first").val() : null);
					$scope.myAnswers.answer[qIndex].push($scope.myQuestions[qIndex].answers[1].text != null ? $('#question_'+$scope.myQuestions[qIndex].id).children("input[type='number']:eq(1)").val() : null);
					$scope.myAnswers.answer[qIndex].push($scope.myQuestions[qIndex].answers[2].text != null ? $('#question_'+$scope.myQuestions[qIndex].id).children("input[type='number']:eq(2)").val() : null);
					$scope.myAnswers.answer[qIndex].push($scope.myQuestions[qIndex].answers[3].text != null ? $('#question_'+$scope.myQuestions[qIndex].id).children("input[type='number']:eq(3)").val() : null);
					if (Number($scope.myQuestions[qIndex].answers[0].text) != Number($scope.myAnswers.answer[qIndex][0]) ||
						Number($scope.myQuestions[qIndex].answers[1].text) != Number($scope.myAnswers.answer[qIndex][1]) ||
						Number($scope.myQuestions[qIndex].answers[2].text) != Number($scope.myAnswers.answer[qIndex][2]) ||
						Number($scope.myQuestions[qIndex].answers[3].text) != Number($scope.myAnswers.answer[qIndex][3])){
							
						$scope.myQuestions[qIndex].correctness = 'incorrect';
					} else {
						$scope.myQuestions[qIndex].correctness = 'correct';
						$scope.score += 1;							
					}
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
		$scope.selectContinue = function(qIndex){
			$scope.myQuestions[qIndex].crts="abc";
			if($scope.myQuestions[qIndex +1] != undefined){
				if($scope.myQuestions[qIndex + 1].calculator == undefined || $scope.myQuestions[qIndex + 1].calculator == null){
					$scope.cindex = "x";
				}
				else{
					if($scope.myQuestions[qIndex + 1].calculator == "S" || $scope.myQuestions[qIndex + 1].calculator == "s"){
						$scope.cindex="s";
					}
					else
					{
						$scope.cindex="x";
					}
				}
			}
			
			if ($scope.totalQuestions == $scope.activeQuestion+1){
				getQuestions($scope.baseurl+'/test/answers',$scope.myAnswers);
				// Update skills completed table
				// Write a different function instead of going to the same one to only retrieve completed skills
			    $http.post($scope.baseurl+'/loginInfo').then(function(response){
			    	if (response.data.code == 206) {       // user does not have an account
			    		alert(response.data.code);
			    	} else if (response.data.code == 205){ // user has not done any tests
			    		alert (response.data.code);
			    	} else if (response.data.code == 203) {  //user is not enrolled
						$scope.enrolled = false;
			    	} else {
			    		if (response.data.tracks.length > 0) {
							$scope.tracks = response.data.tracks;
							$scope.completedskills = response.data.completedskills;
							$scope.firstname = response.data.user.firstname;
					    	$scope.questions = response.data.questions;
							//console.log($scope.user.firstname);

			    		}
			    		console.log(response.data);
			    		trackupdate();
				    }
				},function(err){
					if (err.status == 500){
						alert(err.data.message);
					}
					else alert(err.data.message);
				});
				
			} else
			
			return $scope.activeQuestion += 1;
		}
		
		$scope.questionshowing = function(qIndex){
			return qIndex == $scope.activeQuestion ? true : false;
		}
		
		//$scope.resulting = $scope.quests == '0' ? true :false;
		$scope.resulting=function(){
			if($scope.questsow='0'){
				return true;
			}
			else{
				return false;
			}
		}
		
		$scope.continuetohide = function(qIndex){
			return $scope.myQuestions[qIndex].correctness == 'correct' || $scope.myQuestions[qIndex].correctness == 'incorrect' ? true : false;
		}
		
		$scope.createShareLinks = function(percentage){
			var url='http://www.allgifted.com';
			//var emailLink = '<a class="btn email" href = "mailto:ace.allgifted@gmail.com" ng-click="logout()">Email parent</a>';
			//var twitterLink = '<a class="btn twitter" href="#" ng-click="logout()">Tweet parent</a>';
			var domoreLink = '<a class="btn domore" href="#" ng-click="login()">Do some more!</a>';
			
			//var newMarkup = emailLink + twitterLink + domoreLink;
			var newMarkup = domoreLink;
			return $sce.trustAsHtml(newMarkup);
		}
	  katexConfig.defaultOptions.delimiters = 
	  [
	      {left: "$$", right: "$$", display: false},
	      {left: "\\[", right: "\\]", display: true},
	      {left: "\\(", right: "\\)", display: false}
	  ];    

	}]);

	app.config( function(authProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider) {
		authProvider.init({
    		domain: 'pamelalim.auth0.com',
			clientID: 'eVJv6UFM9GVdukBWiURczRCxmb6iaUYG'
//		    domain: 'allgiftedllc.au.auth0.com',
//		    clientID: 'bs3jSKz2Ewrye8dD2qRVrD0Tra2tOqHC'
		});

		jwtInterceptorProvider.tokenGetter = function(store) {
			return store.get('token');
		}
	    jwtOptionsProvider.config({
	      whiteListedDomains: [
	      'https://math.pamelalim.me', 'mathapi.pamelalim.me', 'localhost',
	      'https://math.allgifted.com','https://quiz.allgifted.com','localhost:8000']
	    });
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
			store.remove('profile');
			store.remove('token');
	        $location.path('/');
	        // .. or
	        // or use the refresh token to get a new idToken
	        //auth.refreshIdToken(token);
	      }
	    }

	  });
	}]);
	
	app.directive('compileTemplate', function($compile, $parse){
		return {
			link: function(scope, element, attr){
				var parsed = $parse(attr.ngBindHtml);
				function getStringValue() { return (parsed(scope) || '').toString(); }

				//Recompile if the template changes
				scope.$watch(getStringValue, function() {
					$compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
				});
			}         
		}
	});
	
})();
