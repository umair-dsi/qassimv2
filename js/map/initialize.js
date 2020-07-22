
var mapModule = angular.module('app', ['ui.router', 'pascalprecht.translate', 'toggle-switch', 'ui.bootstrap']);

mapModule.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

	$urlRouterProvider.otherwise("/login");
	$stateProvider.state('login', {
		url: "/login",
		templateUrl: "views/map/login.html",
		controller: "LoginCtrl"
	}).state('maplist', {
		url: "/maplist",
		templateUrl: "views/map/maplist.html",
		controller: "MapListCtrl"
	}).state('map', {
		url: "/:mapid",
		templateUrl: "views/map/map.html",
		controller: "MapCtrl",
	}).state('map.layers', {
		templateUrl: "views/map/map.layers.html",
		controller: "MapLayersCtrl",
	}).state('map.bookmark', {
		templateUrl: "views/map/map.bookmark.html",
		controller: "BookmarkCtrl",
	}).state('map.maplabel', {
		templateUrl: "views/map/map.maplabel.html",
		controller: "MapLabelCtrl",
	}).state('map.mail', {
		templateUrl: "views/map/map.mail.html",
		controller: "MailCtrl"
	}).state('usermngt', {
		templateUrl: "views/user/usermngt.html",
		controller: "UserMngtCtrl"
	}).state('userlist', {
		templateUrl: "views/user/userlist.html",
		controller: "UserListCtrl"
	}).state('usergrouplist', {
		templateUrl: "views/user/usergrouplist.html",
		controller: "UserGroupListCtrl"
	}).state('addgroup', {
		templateUrl: "views/user/addgroup.html",
		controller: "AddGroupCtrl"
	}).state('groupdetail', {
		templateUrl: "views/user/addgroup.html",
		params: {
			groupObj: null
		},
		controller: "GroupDetailCtrl"
	}).state('permissionlist', {
		templateUrl: "views/user/permissionlist.html",
		controller: "PermissionListCtrl"
	}).state('permissiondetail', {
		templateUrl: "views/user/permissiondetail.html",
		params: {
			permissionObj: null
		},
		controller: "PermissionDetailCtrl"
	}).state('systemSetting', {
		templateUrl: "views/user/systemSetting.html",
		controller: "SystemSettingCtrl"
	}).state('adduser', {
		templateUrl: "views/user/adduser.html",
		controller: "AddUserCtrl"
	}).state('edituser', {
		templateUrl: "views/user/edituser.html",
		params: {
			userObj: null
		},
		controller: "EditUserCtrl"
	});

	$translateProvider.useStaticFilesLoader({
		prefix: 'languages/map/',
		suffix: '.json'
	});
	$translateProvider.preferredLanguage('en-US');
	$translateProvider.fallbackLanguage('en-US');

}]).run(function ($rootScope) {
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		// setTimeout(function(){ $("#divMainview").width($("#header-fixed").width()) }, 1000);
		// if (toState.redirectTo) {
		// 	event.preventDefault();
		// 	$state.go(toState.redirectTo, toParams);
		// }
	});
});

mapModule.controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$state', '$timeout', '$translate', 'mapservice', 'utilService', function ($scope, $http, $rootScope, $state, $timeout, $translate, mapservice, utilService) {

	$scope.init = function () {
		//                          alert("loginctrl");
		if ($scope.allowFlag == 1) {
			$rootScope.loading = false;
		}
		$scope.inValidCredential = false;
		$scope.warningMsg = "";
		$rootScope.loginUserName = "";
		// $scope.login = {username: "", password: ""};

		$scope.updateUI($rootScope.language);
		$scope.allowFlag = window.localStorage.getItem("allowFlag");


	};

	$scope.$on('$viewContentLoaded', function () {


		$("#languageChangeId").unbind('click');
		$("#languageChangeId").on("click", function (e) {
			if ($rootScope.language == "en-US") {
				utilService.changeLocaleTo("ar-AE");
			} else {
				utilService.changeLocaleTo("en-US");
			}
		});

		// window.localStorage.clear();

		if ($scope.loginStatus != undefined && $scope.loginStatus != null && $scope.test == true && $scope.allowFlag == 0) {

			var userProfile = JSON.parse(window.localStorage.getItem("USER_PROFILE"));
			$scope.login = { username: "", password: "" };
			$scope.login.username = userProfile.username;
			$scope.login.password = userProfile.password;
			$timeout(function () {
				$scope.submitLoginDetails($scope.login);
			}, 1000);
		}
	});

	$scope.submitLoginDetails = function (userObj) {
		if (userObj != null && userObj.username.length > 0 && userObj.password.length > 0) {
			$rootScope.loading = true;
			try {
				$http.post($rootScope.baseUrl + "Account/m_Login", {
					username: userObj.username,
					password: userObj.password,
					deviceToken: ($rootScope.refreshToken != undefined && $rootScope.refreshToken != null && $rootScope.refreshToken.length > 0) ? $rootScope.refreshToken : "NA"
				}).then(function (result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					console.log(resultObj);
					if (resultObj.msg.status == "SUCCESS") {
						var userprofile = {
							token: resultObj.token,
							userId: resultObj.userProfile.UserID,
							username: resultObj.userProfile.UserName,
							password: userObj.password,
							GroupID: resultObj.userProfile.GroupID
						}
						$rootScope.loginUserName = resultObj.userProfile.UserName;
						$rootScope.userInfo = userprofile;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify(userprofile));
						window.localStorage.setItem("GS_USER_LOGIN_STATUS", "true");
						window.localStorage.setItem('firstTimer', "true");
						window.localStorage.setItem("allowFlag", 0);
						$state.go('maplist', {});
					} else {
						$scope.inValidCredential = true;
						$scope.warningMsg = resultObj.msg.msgDesc;
						$timeout(function () {
							$scope.inValidCredential = false;
							$scope.warningMsg = "";
						}, 3000);
					}
				}, function (response) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert101) {
						$translate('MAP.OK').then(function (alert102) {
							lnv.alert({
								content: alert101,
								alertBtnText: alert102
							});
						});
					});
				});
			}
			catch (e) {
				$rootScope.loading = false;
				$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert101) {
					$translate('MAP.OK').then(function (alert102) {
						lnv.alert({
							content: alert101,
							alertBtnText: alert102
						});
					});
				});
			}

		} else {
			$translate('ERROR_MESSAGES.ENTER_USERNAME_AND_PASSWORD').then(function (alert101) {
				$translate('MAP.OK').then(function (alert102) {
					lnv.alert({
						content: alert101,
						alertBtnText: alert102
					});
				});
			});
		}
	};

	$scope.updateUI = function (locale) {
		$scope.removeCSSStyles();
		if (locale === "ar-AE") {
			$rootScope.addCSS("css/styles/login/login_ar.css");
			$rootScope.removeCSS("css/styles/login/login_en.css");
		} else {
			$rootScope.addCSS("css/styles/login/login_en.css");
			$rootScope.removeCSS("css/styles/login/login_ar.css");
		}
	};

	$scope.$on('$destroy', function () {
		$scope.removeCSSStyles();
	});

	$scope.removeCSSStyles = function () {
		$rootScope.removeCSS("css/styles/login/login_en.css");
		$rootScope.removeCSS("css/styles/login/login_ar.css");
	};

	$scope.onLanguageChange = function (value) {
		if (value) {
			$scope.updateUI("ar-AE");
		} else {
			$scope.updateUI("en-US");
		}
	};
}]);

mapModule.controller('IntializeCtrl', function ($scope, $rootScope, utilService, $cordovaNetwork, $translate, $state) {
	$scope.init = function () {
		//alert("initialize ctrl");
		window.localStorage.setItem("allowFlag", 0);
		console.log(window.localStorage.getItem("allowFlag"));

		$rootScope.loading = false;
		$rootScope.toc_map = null;
		$rootScope.mapObj = null;
		$rootScope.toc_layers = [];
		$rootScope.layerCategory = 'layer';
		$rootScope.L_layers = [];
		$rootScope.unchecked_layerids = [];
		//$rootScope.baseUrl = "http://access.spaceimagingme.com:6092/qassimv4/";
		$rootScope.baseUrl = "https://fe.alqassim.gov.sa/gis/";
		//$rootScope.baseUrl = "http://localhost:58720/";
		//$rootScope.baseUrl = "http://access.spaceimagingme.com:9090/qassimgeoserv/";
		$rootScope.refreshToken = null;
		$scope.mapBookmark = { selectedBookmark: {} };
		$rootScope.isSessionTimeout = false;

		window.localStorage.getItem("allowFlag");

		$rootScope.addCSS = function (href) {
			var cssLink = $("<link>");
			$("head").append(cssLink);
			cssLink.attr({
				rel: "stylesheet",
				type: "text/css",
				href: href
			});
		};

		$rootScope.removeCSS = function (href) {
			$('head').find('link[href^="' + href + '"]').remove();
		};

		$rootScope.addJS = function (src) {
			var jsLink = $("<script>");
			$("head").append(jsLink);
			jsLink.attr({
				type: "text/javascript",
				src: src
			});
		};

		$rootScope.removeJS = function (src) {
			$('head').find('script[src^="' + src + '"]').remove();
		};

		$rootScope.sessionTimeoutAlert = function () {
			if ($rootScope.isSessionTimeout == false && $state.current.name != "login") {
				$rootScope.isSessionTimeout = true;
				$translate('MAP.SESSION_TIMEOUT').then(function (alert101) {
					$translate('MAP.OK').then(function (alert102) {
						lnv.alert({
							content: alert101,
							alertBtnText: alert102,
							alertHandler: function () {
								$rootScope.isSessionTimeout = false;
								utilService.logout();
							}
						});
					});
				});
			}
		};

		utilService.changeLocaleTo("en-US");

		document.addEventListener("deviceready", function () {
			// Check internet connection
			var type = $cordovaNetwork.getNetwork()
			var isOnline = $cordovaNetwork.isOnline()
			var isOffline = $cordovaNetwork.isOffline()
			// listen for Online event
			$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
				var onlineState = networkState;
				$translate('MAP.INTERNET_CONNECTION_ONLINE').then(function (alert101) {
					$.toast({
						text: alert101,
						textAlign: 'center',
						position: 'bottom-center',
						showHideTransition: 'slide',
						allowToastClose: false
					});
				});
			});
			// listen for Offline event
			$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
				var offlineState = networkState;
				$translate('MAP.INTERNET_CONNECTION_OFFLINE').then(function (alert101) {
					$.toast({
						text: alert101,
						textAlign: 'center',
						position: 'bottom-center',
						showHideTransition: 'slide',
						allowToastClose: false
					});
				});
			});

			if (device.platform != 'browser') {
				//Firebase
				if (typeof window.FirebasePlugin !== 'undefined') {
					window.FirebasePlugin.hasPermission(function (data) {
						console.log("firebase permissions enabled: " + data.isEnabled);
						if (!data.isEnabled) {
							window.FirebasePlugin.grantPermission();
						}
					});

					window.FirebasePlugin.getToken(function (token) {
						// save this server-side and use it to push notifications to this device
						$rootScope.refreshToken = token;
						console.log("token: " + token);
					}, function (error) {
						console.error("token error: " + error);
					});

					window.FirebasePlugin.onTokenRefresh(function (token) {
						// save this server-side and use it to push notifications to this device
						$rootScope.refreshToken = token;
						console.log("refresh token: " + token);
					}, function (error) {
						console.error("refresh token error: " + error);
					});

					window.FirebasePlugin.onNotificationOpen(function (notification) {
						console.log("notification received: " + notification);
					}, function (error) {
						console.error("notification received error: " + error);
					}); sem
				}

			}
		}, false);
	};
});

mapModule.service('utilService', function ($state, $rootScope, $translate) {
	this.logout = function () {
		$state.go('login', {});
	};

	this.changeLocaleTo = function (locale) {
		if (locale === "ar-AE") {
			$rootScope.language = "ar-AE";
			$rootScope.dir = "rtl";
			$rootScope.globalLang = "ar";
			$translate.use('ar-AE');
		} else {
			$rootScope.language = "en-US";
			$rootScope.globalLang = "en";
			$rootScope.dir = "ltr";
			$translate.use('en-US');
		}
	};
});

mapModule.directive('aDisabled', function () {
	return {
		compile: function (tElement, tAttrs, transclude) {
			//Disable ngClick
			tAttrs["ngClick"] = "!(" + tAttrs["aDisabled"] + ") && (" + tAttrs["ngClick"] + ")";

			//return a link function
			return function (scope, iElement, iAttrs) {

				//Toggle "disabled" to class when aDisabled becomes true
				scope.$watch(iAttrs["aDisabled"], function (newValue) {
					if (newValue !== undefined) {
						iElement.toggleClass("disabled", newValue);
					}
				});

				//Disable href on click
				iElement.on("click", function (e) {
					if (scope.$eval(iAttrs["aDisabled"])) {
						e.preventDefault();
					}
				});
			};
		}
	};
}).directive("compareTo", function () {
	return {
		require: "ngModel",
		scope: {
			otherModelValue: "=compareTo"
		},
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.compareTo = function (modelValue) {
				return modelValue == scope.otherModelValue;
			};

			scope.$watch("otherModelValue", function () {
				ngModel.$validate();
			});
		}
	};
}).factory('$cordovaNetwork', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    /**
      * Fires offline a event
      */
	var offlineEvent = function () {
		var networkState = navigator.connection.type;
		$timeout(function () {
			$rootScope.$broadcast('$cordovaNetwork:offline', networkState);
		});
	};

    /**
      * Fires online a event
      */
	var onlineEvent = function () {
		var networkState = navigator.connection.type;
		$timeout(function () {
			$rootScope.$broadcast('$cordovaNetwork:online', networkState);
		});
	};

	document.addEventListener('deviceready', function () {
		if (navigator.connection) {
			document.addEventListener('offline', offlineEvent, false);
			document.addEventListener('online', onlineEvent, false);
		}
	});

	return {
		getNetwork: function () {
			return navigator.connection.type;
		},

		isOnline: function () {
			var networkState = navigator.connection.type;
			return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
		},

		isOffline: function () {
			var networkState = navigator.connection.type;
			return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
		},

		clearOfflineWatch: function () {
			document.removeEventListener('offline', offlineEvent);
			$rootScope.$$listeners['$cordovaNetwork:offline'] = [];
		},

		clearOnlineWatch: function () {
			document.removeEventListener('online', onlineEvent);
			$rootScope.$$listeners['$cordovaNetwork:online'] = [];
		}
	};
}]);
