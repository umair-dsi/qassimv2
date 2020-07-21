mapModule.service('userservice', [ '$http', function($http) {

	var baseUrl = window.localStorage.getItem("BASE_URL");
	var locale = window.localStorage.getItem("GS_LANGUAGE");

	this.userLogin = function(username, password) {
		return $http.post(baseUrl + "Account/m_Login", {
			username : username,
			password : password
		}).then(function(result) {
			return result;
		});
	};

	// UserAdmin

	// PermissionSchemes
	this.getAllUserGroups = function(userId, token) {
		return $http.post(baseUrl + "Group/m_GetUserGroupList", {
			userid : userId,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.getAllPermissionSchemes = function(userId, token) {
		return $http.post(baseUrl + "PermissionScheme/m_GetAllPermissionSchemes", {
			userid : userId,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.getAllModules = function(userId, token) {
		return $http.post(baseUrl + "PermissionScheme/m_GetAllModules", {
			userid : userId,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.getAllPermissions = function(userId, token) {
		return $http.post(baseUrl + "PermissionScheme/m_GetAllPermissions", {
			userid : userId,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.deletePermissionScheme = function(userId, token, id) {
		return $http.post(baseUrl + "PermissionScheme/m_DeleteScheme", {
			userid : userId,
			token : token,
			id : id,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.savePermissionScheme = function(userId, token, permissionscheme, permissions) {
		return $http.post(baseUrl + "PermissionScheme/m_savePermissionScheme", {
			userid : userId,
			token : token,
			permissionscheme : permissionscheme,
			permissions : permissions,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.getAllPermissionsByPermissionSchemeId = function(userId, token, permissionSchemeId) {
		return $http.post(baseUrl + "PermissionScheme/m_Permissions", {
			userid : userId,
			token : token,
			permissionschemeid : permissionSchemeId,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	// -- PermissionSchemes

	// UserGroups
	this.getAllGroupUsers = function() {
		return $http.post(baseUrl + "Group/m_getAllUserGroups", {
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.deleteUserGroup = function(userId, token, groupid) {
		return $http.post(baseUrl + "Group/m_deleteGroup", {
			userid : userId,
			token : token,
			groupid : groupid,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.saveUserGroup = function(userId, token, group) {
		return $http.post(baseUrl + "Group/m_saveGroup", {
			userid : userId,
			token : token,
			group : group,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	// --UserGroups

	// Users
	this.getUserByUserid = function(loggedInUserid, userId, token) {
		return $http.post(baseUrl + "user/m_getUserByUserid", {
			loggedInUserid : loggedInUserid,
			userid : userId,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.getUsersByUsergroup = function(userId, groupid, token) {
		return $http.post(baseUrl + "user/m_getUsersByUsergroup", {
			userid : userId,
			groupid : groupid,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.deleteUserByUserId = function(userId, targetuserid, token) {
		return $http.post(baseUrl + "user/m_deleteUser", {
			userid : userId,
			targetuserid : targetuserid,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.getUserPermissions = function(userId, targetuserid, token) {
		return $http.post(baseUrl + "user/m_getUserPermissions", {
			userid : userId,
			targetuserid : targetuserid,
			token : token,
			locale : locale
		}).then(function(result) {
			return result;
		});
	};
	this.saveUser = function(userId, user, token, customPermissions) {
		return $http.post(baseUrl + "user/m_saveUser", {
			userid : userId,
			user : user,
			token : token,
			locale : locale,
			customPermissions : customPermissions
		}).then(function(result) {
			return result;
		});
	};
	// --Users
	// --UserAdmin
} ]);

mapModule.controller('UserMngtCtrl', [ '$scope', 'utilService', function($scope, utilService) {
	$scope.onClickToolbar = function() {
		jQuery('#usrMngToolbarDiv').toggleClass('active-share-bottom');
		jQuery.modal.close();
	};

	$scope.logout = function() {
		utilService.logout();
	};

	$scope.changeLocaleTo = function(locale) {
		utilService.changeLocaleTo(locale);
	};

} ]);

mapModule.controller('SystemSettingCtrl', [ '$scope', 'userservice', '$rootScope', '$translate', '$state', function($scope, userservice, $rootScope, $translate, $state) {
	$scope.init = function() {
	};
} ]);

mapModule.controller('GroupDetailCtrl', [ '$scope', 'userservice', 'utilService', '$translate', '$rootScope', '$state', '$stateParams', function($scope, userservice, utilService, $translate, $rootScope, $state, $stateParams) {
	$scope.group = $stateParams.groupObj;
	if($scope.group != null || $scope.group != undefined) {
		$scope.group.activeState = ($scope.group.Active === 'Y') ? true : false; 
	}
	$scope.modulePermissions = [];
	$scope.allPermissionSchemes = [];
	$scope.selectedPermissionScheme = {};
	
	$scope.selectChangedUGPermissionScheme = function(value) {
		$scope.getAllModules();
	};
	
	//get all permission schemes
	$scope.getAllPermissionSchemes = function() {
		$rootScope.loading = true;
		userservice.getAllPermissionSchemes($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function (result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			  
			  if(resultObj.msg.status == "SUCCESS"){
				  $scope.allPermissionSchemes = resultObj.allpermissionSchemes;
				  for (var int = 0; int < $scope.allPermissionSchemes.length; int++) {
						var element = $scope.allPermissionSchemes[int];
						if ($scope.group === undefined || $scope.group === null || $scope.group.IsAdministrator) {
							if(element.ID == "1") {
								$scope.selectedPermissionScheme = element;
								break;
							}
							
						} else if(element.ID == $scope.group.PermissionSchemeID) {
							$scope.selectedPermissionScheme = element;
							break;
						}
				  }
				  $scope.getAllModules(); 
				  
			  } else if (resultObj.msg.message == "INVALID_TOKEN"){
				  $rootScope.loading = true;
				  userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function (result) {
					  $rootScope.loading = false;
						var resultObj = result.data;
						  if(resultObj.msg.status == "SUCCESS"){
							  $rootScope.userInfo.token = resultObj.token;
							  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
							  $scope.getAllPermissionSchemes();
						  }
						  else {
							  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
							    	swal(alert);
							    	 });
						  }
						}, function ( response ) {
						   // TODO: handle the error somehow
								$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    	 });
						      });
				  
			  }
			  else {
				  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
				    	swal(alert);
				    	 });
			  }
			  
			}, function ( response ) {
			   // TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
				    	swal(alert);
				    	 });
					 
			      });
	};
	
	$scope.getAllPermissionSchemes();
	//--get all permission schemes
	
	// get all modules
	$scope.getAllModules = function() {
		$rootScope.loading = true;
		userservice.getAllModules($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				var allModules = resultObj.allModules;
				// get all permissions
				$rootScope.loading = true;
				userservice.getAllPermissions($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						var allPermissions = resultObj.allpermissions;
						$scope.modulePermissions = [];
						for (var int = 0; int < allModules.length; int++) {
							var model = allModules[int];
							var modelArr = [];
							for (var int2 = 0; int2 < allPermissions.length; int2++) {
								var modelPermission = allPermissions[int2];
								if (model.ModuleID == modelPermission.moduleId) {
									var isPermissionIDExists = false;
									if($scope.selectedPermissionScheme.permissions !== undefined){
										for (var int3 = 0; int3 < $scope.selectedPermissionScheme.permissions.length; int3++) {
											var permisionSchem = $scope.selectedPermissionScheme.permissions[int3];
											if(permisionSchem.PermissionID === modelPermission.PermissionID) {
												isPermissionIDExists = true;
												break;
											}
										}
									}
									modelPermission.isClicked = isPermissionIDExists;
									modelArr.push(modelPermission);
								}
							}
							model.permissions = modelArr;
							$scope.modulePermissions.push(model);
						}
					} else {
						$scope.getAllModules();
					}
				}, function(response) {
					// TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.getAllModules();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
					    });
					}
				}, function(response) {
					// TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
			    });
			}

		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};
	
	$scope.selectEnabled = function(value) {
		$scope.group.Active = value ? "Y" : "N";
	};
	
	$scope.selectAdministrationMode = function(value) {
		if(value) {
			$scope.getAllPermissionSchemes();
		}
	};
	
	$scope.selectSaveUserGroup = function() {
		$scope.saveUserGroup=function() {
			
			var group = {};
			group.GroupID = ($scope.group.GroupID !== undefined) ? $scope.group.GroupID : null; //=null for new user
            group.Description = $scope.group.Description;
            group.Name = $scope.group.Name;
            group.Active= $scope.group.Active !== undefined ? $scope.group.Active : "N";
            group.IsAdministrator = $scope.group.IsAdministrator !== undefined ? $scope.group.IsAdministrator : false;
            group.PermissionSchemeID = $scope.selectedPermissionScheme.ID;
            group.GroupRole = group.IsAdministrator ? "Administrator" : "RegularUser";
            
            $rootScope.loading = true;
            userservice.saveUserGroup($rootScope.userInfo.userId,$rootScope.userInfo.token,group).then(function (result) {
            	$rootScope.loading = false;
				var resultObj = result.data;
				  
				  if(resultObj.msg.message == "USER_GROUP_SAVE_SUCCESS"){
					  //swal(resultObj.msg.msgDesc);
					  $state.go('usergrouplist');
				  } else if (resultObj.msg.message == "INVALID_TOKEN"){
						$rootScope.loading = true;
						userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
							$rootScope.loading = false;
							var resultObj = result.data;
							if (resultObj.msg.status == "SUCCESS") {
								$rootScope.userInfo.token = resultObj.token;
								window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
								$scope.saveUserGroup();
							} else {
								$translate('ERROR_MESSAGES.NO_DATA_SAVED').then(function (alert) {
							    	swal(alert);
							    });
							}
						}, function(response) {
							// TODO: handle the error somehow
							$rootScope.loading = false;
							$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
								swal(alert);
							});
						});
					} else if (resultObj.msg.message == "NAME_EXISTS") {
						$translate('ERROR_MESSAGES.USER_GROUP_NAME_EXISTS').then(function (alert) {
					    	swal(alert);
					    });
					} else if (resultObj.msg.message == "USER_GROUP_SAVE_FAIL"){
						$translate('ERROR_MESSAGES.USER_GROUP_SAVE_FAIL').then(function (alert) {
					    	swal(alert);
					    });
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_SAVED').then(function (alert) {
					    	swal(alert);
					    });
				  }
				  
				}, function ( response ) {
				   // TODO: handle the error somehow
						$rootScope.loading = false;
						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
					    	swal(alert);
					    	 });
				      });
		};
		
		$scope.saveUserGroup();
	};
	
	$scope.selectDeleteUserGroup = function() {
		$scope.deleteUserGroup=function() {
			$rootScope.loading = true;
			userservice.deleteUserGroup($rootScope.userInfo.userId, $rootScope.userInfo.token, $scope.group.GroupID).then(function (result) {
				$rootScope.loading = false;
				var resultObj = result.data;
				  
				  if(resultObj.msg.message == "USER_GROUP_DELETE_SUCCESS"){
					  //swal(resultObj.msg.msgDesc);
					  $state.go('usergrouplist');
				  } else if (resultObj.msg.message == "INVALID_TOKEN"){
						$rootScope.loading = true;
						userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
							$rootScope.loading = false;
							var resultObj = result.data;
							if (resultObj.msg.status == "SUCCESS") {
								$rootScope.userInfo.token = resultObj.token;
								window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
								$scope.deleteUserGroup();
							} else {
								$translate('ERROR_MESSAGES.NO_DATA_DELETED').then(function (alert) {
							    	swal(alert);
							    });
							}
						}, function(response) {
							$rootScope.loading = false;
							$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
								swal(alert);
							});
						});
					} else if (resultObj.msg.message == "USER_GROUP_DELETE_FAIL"){
						$translate('ERROR_MESSAGES.USER_GROUP_DELETE_FAIL').then(function (alert) {
					    	swal(alert);
					    });
					} else if (resultObj.msg.message == "GROUP_ADMIN_CANNOT_DELETE"){
						$translate('ERROR_MESSAGES.GROUP_ADMIN_CANNOT_DELETE').then(function (alert) {
					    	swal(alert);
					    });
					} else {
					  $translate('ERROR_MESSAGES.NO_DATA_DELETED').then(function (alert) {
					    	swal(alert);
					    });
				  }
				  
				}, function ( response ) {
				   // TODO: handle the error somehow
						$rootScope.loading = false;
						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
					    	swal(alert);
					    	 });
				      });
		};
		
		
		swal({   
			title: "Confirm Delete",   
			text: "Are you sure you want to delete?",   
//			type: "warning",   
			showCancelButton: true,   
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "Yes",
			cancelButtonText: "No"
			}, 
			function(){   
				$scope.deleteUserGroup();
				}
			);
	};
	
	$scope.onClickToolbar = function(){
		 jQuery('#userGroupDetailToolBarDiv').toggleClass('active-share-bottom'); 
	     jQuery.modal.close();
	};
	
	$scope.logout = function(){
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
	};
} ]);

//anudeep
mapModule.controller('PermissionDetailCtrl', [ '$scope', '$state', '$translate', 'userservice', 'utilService', '$rootScope', '$stateParams', function($scope, $state, $translate, userservice, utilService, $rootScope, $stateParams) {
	$scope.permissionDetail = $stateParams.permissionObj;
	$scope.modulePermissions = [];
	// get all modules
	$scope.getAllModules = function() {
		$rootScope.loading = true;
		userservice.getAllModules($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				var allModules = resultObj.allModules;
				// get all permissions
				$rootScope.loading = true;
				userservice.getAllPermissions($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						var allPermissions = resultObj.allpermissions;
						for (var int = 0; int < allModules.length; int++) {
							var model = allModules[int];
							var modelArr = [];
							for (var int2 = 0; int2 < allPermissions.length; int2++) {
								var modelPermission = allPermissions[int2];
								if (model.ModuleID == modelPermission.moduleId) {
									var isPermissionIDExists = false;
									if ($scope.permissionDetail !== null) {
										for (var int3 = 0; int3 < $scope.permissionDetail.permissions.length; int3++) {
											var permisionSchem = $scope.permissionDetail.permissions[int3];
											if (permisionSchem.PermissionID === modelPermission.PermissionID) {
												isPermissionIDExists = true;
												break;
											}
										}
									}
									modelPermission.isClicked = isPermissionIDExists;
									modelArr.push(modelPermission);
								}
							}
							model.permissions = modelArr;
							$scope.modulePermissions.push(model);
							console.log($scope.modulePermissions);
						}
					} else {
						$scope.getAllModules();
					}
				}, function(response) {
					// TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
					//$scope.logout();
				});
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.getAllModules();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
					    });
					}
				}, function(response) {
					// TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
			    });
			}

		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};
	
	$scope.getAllModules();
	
	$scope.selectAllPermissionSchemes = function(value) {
		for (var int = 0; int < $scope.modulePermissions.length; int++) {
			for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
//				$scope.selectModulePermissionSchemes = value;
				$scope.modulePermissions[int].permissions[int2].isClicked=value;
			}
		}
	};
	
	$scope.selectAllmodulePermissionSchemes = function(value,moduleID) {
		for (var int = 0; int < $scope.modulePermissions.length; int++) {
			if($scope.modulePermissions[int].ModuleID === moduleID){
				for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
					$scope.modulePermissions[int].permissions[int2].isClicked=value;
				}
				break;
			}
		}
	};
	
	$scope.unselectPermissionScheme = function() {
//		var isAllPermissionSchemesChecked = true;
//		for (var int = 0; int < $scope.modulePermissions.length; int++) {
//			for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
//				var isChecked = $scope.modulePermissions[int].permissions[int2].isClicked;
//				if(!isChecked) {
//					isAllPermissionSchemesChecked = isChecked;
//					break;
//				}
//			}
//			if(!isAllPermissionSchemesChecked) {
//				break;
//			}
//		}
//		$scope.allPermissionSchemes = isAllPermissionSchemesChecked;
	};
	
	$scope.selectSavePermissionDetail = function () {
		
		$scope.savePermissionScheme = function() {
			var savePermissionSchem = {permissionscheme: {}};

			savePermissionSchem.permissionscheme.ID = $scope.permissionDetail.ID;
			savePermissionSchem.permissionscheme.NAME = $scope.permissionDetail.NAME;
			savePermissionSchem.permissionscheme.NAME_AR = $scope.permissionDetail.NAME_AR;
			
			savePermissionSchem.permissions = [];

			for (var int = 0; int < $scope.modulePermissions.length; int++) {
				for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
					var permission = $scope.modulePermissions[int].permissions[int2];
					if (permission.isClicked === true){
						var permission1 = {};
						permission1.PermissionID = permission.PermissionID;
						permission1.NAME = permission.Name;
						permission1.NAME_AR = permission.Name_Ar;
						permission1.PERMISSIONCONSTANT = permission.PermissionConstant;
						savePermissionSchem.permissions.push(permission1);
					}
				}
			}
			$rootScope.loading = true;
			userservice.savePermissionScheme($rootScope.userInfo.userId,$rootScope.userInfo.token,savePermissionSchem.permissionscheme,savePermissionSchem.permissions).then(function (result) {
				$rootScope.loading = false;
				var resultObj = result.data;
				  
				  if(resultObj.msg.message == "PERMISSION_SCHEME_SAVE_SUCCESS"){
					  //swal(resultObj.msg.msgDesc);
					  $state.go('permissionlist');
				  } else if (resultObj.msg.message == "INVALID_TOKEN"){
					  $rootScope.loading = true;
					  userservice.userLogin($scope.userInfo.username,$scope.userInfo.password).then(function (result) {
						  $rootScope.loading = false;
							var resultObj = result.data;
							  if(resultObj.msg.status == "SUCCESS"){
								  	$rootScope.userInfo.token = resultObj.token;
									window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
									$scope.savePermissionScheme();
							  }
							  else {
								  $translate('ERROR_MESSAGES.NO_DATA_SAVED').then(function (alert) {
								    	swal(alert);
								    });
							  }
							}, function ( response ) {
							   // TODO: handle the error somehow
								$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    	 });
							      });
				  }  else if (resultObj.msg.message == "NAME_EXISTS"){
					  $translate('ERROR_MESSAGES.PERMISSION_SCHEME_NAME_EXISTS').then(function (alert) {
					    	swal(alert);
					    });
				  } else {
					  $translate('ERROR_MESSAGES.NO_DATA_SAVED').then(function (alert) {
					    	swal(alert);
					    });
				  }
				  
				}, function ( response ) {
				   // TODO: handle the error somehow
						$rootScope.loading = false;
						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
					    	swal(alert);
					    	 });
				      });
		};
		
		if($scope.modulePermissions.length > 0) {
			$scope.savePermissionScheme();
		}
	};
	
	$scope.selectDeletePermissionScheme = function(){
		$scope.deletePermissionScheme=function() {
			$rootScope.loading = true;
			userservice.deletePermissionScheme($rootScope.userInfo.userId,$rootScope.userInfo.token,$scope.permissionDetail.ID).then(function (result) {
				$rootScope.loading = false;
				var resultObj = result.data;
				  
				  if(resultObj.msg.message == "PERM_SCHEME_DELETE_SUCCESS"){
					  //swal(resultObj.msg.msgDesc);
					  $state.go('permissionlist');
				  } else if (resultObj.msg.message == "INVALID_TOKEN"){
					  $rootScope.loading = true;
					  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
						  $rootScope.loading = false;
							var resultObj = result.data;
							  if(resultObj.msg.status == "SUCCESS"){
								  $rootScope.userInfo.token = resultObj.token;
								  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
								  $scope.deletePermissionScheme();
							  }
							  else {
								  $translate('ERROR_MESSAGES.NO_DATA_DELETED').then(function (alert) {
								    	swal(alert);
								  });
							  }
							}, function ( response ) {
							   // TODO: handle the error somehow
									rootScope.loading = false;
									$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
								    	swal(alert);
								    });
							     });
					  
				  }
				  else if (resultObj.msg.message == "DELETE_DEFAULT_SCHEME_NOT_ALLOWED") {
					  $translate('ERROR_MESSAGES.DELETE_DEFAULT_SCHEME_NOT_ALLOWED').then(function (alert) {
					    	swal(alert);
					  });
				  }
				  else {
					  $translate('ERROR_MESSAGES.NO_DATA_DELETED').then(function (alert) {
					    	swal(alert);
					  });
				  }
				  
				}, function ( response ) {
				   // TODO: handle the error somehow
						$rootScope.loading = false;
						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
					    	swal(alert);
					    });
				 });
		};
		
		swal({   
			title: "Confirm Delete",   
			text: "Are you sure you want to delete?",   
//			type: "warning",   
			showCancelButton: true,   
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "Yes",
			cancelButtonText: "No"
			}, 
			function(){   
				$scope.deletePermissionScheme();
				}
			);
	};
	
	$scope.onClickToolbar = function(){
		 jQuery('#permissionDetailToolBarDiv').toggleClass('active-share-bottom'); 
	     jQuery.modal.close();
	};
	
	$scope.logout = function(){
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
	};
	
}]);
//anudeep

mapModule.controller('EditUserCtrl', [ '$scope', '$state', '$translate', 'userservice', 'utilService', '$rootScope', '$stateParams', function($scope, $state, $translate, userservice, utilService, $rootScope, $stateParams) {
	$scope.addUser = $stateParams.userObj;
	
	if($scope.addUser != null || $scope.addUser != undefined) {
		$scope.addUser.activeState = ($scope.addUser.Active === 'Y') ? true : false;
		$scope.addUser.OfficePhone = Number($scope.addUser.OfficePhone);
		$scope.addUser.ConfirmPassword = $stateParams.userObj.Password;
	}
	
	$scope.userGroups = [];
	$scope.selectedUserGroup = {};
	$scope.modulePermissions = [];
	$scope.userPermission = {};
	
	$scope.getAllGroupUsers=function() {
		$rootScope.loading = true;
		userservice.getAllGroupUsers().then(function (result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			  if(resultObj.msg.status == "SUCCESS"){
				  $scope.userGroups = resultObj.groups;
				  for (var int = 0; int < $scope.userGroups.length; int++) {
					var array_element = $scope.userGroups[int];
					if($scope.addUser === null || $scope.addUser === undefined) {
						if(array_element.GroupID == 1) {
							$scope.selectedUserGroup = array_element;
							break;
						}
					} else if ($scope.addUser.GroupID === array_element.GroupID) {
						  $scope.selectedUserGroup = array_element;
						  break;
					}
				}
				$scope.getUserPermissions();
			  } else if (resultObj.msg.message == "INVALID_TOKEN"){
				  $rootScope.loading = true;
				  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
					  $rootScope.loading = false;
						var resultObj = result.data;
						  if(resultObj.msg.status == "SUCCESS"){
							  $rootScope.userInfo.token = resultObj.token;
							  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
							  $scope.getAllGroupUsers();
						  }
						  else {
							  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
							    	swal(alert);
							    });
						  }
						}, function ( response ) {
						   // TODO: handle the error somehow
								$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    });
						   });
			  } else {
				  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
				    	swal(alert);
				    });
			  }
			}, function ( response ) {
			   // TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
				    	swal(alert);
				    });
			  });
	};
	
	$scope.getAllGroupUsers();

	$scope.selectUserStatus = function(value) {
		$scope.addUser.Active = value ? "Y" : "N";
	};
	
	$scope.changeCreateUUserGroup = function (value) {
		$scope.addUser.GroupID = value.GroupID;
		$scope.getAllPermissionsByPermissionSchemeId();
	};
	
	$scope.getUserPermissions=function() {
		$rootScope.loading = true;
		var userId = ($scope.addUser != undefined || $scope.addUser != null) ? $scope.addUser.UserID : 1;
		userservice.getUserPermissions($rootScope.userInfo.userId, userId, $rootScope.userInfo.token).then(function (result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			  
			  if(resultObj.msg.status == "SUCCESS"){
				  $scope.userPermission.permissions = resultObj.userpermissions.permissions;
				  $scope.userPermission.customPermissions = resultObj.userpermissions.customPermissions;
				  $scope.getAllModules();
			  } else if (resultObj.msg.message == "INVALID_TOKEN") {
				  $rootScope.loading = true;
				  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
					  $rootScope.loading = false;
						var resultObj = result.data;
						  if(resultObj.msg.status == "SUCCESS"){
							  $rootScope.userInfo.token = resultObj.token;
							  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
							  $scope.getUserPermissions();
						  }
						  else {
							  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
							    	swal(alert);
							  });
						  }
						}, function ( response ) {
								$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    	 });
						      });
			  }
			  else {
				  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
				    	swal(alert);
				  });
			  }
			  
			}, function ( response ) {
			   // TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
				    	swal(alert);
				    });
			    });
		};
	
	//get all modules    	
	$scope.getAllModules = function() {
		$rootScope.loading = true;
		userservice.getAllModules($rootScope.userInfo.userId,$rootScope.userInfo.token).then(function (result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			  
			  if(resultObj.msg.status == "SUCCESS"){
				  var allModules = resultObj.allModules;
				  
				  //get all permissions
				  $rootScope.loading = true;
				  userservice.getAllPermissions($rootScope.userInfo.userId,$rootScope.userInfo.token).then(function (result) {
					  $rootScope.loading = false;
						var resultObj = result.data;
						  
						  if(resultObj.msg.status == "SUCCESS"){
							  var allPermissions = resultObj.allpermissions;
							  $scope.modulePermissions = [];
							  for (var int = 0; int < allModules.length; int++) {
								  var model = allModules[int];
								  var modelArr = [];
								for (var int2 = 0; int2 < allPermissions.length; int2++) {
									var modelPermission = allPermissions[int2];
									if (model.ModuleID == modelPermission.moduleId) {
										var isPermissionIDExists = false;
										var isDisabled = false;
										if($scope.userPermission.permissions !== undefined){
											for (var int3 = 0; int3 < $scope.userPermission.permissions.length; int3++) {
												var permisionSchem = $scope.userPermission.permissions[int3];
												if(permisionSchem.PermissionID === modelPermission.PermissionID) {
													isPermissionIDExists = true;
													isDisabled = true;
													break;
												}
											}
										}
										if ($scope.userPermission.customPermissions !== undefined) {
											for (var int3 = 0; (int3 < $scope.userPermission.customPermissions.length) && (isPermissionIDExists == false); int3++) {
												var permisionSchem = $scope.userPermission.customPermissions[int3];
												if(permisionSchem.PermissionID === modelPermission.PermissionID) {
													isPermissionIDExists = true;
													isDisabled = false;
													break;
												}
											}
										}

										modelPermission.isClicked = isPermissionIDExists;
										modelPermission.isDisabled = isDisabled;
										modelArr.push(modelPermission);
									}
								}
								 model.permissions =  modelArr;
								 $scope.modulePermissions.push(model);
							}
  
						  }else {
							$scope.getAllModules();
						  }
						}, function ( response ) {
						   // TODO: handle the error somehow
							$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    	 });
						    });
				  //--get all permissions
				  
			  } else if (resultObj.msg.message == "INVALID_TOKEN"){
				  $rootScope.loading = true;
				  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
					  $rootScope.loading = false;
						var resultObj = result.data;
						  if(resultObj.msg.status == "SUCCESS"){
							  $rootScope.userInfo.token = resultObj.token;
							  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
							  $scope.getAllModules();
						  }
						  else {
							  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
							    	swal(alert);
							  });
						  }
						}, function ( response ) {
								$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    });
						   });
			  }
			  else {
				  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
				    	swal(alert);
				  });
			  }
			  
			}, function ( response ) {
			   // TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
				    	swal(alert);
				    	 });
			      });
	};
	//--get all modules 
	
	
	//get all permissions by permission scheme id
	$scope.getAllPermissionsByPermissionSchemeId=function() {
		$rootScope.loading = true;
		userservice.getAllPermissionsByPermissionSchemeId($rootScope.userInfo.userId,$rootScope.userInfo.token,$scope.selectedUserGroup.PermissionSchemeID).then(function (result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			  
			  if(resultObj.msg.status == "SUCCESS"){
				  $scope.userPermission.permissions = resultObj.permissions;
				  $scope.userPermission.customPermissions = [];
				  $scope.getAllModules();
			  } else if (resultObj.msg.message == "INVALID_TOKEN"){
				  $rootScope.loading = true;
				  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
					  $rootScope.loading = false;
						var resultObj = result.data;
						  if(resultObj.msg.status == "SUCCESS"){
							  $rootScope.userInfo.token = resultObj.token;
							  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
							  $scope.getAllPermissionsByPermissionSchemeId();
						  }
						  else {
							  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
							    	swal(alert);
							  });
						  }
						}, function ( response ) {
								$rootScope.loading = false;
								$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
							    	swal(alert);
							    	 });
						      });
			  }
			  else {
				  $translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
				    	swal(alert);
				  });
			  }
			  
			}, function ( response ) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
				    	swal(alert);
				    	 });
			      });
		};
	//--get all permissions by permission scheme id
		
	
		$scope.selectSaveUser = function() {
			
			$scope.saveUser = function() {
				$scope.addUser.GroupID = $scope.addUser.GroupID != undefined ? $scope.addUser.GroupID : $scope.selectedUserGroup.GroupID;
				var saveUserPermision = [];
				for (var int = 0; int < $scope.modulePermissions.length; int++) {
					for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
						var permision = $scope.modulePermissions[int].permissions[int2];
						if (permision.isDisabled === false && permision.isClicked === true) {
							saveUserPermision.push(permision);
						}
					}
				}
				
				$rootScope.loading = true;
				userservice.saveUser($rootScope.userInfo.userId, $scope.addUser, $rootScope.userInfo.token, saveUserPermision).then(function (result) {
					$rootScope.loading = false;
    				var resultObj = result.data;
    				  if(resultObj.msg.message == "USER_SAVE_SUCCESS"){
    					  //swal(resultObj.msg.msgDesc);
    					  $state.go('userlist');
    					  
    				  } else if (resultObj.msg.message == "INVALID_TOKEN"){
    					  $rootScope.loading = true;
    					  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
    						  $rootScope.loading = false;
    							var resultObj = result.data;
    							  if(resultObj.msg.status == "SUCCESS"){
    								  $rootScope.userInfo.token = resultObj.token;
    								  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
    								  $scope.saveUser();
    							  }
    							  else {
    								  $translate('ERROR_MESSAGES.NO_DATA_SAVED').then(function (alert) {
    								    	swal(alert);
    								  });
    							  }
    							}, function ( response ) {
    									$rootScope.loading = false;
    									$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
    								    	swal(alert);
    								    	 });
    							      });
    				  } else if (resultObj.msg.message == "NAME_EXISTS"){
    					  $translate('ERROR_MESSAGES.USER_NAME_EXISTS').then(function (alert) {
  					    	swal(alert);
  					    });
    				  } else {
    					  $translate('ERROR_MESSAGES.NO_DATA_SAVED').then(function (alert) {
  					    	swal(alert);
    					  });
    				  }
    				  
    				}, function ( response ) {
    				   // TODO: handle the error somehow
    						$rootScope.loading = false;
    						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
    					    	swal(alert);
    					    });
    				   });
    		};
		
    		$scope.saveUser();
		};
	
		$scope.deleteUser = function() {
			$scope.deleteUserByUserId = function() {
				$rootScope.loading = true;
    			userservice.deleteUserByUserId($rootScope.userInfo.userId, $scope.addUser.UserID, $rootScope.userInfo.token).then(function (result) {
    				$rootScope.loading = false;
    				var resultObj = result.data;
    				  
    				  if(resultObj.msg.message == "USER_DELETE_SUCCESS"){
    					  //swal(resultObj.msg.msgDesc);
    					  $state.go('userlist');
    				  } else if (resultObj.msg.message == "INVALID_TOKEN"){
    					  $rootScope.loading = true;
    					  userservice.userLogin($rootScope.userInfo.username,$rootScope.userInfo.password).then(function (result) {
    						  $rootScope.loading = false;
    							var resultObj = result.data;
    							  if(resultObj.msg.status == "SUCCESS"){
    								  $rootScope.userInfo.token = resultObj.token;
    								  window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
    								  $scope.deleteUserByUserId();
    							  }
    							  else {
    								  $translate('ERROR_MESSAGES.NO_DATA_DELETED').then(function (alert) {
    			  					    	swal(alert);
    								  });
    							  }
    							}, function ( response ) {
    									$rootScope.loading = false;
    									$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
    								    	swal(alert);
    								    });
    							   });
    				  } else if (resultObj.msg.message == "USER_ADMIN_CANNOT_DELETE"){
    					  $translate('ERROR_MESSAGES.USER_ADMIN_CANNOT_DELETE').then(function (alert) {
	  					    	swal(alert);
						  });
    				  } else {
    					  $translate('ERROR_MESSAGES.NO_DATA_DELETED').then(function (alert) {
	  					    	swal(alert);
						  });
    				  }
    				  
    				}, function ( response ) {
    						$rootScope.loading = false;
    						$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function (alert) {
    					    	swal(alert);
    					    });
    				      });
    		};
    		
    		
    		swal({   
    			title: "Confirm Delete",   
    			text: "Are you sure you want to delete?",   
//    			type: "warning",   
    			showCancelButton: true,   
    			confirmButtonColor: "#DD6B55",   
    			confirmButtonText: "Yes",
    			cancelButtonText: "No"
    			}, 
    			function(){   
    				$scope.deleteUserByUserId();
    				}
    			);
		};
		
		$scope.onClickToolbar = function(){
			 jQuery('#userDetailToolBarDiv').toggleClass('active-share-bottom'); 
		     jQuery.modal.close();
		};
		
		$scope.logout = function(){
			utilService.logout();
		};
		
		$scope.changeLocaleTo = function(locale){
			utilService.changeLocaleTo(locale);
		};
}]);

mapModule.controller('AddGroupCtrl', [ '$scope', 'userservice', '$rootScope', '$stateParams', function($scope, userservice, $rootScope, $stateParams) {
	$scope.addUser = $stateParams.userObj;
	console.log($scope.userObj);
}]);




mapModule.controller('AddUserCtrl', [ '$scope', 'userservice', '$rootScope', '$stateParams', function($scope, userservice, $rootScope, $stateParams) {
	$scope.user = {
		GroupChanged : false,
		GroupID : 1,
		Active : false
	};
	
	$scope.permissionScheme = {};
	$scope.modulePermissions = [];

	$scope.getAllGroupUsers = function() {
		$rootScope.loading = true;
		userservice.getAllGroupUsers().then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				$scope.user.groups = resultObj.groups;
				if ($scope.user.groups.length > 0) {
					$scope.user.group = $scope.user.groups[0];
				}
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.getAllGroupUsers();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
						});
					}
				}, function(response) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
				});
			}

		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};

	// get all modules
	$scope.getAllModules = function() {
		$rootScope.loading = true;
		userservice.getAllModules($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				var allModules = resultObj.allModules;
				// get all permissions
				$rootScope.loading = true;
				userservice.getAllPermissions($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						var allPermissions = resultObj.allpermissions;
						for (var int = 0; int < allModules.length; int++) {
							var model = allModules[int];
							var modelArr = [];
							for (var int2 = 0; int2 < allPermissions.length; int2++) {
								var modelPermission = allPermissions[int2];
								if (model.ModuleID == modelPermission.moduleId) {
									var isPermissionIDExists = false;
									if ($scope.permissionScheme.permissions !== undefined) {
										for (var int3 = 0; int3 < $scope.permissionScheme.permissions.length; int3++) {
											var permisionSchem = $scope.permissionScheme.permissions[int3];
											if (permisionSchem.PermissionID === modelPermission.PermissionID) {
												isPermissionIDExists = true;
												break;
											}
										}
									}
									modelPermission.isClicked = isPermissionIDExists;
									modelArr.push(modelPermission);
								}
							}
							model.permissions = modelArr;
							$scope.modulePermissions.push(model);
							console.log($scope.modulePermissions);
						}
					} else {
						getAllModules();
					}
				}, function(response) {
					// TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$scope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.getAllModules();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
						});
					}
				}, function(response) {
					// TODO: handle the error somehow
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
				});
			}

		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};
	
	$scope.selectAllPermissionSchemes = function(value) {
		for (var int = 0; int < $scope.modulePermissions.length; int++) {
			for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
				$scope.modulePermissions[int].permissions[int2].isClicked=value;
			}
		}
	};
	
	$scope.selectAllmodulePermissionSchemes = function(value,moduleID) {
		for (var int = 0; int < $scope.modulePermissions.length; int++) {
			if($scope.modulePermissions[int].ModuleID === moduleID){
				for (var int2 = 0; int2 < $scope.modulePermissions[int].permissions.length; int2++) {
					$scope.modulePermissions[int].permissions[int2].isClicked=value;
				}
				break;
			}
		}
	};

	$scope.getAllModules();
	$scope.getAllGroupUsers();

} ]);

mapModule.controller('PermissionListCtrl', [ '$scope', 'utilService', 'userservice', '$rootScope', '$translate', function($scope, utilService, userservice, $rootScope, $translate) {
	$scope.permissionSchemes = null;
	$scope.init = function() {
		$rootScope.loading = true;
		userservice.getAllPermissionSchemes($rootScope.userInfo.userId, $rootScope.userInfo.token).then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				$scope.permissionSchemes = resultObj.allpermissionSchemes;
				console.log($scope.permissionSchemes);
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.init();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
						});
					}
				}, function(response) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
				});
			}
		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};
	$scope.init();
	
	$scope.onClickToolbar = function(){
		 jQuery('#permissionToolBarDiv').toggleClass('active-share-bottom'); 
	     jQuery.modal.close();
	};
	
	$scope.logout = function(){
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
	};
} ]);

mapModule.controller('UserGroupListCtrl', [ '$scope', 'utilService', 'userservice', '$rootScope', '$translate', function($scope, utilService, userservice, $rootScope, $translate) {
	$scope.userGroupList = null;
	$scope.permissionList = null;
	$scope.init = function() {
		$rootScope.loading = true;
		userservice.getAllGroupUsers().then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				$scope.userGroupList = resultObj.groups;
				// $scope.getPermisionListBySchemeId($scope.userGroupList.PermissionSchemeID);
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.init();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
						});
					}
				}, function(response) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
				});
			}

		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};
	$scope.init();
	
	$scope.onClickToolbar = function(){
		 jQuery('#userGroupToolBarDiv').toggleClass('active-share-bottom'); 
	     jQuery.modal.close();
	};
	
	$scope.logout = function(){
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
	};
} ]);

mapModule.controller('UserListCtrl', [ '$scope', 'utilService', 'userservice', '$rootScope', '$translate', '$state', function($scope, utilService, userservice, $rootScope, $translate, $state) {
	$scope.user = {};

	$scope.getUsersByUsergroup = function() {
		$rootScope.loading = true;
		userservice.getUsersByUsergroup($rootScope.userInfo.userId, $scope.user.group.GroupID, $rootScope.userInfo.token).then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				$scope.usersbyGroupId = resultObj.users;
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.getUsersByUsergroup();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
						});
					}
				}, function(response) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
				});
			}
		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};

	$scope.getAllGroupUsers = function() {
		$rootScope.loading = true;
		userservice.getAllGroupUsers().then(function(result) {
			$rootScope.loading = false;
			var resultObj = result.data;
			if (resultObj.msg.status == "SUCCESS") {
				$scope.user.groups = resultObj.groups;
				if ($scope.user.groups.length > 0) {
					$scope.user.group = $scope.user.groups[0];
					$scope.getUsersByUsergroup();
				}
			} else if (resultObj.msg.message == "INVALID_TOKEN") {
				$rootScope.loading = true;
				userservice.userLogin($rootScope.userInfo.username, $rootScope.userInfo.password).then(function(result) {
					$rootScope.loading = false;
					var resultObj = result.data;
					if (resultObj.msg.status == "SUCCESS") {
						$rootScope.userInfo.token = resultObj.token;
						window.localStorage.setItem("USER_PROFILE", JSON.stringify($rootScope.userInfo));
						$scope.getAllGroupUsers();
					} else {
						$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
					    	swal(alert);
						});
					}
				}, function(response) {
					$rootScope.loading = false;
					$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
						swal(alert);
					});
				});
			} else {
				$translate('ERROR_MESSAGES.NO_DATA_FOUND').then(function (alert) {
			    	swal(alert);
				});
			}

		}, function(response) {
			$rootScope.loading = false;
			$translate('ALERT_MESSAGES.OPERATION_FAILED').then(function(alert) {
				swal(alert);
			});
		});
	};

	$scope.changeUUserGroup = function() {
		$scope.searchUsrGrp = "";
		$scope.getUsersByUsergroup();
	};

	$scope.getAllGroupUsers();
	
	$scope.onClickToolbar = function(){
		 jQuery('#userToolBarDiv').toggleClass('active-share-bottom'); 
	     jQuery.modal.close();
	};
	
	$scope.logout = function(){
		utilService.logout();
	};
	
	$scope.changeLocaleTo = function(locale){
		utilService.changeLocaleTo(locale);
	};
} ]);