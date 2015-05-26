var app = angular.module("app", []);

/**
 * var app = angular.module('nom du module', []);
 * app.controller('customersCtrl', function($scope, $http) {
 * 		$http.get("url du ws")
 * 		.success(function(response) {$scope.names = response.records;});
 * });
 * 
 */

app.controller("ng-header", function($scope){
	
});

app.controller("ng-footer", function($scope){
	
});

app.controller("ng-menu", function($scope){
	urlContent = 'cocktails.json';
	urlHTML = "resultatcocktails.html";
	place = "#content";
	replaceContentWithExternalData(urlContent, urlHTML, place)
});

app.controller("ng-content", function($scope){
	 
});

$("#login").on("click", function(){
	console.log("login");
	urlHTML = "login.html";
	place = "#content";
	replaceContentWithData(urlHTML, place);
});

/**
 * Replace the content of a Div by the value of a HTML
 * file filed with external content
 */
function replaceContentWithExternalData(urlContent, urlHTML, place){
	$http.get(urlContent).
    success(function(data) {
    	$(place).load(urlHTML);
        $scope.content = data;
    });
};

/**
 * Replace the content of a Div by the value of a HTML
 * file 
 */
function replaceContentWithData(urlHTML, where){
	$(where).load(urlHTML);
};
