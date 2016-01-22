(function () {
	'use strict';

	// create the angular app
	angular.module('gratefulDead', [
		'gratefulDead.controllers',
		'gratefulDead.directives'
	]);

	// setup dependency injection
	angular.module('d3', []);
	angular.module('gratefulDead.controllers', []);
	angular.module('gratefulDead.directives', ['d3']);

}());