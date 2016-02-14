(function () {
	'use strict';

	angular.module('gratefulDead.controllers', ['uiGmapgoogle-maps'])
		.config(['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
			GoogleMapApiProviders.configure({
				china: true
			});
		}])
		.controller('MainController', ['$scope', '$http', function($scope, $http) {
			
			$scope.SHOW_VIEW = "Show View";
			$scope.SONG_VIEW = "Song View";
			$scope.LOCATION_VIEW = "Location View";
			$scope.VENUE_VIEW = "Venue View";
			
			$scope.visualizations = [{name:"arcs"}, {name:"blocks"}, {name:"bubbles"}];
			
			$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 11 };
			var API_KEY = 'AIzaSyCRiXnxFJsxK_eR7UMOa6TEDG-LtNOurkE';
			var SEARCH_ID = '009672749826573306698:an43qbdr-xi';
			
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			var audioContext = new AudioContext();
			$scope.scheduler = new Scheduler(audioContext);
			$scope.viewConfig = {
				xAxis:{name:"x-axis", param:{name:"time", min:0, max:800}, log:false},
				yAxis:{name:"y-axis", param:{name:"duration", min:0, max:10}, log:false},
				size:{name:"size", param:{name:"Loudness", min:0, max:10}, log:false},
				color:{name:"color", param:{name:"Spectral Standard Deviation", min:0, max:5000}, log:false}
			};
			
			$scope.gotoSongView = function(songName) {
				$scope.selectedSong = { name:songName };
				$http.jsonp('https://archive.org/advancedsearch.php?q="' + songName + '"+AND+collection:GratefulDead&fl%5B%5D=identifier,title&rows=100000&output=json&callback=JSON_CALLBACK').success(function(data) {
					$scope.selectedSong.versions = data.response.docs.filter(function(d){return $scope.sampleShowIds.indexOf(d.identifier) >= 0;}).slice(0,10);
					recursiveLoadDymos($scope.selectedSong.versions, 0);
				});
				/*$scope.selectedSong.versions = [{identifier: "gd1990-12-31.116141.NeumannKMF4.daweez.d5scott.flac16", title: "Grateful Dead Live at Oakland-Alameda County Coliseum on 1990-12-31"}, {identifier: "gd1973-07-27.aud.pantagruel.28882.sbeok.flac16", title: "Grateful Dead Live at Grand Prix Racecourse on 1973-07-27"}, {identifier: "gd1980-11-30.nak700-set1.wagner.chappell.110921.flac16", title: "Grateful Dead Live at Fox Theater on 1980-11-30"}, {identifier: "gd1989-05-27.pzm.russjcan.93686.sbeok.flac16", title: "Grateful Dead Live at Oakland-Alameda County Coliseum Stadium on 1989-05-27"}, {identifier: "gd1985-08-30.123819.nak300.flac16", title: "Grateful Dead Live at Southern Star Amphitheater on 1985-08-30"}, {identifier: "gd1987-06-20.124397.beacon.akg460.flac24", title: "Grateful Dead Live at Greek Theatre, U. Of California on 1987-06-20"}, {identifier: "gd1983-12-28.112242.Sennheiser421.daweez.d5scott.flac16", title: "Grateful Dead Live at San Francisco Civic Auditorium on 1983-12-28"}, {identifier: "gd1989-04-16.AKG451.Darby.118402.Flac2448", title: "Grateful Dead Live at The Mecca on 1989-04-16"}, {identifier: "gd1991-08-12.akg451.darby.119080.flac24", title: "Grateful Dead Live at Cal Expo Amphitheatre on 1991-08-12"}, {identifier: "gd1982-05-21.nak700.wagner.miller.109334.flac16", title: "Grateful Dead Live at Greek Theatre, U. Of California on 1982-05-21"}];
				recursiveLoadDymos($scope.selectedSong.versions, 0);*/
				$scope.currentView = $scope.SONG_VIEW;
			}
			
			$scope.gotoLocationView = function(locationName) {
				$scope.selectedLocation = { name:locationName };
				updateMap(locationName, 11);
				getShows('coverage', locationName, function(shows) {
					$scope.selectedLocation.shows = shows;
				});
				getImages(locationName, function(imageUris) {
					$scope.selectedLocation.images = imageUris;
				});
				$scope.currentView = $scope.LOCATION_VIEW;
			}
			
			$scope.gotoVenueView = function(venueName, locationName) {
				$scope.selectedVenue = { name:venueName };
				updateMap(venueName + ', '  + locationName, 15);
				getShows('venue', venueName, function(shows) {
					$scope.selectedVenue.shows = shows;
				});
				getImages(venueName + ', '  + locationName, function(imageUris) {
					$scope.selectedVenue.images = imageUris;
				});
				$scope.currentView = $scope.VENUE_VIEW;
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
			
			function updateMap(searchQuery, zoomLevel) {
				$http.get('https://maps.google.com/maps/api/geocode/json?address="' + searchQuery + '"&sensor=false').success(function(data) {
					var location = data.results[0].geometry.location;
					$scope.map.center = {latitude: location.lat, longitude: location.lng};
					$scope.map.zoom = zoomLevel;
				});
			}
			
			function getShows(field, value, callback) {
				$http.jsonp('https://archive.org/advancedsearch.php?q=' + field + ':"' + value + '"+AND+collection:GratefulDead&fl%5B%5D=identifier,title&rows=100000&output=json&callback=JSON_CALLBACK').success(function(data) {
					callback(data.response.docs.filter(function(d){return $scope.sampleShowIds.indexOf(d.identifier) >= 0;}));
				});
			}
			
			function getImages(searchQuery, callback) {
				$http.get('https://www.googleapis.com/customsearch/v1?key=' + API_KEY + '&cx=' + SEARCH_ID + '&searchType=image&q=' + searchQuery).success(function(data) {
					callback(data.items.map(function(i){return i.link;}).slice(0,3));
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
			
			function recursiveLoadDymos(versions, i) {
				if (i < versions.length) {
					var currentVersionId = $scope.selectedSong.versions[i].identifier;
					/////MINIMIZE THIS CODE BY REFACTORING DYMO-CORE!!! ALSO FOR CASES WHERE PLAYBACK ENGINE NOT NEEDED..
					new DymoLoader($scope.scheduler, $scope, $http).loadDymoFromJson('files/dymos/', currentVersionId+'.dymo.json', function(loadedDymo) {
						$scope.selectedSong.versions[i].dymoGraph = loadedDymo[0].toJsonSimilarityGraph();
						var generator = new DymoGenerator($scope.scheduler, function(){});
						generator.setDymo(loadedDymo[0]);
						$scope.$apply();
						recursiveLoadDymos(versions, i+1);
					}, $http);
				}
			}
			
			//INIT
			$http.get('files/temp_songs.txt').success(function(data) {
				$scope.sampleSongs = data.split('\n');
				$http.get('files/temp_ids.txt').success(function(data) {
					$scope.sampleShowIds = data.split('\n');
					$scope.gotoShowView($scope.sampleShowIds[0]);
					//$scope.gotoSongView($scope.sampleSongs[0]);
				});
			});
			
		}]);

}());
