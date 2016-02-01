(function () {
	'use strict';

	angular.module('gratefulDead.controllers')
		.controller('MainController', ['$scope', '$http', function($scope, $http) {
			
			$scope.SHOW_VIEW = "Show View";
			$scope.SONG_VIEW = "Song View";
			
			$scope.songs = [{name:"Dark Star", versions:[{name:"Grateful Dead Live at The Spectrum on 1981-05-02"}, {name:"Grateful Dead Live at Adams Field House, U of Montana on 1974-05-14"}]}, {name:"Sugar Magnolia", versions:[{name:"Grateful Dead Live at The Spectrum on 1981-05-02"}, {name:"Grateful Dead Live at Adams Field House, U of Montana on 1974-05-14"}]}, {name:"Fire on the Mountain", versions:[{name:"Grateful Dead Live at The Spectrum on 1981-05-02"}, {name:"Grateful Dead Live at Adams Field House, U of Montana on 1974-05-14"}]}];
			
			$scope.gotoSongView = function(songName) {
				$scope.selectedSong = $scope.songs.filter(function(s) { return s.name == songName; })[0];
				$scope.currentView = $scope.SONG_VIEW;
			}
			
			$scope.gotoShowView = function(showId) {
				$scope.selectedShowID = showId;
				$http.jsonp('https://archive.org/advancedsearch.php?q=collection:GratefulDead+AND+identifier:' + $scope.selectedShowID + '&fl%5B%5D=title,date,coverage,venue&output=json&callback=JSON_CALLBACK').success(function(data) {
					$scope.selectedShow = data.response.docs[0];
					var shortDate = getShortDateString($scope.selectedShow.date);
					$scope.selectedShow.ticket = 'http://www.psilo.com/dead/images/tickets/t' + shortDate + '.jpg';
					$scope.selectedShow.pass = 'http://www.psilo.com/dead/images/passes/b' + shortDate + '.jpg';
					$scope.currentView = $scope.SHOW_VIEW;
				});
			}
			
			function getShortDateString(date) {
				date = new Date(date);
				return '' + date.getYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getUTCDate()).slice(-2);
			}
			
			//INIT
			$scope.gotoShowView("gd81-05-02.dmow.28304.sbeok.flacf");
			
		}]);

}());
