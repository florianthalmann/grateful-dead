(function () {
	'use strict';

	angular.module('gratefulDead.controllers')
		.controller('MainController', ['$scope', '$http', function($scope, $http){
			
			$scope.songs = [{name:"Dark Star", versions:[{name:"studio", image:"http://www.psilo.com/dead/images/tickets/tweir991120.jpg"}, {name:"live1", image:"http://www.psilo.com/dead/images/tickets/t810313.jpg"}, {name:"live2", image:"http://www.psilo.com/dead/images/tickets/t820313.jpg"}]}, {name:"Sugar Magnolia", versions:[{name:"studio", image:"http://www.psilo.com/dead/images/tickets/t820313.jpg"}, {name:"live1", image:"http://www.psilo.com/dead/images/tickets/t810313.jpg"}, {name:"live2", image:"http://www.psilo.com/dead/images/tickets/tweir991120.jpg"}]}, {name:"Fire on the Mountain", versions:[{name:"studio", image:"http://www.psilo.com/dead/images/tickets/tweir991120.jpg"}, {name:"live1", image:"http://www.psilo.com/dead/images/tickets/t820313.jpg"}, {name:"live2", image:"http://www.psilo.com/dead/images/tickets/t810313.jpg"}]}];
			
			$scope.selectedSong;
			
			$scope.play = function() {
				
			}
			
		}]);

}());
