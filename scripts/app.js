'use strict';

var app = angular.module('zoomsphere', ['ngRoute','publicationControllers']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/static', {
			templateUrl: 'html/home.html'
		}).
		when('/static/login', {
			templateUrl: 'html/index.html',
			controller: 'controllerLogin'
		}).
		when('/search', {
			templateUrl: 'html/index.html',
			controller: 'controllerSearch'
		}).
		when('/static/cocktails', {
			templateUrl: 'html/index.html',
			controller: 'controllerCocktails'
		}).
		when('/static/ingredients', {
			templateUrl: 'html/index.html',
			controller: 'controllerIngredients'
		}).
		when('/static/categories', {
			templateUrl: 'html/index.html',
			controller: 'controllerCategories'
		}).
		when('/static/mesingredients', {
			templateUrl: 'html/index.html',
			controller: 'controllerMesIngredients'
		}).
		when('/static/mescocktails', {
			templateUrl: 'html/index.html',
			controller: 'controllerMesCocktails'
		}).
		when('/static/mesfavoris', {
			templateUrl: 'html/index.html',
			controller: 'controllerMesFavoris'
		}).
		when('/static/mesavis', {
			templateUrl: 'html/index.html',
			controller: 'controllerMesAvis'
		}).
		otherwise({
			redirectTo: '/static'
		});
}]);