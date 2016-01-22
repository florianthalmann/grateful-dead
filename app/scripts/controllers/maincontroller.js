(function () {
	'use strict';

	angular.module('gratefulDead.controllers')
		.controller('MainController', ['$scope', '$http', function($scope, $http){
			
			$scope.songs = [{name:"Dark Star", versions:[{name:"studio"}, {name:"live1"}, {name:"live2"}]}, {name:"Sugar Magnolia", versions:[{name:"studio"}, {name:"live1"}, {name:"live2"}]}, {name:"Fire on the Mountain", versions:[{name:"studio"}, {name:"live1"}, {name:"live2"}]}];
			
			$scope.selectedSong;
			
			$scope.play = function() {
				
			}
			
		}]);

}());
