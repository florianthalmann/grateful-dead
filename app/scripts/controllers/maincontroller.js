(function () {
	'use strict';

	angular.module('gratefulDead.controllers')
		.config(function($httpProvider){
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		})
		.controller('MainController', ['$scope', '$http', function($scope, $http) {
			
			$scope.SHOW_VIEW = "Show View";
			$scope.SONG_VIEW = "Song View";
			
			$scope.gotoSongView = function(songName) {
				$scope.selectedSong = { name:songName };
				$http.jsonp('https://archive.org/advancedsearch.php?q="' + songName + '"+AND+collection:GratefulDead&fl%5B%5D=identifier,title&rows=100000&output=json&callback=JSON_CALLBACK').success(function(data) {
					$scope.selectedSong.versions = data.response.docs.filter(function(d){return $scope.sampleShowIds.indexOf(d.identifier) >= 0;});
				});
				$scope.currentView = $scope.SONG_VIEW;
			}
			
			$scope.gotoLocationView = function(locationName) {
				$scope.selectedLocation = { name:locationName };
				$http.jsonp('https://archive.org/advancedsearch.php?q=coverage:"' + locationName + '"+AND+collection:GratefulDead&fl%5B%5D=identifier,title&rows=100000&output=json&callback=JSON_CALLBACK').success(function(data) {
					$scope.selectedLocation.shows = data.response.docs.filter(function(d){return $scope.sampleShowIds.indexOf(d.identifier) >= 0;});
				});
				$scope.currentView = $scope.LOCATION_VIEW;
			}
			
			$scope.gotoShowView = function(showId) {
				$scope.selectedShowID = showId;
				$http.jsonp('https://archive.org/advancedsearch.php?q=collection:GratefulDead+AND+identifier:' + $scope.selectedShowID + '&fl%5B%5D=title,date,coverage,venue&output=json&callback=JSON_CALLBACK').success(function(data) {
					$scope.selectedShow = data.response.docs[0];
					var shortDate = getShortYearDateString($scope.selectedShow.date);
					$scope.selectedShow.ticket = 'http://www.psilo.com/dead/images/tickets/t' + shortDate + '.jpg';
					$scope.selectedShow.pass = 'http://www.psilo.com/dead/images/passes/b' + shortDate + '.jpg';
					//$scope.selectedShow.posters = getPosterUris($scope.selectedShow.date);
					$http.jsonp('https://archive.org/metadata/' + $scope.selectedShowID + '&callback=JSON_CALLBACK').success(function(data) {
						$scope.selectedShow.setlist = extractSetlist(data);
						$scope.currentView = $scope.SHOW_VIEW;
					});
				});
			}
			
			function getShortYearDateString(date) {
				date = new Date(date);
				return '' + date.getYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getUTCDate()).slice(-2);
			}
			
			function getFullYearDateString(date) {
				date = new Date(date);
				return 
			}
			
			function getPosterUris(date) {
				date = new Date(date);
				var longDate = '' + date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getUTCDate()).slice(-2);
				var decade = (''+date.getFullYear()).substring(0,3) + '0s';
				$http.jsonp('http://www.deadlists.com/posters/' + decade + '/' + decade + '.html').success(function(data) {
					console.log(data)
				});
			}
			
			function extractSetlist(metadata) {
				var setlist = [];
				for (var i = 0, l = metadata.files.length; i < l; i++) {
					var currentFile = metadata.files[i];
					if (currentFile.track && currentFile.source) {
						var currentSong = { title:currentFile.title };
						currentSong.inSampleSongs = false;
						for (var j = 0, m = $scope.sampleSongs.length; j < m; j++) {
							if (currentSong.title.indexOf($scope.sampleSongs[j]) >= 0) {
								currentSong.inSampleSongs = true;
								currentSong.plainTitle = $scope.sampleSongs[j];
							}
						}
						setlist[Number.parseInt(currentFile.track)] = currentSong;
					}
				}
				return setlist;
			}
			
			//INIT
			$http.get('files/temp_songs.txt').success(function(data) {
				$scope.sampleSongs = data.split('\n');
				$http.get('files/temp_ids.txt').success(function(data) {
					$scope.sampleShowIds = data.split('\n');
					$scope.gotoShowView($scope.sampleShowIds[0]);
				});
			});
			
		}]);

}());
