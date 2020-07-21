mapModule.controller('MapListCtrl',['$scope','mapservice','$rootScope','$translate','$state','utilService', function ($scope,mapservice,$rootScope,$translate,$state,utilService) { 
    $scope.mapList = [];
    

	$scope.init = function () {
		

		$rootScope.loading = true;
		mapservice.getMapList($rootScope.userInfo.token).then(function(result) {
			if(result != null){
                $scope.mapList = result.maps;
                $scope.loginner = window.localStorage.getItem('firstTimer');

                if ($scope.mapList != null && $scope.mapList.length == 1 && $scope.loginner == "true")
                {
					window.localStorage.setItem('firstTimer', "false");
					
						$state.go("map", { "mapid": $scope.mapList[0].mapID });
					
					
				}
			}
			$rootScope.loading = false;
			}, function ( response ) {
				$rootScope.loading = false;

			});
			$scope.allowFlag = window.localStorage.getItem("allowFlag");

			if ($scope.allowFlag == 1) {
				logoutHandelling();
			} else {
				console.log("test")

			}

		function logoutHandelling() {
				window.localStorage.setItem("allowFlag", 1);
				window.location = "index.html#/login";
				utilService.logout();
			}
			$scope.updateUI($rootScope.language);
	};
	
	jQuery('#mapManagerToolBarDiv').click(function() { 
		jQuery('#mapManagerToolBarDiv').removeClass('active-share-bottom');
	});
	
	$scope.onClickToolbar = function(){
		 jQuery('#mapManagerToolBarDiv').toggleClass('active-share-bottom'); 
	     jQuery.modal.close();
	};

	$scope.logout = function () {
		window.localStorage.setItem("allowFlag", 1);
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
		$scope.updateUI(locale);
	};
	
	$scope.updateUI = function(locale) {
		$scope.removeCSSStyles();
		if (locale === "ar-AE") {
			$rootScope.addCSS("css/styles/maplist/maplist_ar.css");
			$rootScope.removeCSS("css/styles/maplist/maplist_en.css");
		} else {
			$rootScope.addCSS("css/styles/maplist/maplist_en.css");
			$rootScope.removeCSS("css/styles/maplist/maplist_ar.css");
		}
	};

	$scope.$on('$destroy', function() { 
		$scope.removeCSSStyles();
	});

	$scope.removeCSSStyles = function() {
		$rootScope.removeCSS("css/styles/maplist/maplist_en.css");
		$rootScope.removeCSS("css/styles/maplist/maplist_ar.css");
	};

	// $scope.init();
}]);