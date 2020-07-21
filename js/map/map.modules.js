mapModule.controller('DashboardCtrl', function($scope,$rootScope,$translate,$state,utilService) {
	$scope.onClickToolbar = function() {
		jQuery('#dashboardToolBarDiv').toggleClass('active-share-bottom');
	}

	$scope.logout = function(){
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
	};
	
});

mapModule.controller('BookmarkCtrl', function($scope, $translate, $rootScope, bookmarkservice, userservice) {
	$scope.defaultbookMarkList = [{Name: "My Bookmarks", BookMarkFolderID:null, isShared:false}, {Name: "Shared Bookmarks", BookMarkFolderID:null, isShared:true}];
	$scope.currentBookMarkList = $scope.defaultbookMarkList;
	$scope.bookMarkList = $scope.sharedBookMarkList = $scope.selectBookmarkType = [];
	
	$scope.$on('BOOKMARKEDITED', function(event, data) {
		$scope.getAllBookmarksFoldersAndBookmarks();
		$scope.currentBookMarkList = $scope.defaultbookMarkList;
    });
	
	$scope.getAllBookmarksFoldersAndBookmarks=function() {
		$rootScope.loading = true;
		bookmarkservice.getAllBookmarksFoldersAndBookmarks($rootScope.userInfo.userId,$rootScope.userInfo.token).then(function (result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			  
			  if(resultObj.msg.status == "SUCCESS") {
				  
				  var bookMarkFolderList = resultObj.bookMarkFolderList;
				  var bookMarkListArr = resultObj.bookMarkList_arr;
				  var bookMarkFolderPublicList = resultObj.bookMarkFolderPublicList;
				  var bookMarkListPublicArr = resultObj.bookMarkListPublic_arr;
				  
				  $scope.bookMarkList = [];
				  $scope.sharedBookMarkList = [];
				  
				  for (var int = 0; int < bookMarkFolderList.length; int++) {
					  $scope.bookMarkList.push(bookMarkFolderList[int]);
				}
				  for (var int = 0; int < bookMarkListArr.length; int++) {
					  $scope.bookMarkList.push(bookMarkListArr[int]);
				}
				  
				  for (var int = 0; int < bookMarkFolderPublicList.length; int++) {
					  $scope.sharedBookMarkList.push(bookMarkFolderPublicList[int]);
				}
				  for (var int = 0; int < bookMarkListPublicArr.length; int++) {
					  $scope.sharedBookMarkList.push(bookMarkListPublicArr[int]);
				}
				  
			  } else if (resultObj.msg.code == -1) {
					$rootScope.loading = true;
					userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
						$rootScope.loading = false;
						var resultObj = result.data;
						if (resultObj.msg.status == "SUCCESS") {
							$rootScope.userInfo.token = resultObj.token;
							window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
							$scope.getAllBookmarksFoldersAndBookmarks();
						} else {
							swal(resultObj.msg.msgDesc);
						}
					}, function(response) {
						$rootScope.loading = false;
						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
							swal(alert);
						});
					});
				} else {
				  $rootScope.loading = false;
				  swal(resultObj.msg.msgDesc);
			  }
			  
			}, function ( response ) {
				$rootScope.loading = false;
				$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
					swal(alert);
				});
			});
	};
	$scope.getAllBookmarksFoldersAndBookmarks();
	
	$scope.bookmarkBackBtnClked = function() {
		var curBookMarkList = $scope.currentBookMarkList;
		if(curBookMarkList.length > 0) {
			var curBookMark = curBookMarkList[0];
			if(curBookMark.ParentID === null) {
				$scope.currentBookMarkList = $scope.defaultbookMarkList;
				return;
			}
			$scope.currentBookMarkList = [];
			for (var int = 0; int < $scope.selectBookmarkType.length; int++) {
				var array_element = $scope.selectBookmarkType[int];
				if(curBookMark.ParentID === array_element.BookMarkFolderID) {
					for (var int2 = 0; int2 < $scope.selectBookmarkType.length; int2++) {
						var array_element1 = $scope.selectBookmarkType[int2];
						if(array_element1.ParentID === array_element.ParentID) {
							$scope.currentBookMarkList.push(array_element1);
						}
					}
					break;
				}
			}
		}
	};
	
	$scope.selectBookMark = function(value) {
		
		if(value.isShared !== undefined) {
			if(value.isShared === false) {
				$scope.selectBookmarkType = $scope.bookMarkList;
			}
			else if(value.isShared === true) {
				$scope.selectBookmarkType = $scope.sharedBookMarkList;
			}
		}
		
		var currentBookMarkListValue = $scope.currentBookMarkList;
		
		if((value.BookMarkFolderID !== undefined) && ($scope.selectBookmarkType.length > 0)) {
			$scope.currentBookMarkList = [];
		}
		
		for (var int = 0; int < $scope.selectBookmarkType.length; int++) {
			var array_element = $scope.selectBookmarkType[int];
			if(value.BookMarkFolderID === array_element.ParentID) {
				$scope.currentBookMarkList.push(array_element);
			}
		}
		
		if($scope.currentBookMarkList.length <= 0) {
			swal({   title: "Alert!",   text: "Sorry no bookmark found",   timer: 2000,   showConfirmButton: true });
			$scope.currentBookMarkList = currentBookMarkListValue;
		}
	};
	
	$scope.selectEditBookMark = function(value) {
		
		$scope.mapBookmark.selectedBookmark = value;
		
		$('#myBookmarkFolderActionBarId').removeClass('active-share-bottom');
		$('#bookmarkFolderActionBarId').removeClass('active-share-bottom');
		$('#bookmarkActionBarId').removeClass('active-share-bottom');
		
		if (value.BookMarkFolderID === null && value.isShared === false) {
			$('#myBookmarkFolderActionBarId').addClass('active-share-bottom');
		} else if (value.BookMarkFolderID === null && value.isShared === true) {

		} else if (value.BookMarkFolderID !== null && value.BookMarkFolderID !== undefined) {
			$('#bookmarkFolderActionBarId').addClass('active-share-bottom');
		} else {
			$('#bookmarkActionBarId').addClass('active-share-bottom');
		}
	};
	
});

mapModule.controller('MapLabelCtrl', function($scope, $translate, $rootScope, bookmarkservice) {
	
});
mapModule.controller('SearchCtrl', function($scope, $translate, $rootScope, bookmarkservice) {
	
});
mapModule.controller('MailCtrl', function($scope, $translate, $rootScope, bookmarkservice) {
	
});