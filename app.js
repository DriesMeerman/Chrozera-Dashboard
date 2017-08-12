angular.module('app', []);
angular.module('app')
    .directive('typeCard', [function(){
        return {
            restrict: 'E',
            scope: {
                name: '@?',
				icon: '@?',
				data: '=?'
            },
            templateUrl: 'templates/typeCardTemplate.html',
            controller: function($scope){
            	if ($scope.data){
            		var data = $scope.data;
                    $scope.visitCount = data.visitCount;
                    $scope.name = data.name;
                    $scope.icon = data.icon;
				}

				$scope.openDashBoard = function(){
            		if ($scope.data.path){
            			window.location = $scope.data.path;
					}
				}
			},
        }
    }])

	.factory('settingService', function(){
		if (typeof(localStorage) === "undefined") console.error("Localstorage unavailable");
		
		const PAGE_VISIT_KEY = "pageVisitCount_";
        const PASS_OPTIONS   = "passwordOptions";
        const MAX_NUMBER     = "maxNumber";
        const MIN_NUMBER	 = "minNumber";

		function incrementPageVisits(id){
			var current = localStorage.getItem(PAGE_VISIT_KEY+id);
			current = current ? current : 1;
			current = parseInt(current) + 1;

			localStorage.setItem(PAGE_VISIT_KEY+id, current);
		}

		return{
			pageVisit: {
				get: function(pageId){
					return localStorage.getItem(PAGE_VISIT_KEY+pageId) || 0;
				},
				add: function(pageId){
					incrementPageVisits(pageId);
				}
			},
			number: {
				setMaximum: function(max){
					localStorage.setItem(MAX_NUMBER, max);
				},
				getMaximum: function (){
					var max = localStorage.getItem(MAX_NUMBER);
				    return  max === null ? 100: parseInt(max);
				},
                setMinimum: function(min){
                    localStorage.setItem(MIN_NUMBER, min);
                },
                getMinimum: function (){
                    var min = localStorage.getItem(MIN_NUMBER)
                    return min === null ? 0 : parseInt(min);
                }
			},
            password:{
			    getOptions: function(){
			        var storedOptions = localStorage.getItem(PASS_OPTIONS);
			        if (storedOptions){
			            return JSON.parse(storedOptions);
                    }
                    return {
                        length: 16,
                        lowercase: true,
                        uppercase: true,
                        number: true,
                        special: true
                    }
                },
                setOptions: function(length, lowercase, uppercase, number, special){
                    var options = {
                        length: length,
                        lowercase: lowercase,
                        uppercase: uppercase,
                        number: number,
                        special:  special
                    };
                    localStorage.setItem(PASS_OPTIONS,JSON.stringify(options));
                }
            }
		}
	})

	.controller('controller', ['$scope', 'settingService', function($scope, settingService){

		$scope.dashboards = [
			dashboard("0", 'Random Number', 'number', 'ic-num'),
			dashboard("1", 'Date Calculations', 'dates', 'fa fa-calendar'),
			dashboard("2", 'Password Generator', 'password', 'fa fa-asterisk'),
			dashboard("3", 'Settings', 'settings', 'fa fa-cog'),
			dashboard("4", 'Coin Flip', 'coinflip', 'fa fa-question-circle-o')
		];

		function dashboard(id, name, path, icon){
            return {
                id: id,
				name: name,
                path: path,
                icon: icon,
                lastVisit: getLastVisit(id),
                visitCount: settingService.pageVisit.get(id)
            }
		}

		function getLastVisit(){
			return moment();
		}

		function getVisitCount(){
			return Math.floor(Math.random()*50)

		}

		$scope.getRowCount = function(){
			var count = Math.floor($scope.dashboards.length / 4);
			if (count == 0 && $scope.dashboards.length > 0)
				count = 1;
			else
				count++;
			return createRange(count);
		};

		$scope.getDashboard = function(index){
			if ($scope.dashboards[index]){
				return $scope.dashboards[index];
			}
		};

		function createRange(length){
			var list = [];
			for (var i = 0 ; i < length; i++){
				list.push(i);
			}
			return list;
		}
}])

.controller('settingsCtrl', ['$scope', 'settingService', function($scope, settingService){

	settingService.pageVisit.add("3");

	$scope.minNumber = settingService.number.getMinimum();
	$scope.maxNumber = settingService.number.getMaximum();

    $scope.passwordOptions = settingService.password.getOptions();

	$scope.$watch('minNumber', function(){
        if ($scope.minNumber > $scope.maxNumber) $scope.maxNumber = $scope.minNumber+1;
		settingService.number.setMinimum($scope.minNumber);
	});

    $scope.$watch('maxNumber', function(){
        if ($scope.minNumber > $scope.maxNumber) $scope.maxNumber = $scope.minNumber+1;
		settingService.number.setMaximum($scope.maxNumber);
    });

    $scope.$watch('passwordOptions', function(){
        savePasswordCHanges();
    }, true);

    function savePasswordCHanges(){
        var opt = $scope.passwordOptions;
        settingService.password.setOptions(opt.length, opt.lowercase, opt.uppercase, opt.number, opt.special);
    }


}])

.controller('numberCtrl',['$scope', 'settingService',function($scope, settingService){

    function init(){
        settingService.pageVisit.add(0);
        $scope.min = settingService.number.getMinimum();
        $scope.max = settingService.number.getMaximum();

        $scope.number = randomBetween($scope.min, $scope.max);
    }init();

    $scope.generateNumber = function(){
        $scope.number = randomBetween($scope.min, $scope.max);
    };

	function randomBetween(min, max){
	    max++;
	    var size = Math.abs(min) + max;
	    var number = Math.floor(Math.random() * size);
	    if (min < 0) number += min;
	    return number;
    }

}])

.controller('passwordCtrl',['$scope', 'settingService', function($scope, settingService){

	(function init() {
        settingService.pageVisit.add("2");
	    var options = settingService.password.getOptions();
        $scope.password = generatePassword(options.length, options.lowercase, options.uppercase, options.number, options.special);
    })();

    $scope.openSettings = function(){
        window.location = "../settings##number"
    };

	function generatePassword(length, lowerCase, upperCase, numbers, special){

        var ALHPABET = 'abcdefghijklmnopqrstuvwxyz';
        var NUMBERS  = '0123456789';
        var SPECIAL  = "!#$%&()*+,-./<=>?@[\\]_{|}";

        var possibleChars = [];

		if (lowerCase){
			var ar = ALHPABET.split('');
            possibleChars = possibleChars.concat(ar);
		}
		if (upperCase){
			var ar = ALHPABET.toUpperCase().split('');
            possibleChars = possibleChars.concat(ar);
		}
		if (numbers){
			var ar = NUMBERS.split('');
            possibleChars = possibleChars.concat(ar);
		}

		if (special){
			var ar = SPECIAL.split('');
            possibleChars = possibleChars.concat(ar);
		}

		possibleChars = shuffle(possibleChars);

		var result = "";
		for (var i = 0; i < length; i++){
			result += possibleChars[Math.floor(Math.random() * possibleChars.length)];
        }

        return result;
	}



    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}])

.controller('datesCtrl', ['$scope', 'settingService', function($scope, settingService){
    settingService.pageVisit.add("1");
}]);


