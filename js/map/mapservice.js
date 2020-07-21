mapModule.service('mapservice', [ '$http', '$q', '$rootScope', function($http, $q, $rootScope) {

	var baseUrl = $rootScope.baseUrl;
	// var usrtoken = $rootScope.userInfo.token;
	// Get map list
	this.getMapList = function(token) {
		return $http.get($rootScope.baseUrl + "MapMobile/m_GetMapList", {
			params : {
				'userId': $rootScope.userInfo.userId,
				'token': token,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result.data;
		});
	};

	// Get map's layers
	this.getMapLayersByMapID = function(mapID, token) {
		return $http.get($rootScope.baseUrl + "MapMobile/m_GetMapLayersByMapID", {
			params : {
				MapServiceID : mapID,
				'token': token,
				'userId': $rootScope.userInfo.userId,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	};

	

	this.getBuildingsbyBuildingId = function(token, userID, buildingId, layerName) {
		return $http.post($rootScope.baseUrl + "map/m_getBuildingsbyBuildingId", {
				'UserId': userID,
				'token': token,
				'BuildingId': buildingId,
				'layerName': layerName,
				'timestamp' : new Date().getTime()
			}
		).then(function(result) {
			return result;
		});
	};


	this.getReports = function(layerID, token, userID) {
		return $http.get($rootScope.baseUrl + "map/m_getAllAreasAndPdf", {
			params : {
				layerid : layerID,
				'userId': userID,
				'token': token,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	};

	this.deleteTaskBuildingDocuments = function(token, userID, documentId) {
		return $http.post($rootScope.baseUrl + "map/m_DeleteTask_BuildingDocuments", {
				'UserId': userID,
				'token': token,
				'DocumentId': documentId,
				'timestamp' : new Date().getTime()
			}
		).then(function(result) {
			return result;
		});
	};

	this.getAllTasksWithUsername = function(token, userID) {
		return $http.get($rootScope.baseUrl + "map/m_GetAllTasks_With_UserName", {
			params : {
				'UserId': userID,
				'token': token,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	};

	this.getBuildingsByTaskId = function(token, userID, taskId) {
		return $http.get($rootScope.baseUrl + "map/m_GetBuildingsByTaskId", {
			params : {
				'UserId': userID,
				'token': token,
				'TaskId': taskId,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	};

	this.getAllTAssignedBuildings = function(token, userID, layerID) {
		return $http.get($rootScope.baseUrl + "map/m_getAllTAssignedBuildings", {
			params : {
				'UserId': userID,
				'token': token,
				'LayerId': layerID,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	};

	this.uploadBuildingDocuments = function(token, userID, buildingDocuments, comments) {
		return $http.post($rootScope.baseUrl + "map/m_UploadBuildingDocuments", {
			'UserId': userID,
			'token': token,
			'BuildingDocuments': buildingDocuments,
			"Comment": comments,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	};

	this.getBuildingDocument = function(token, userID, documentID) {
		return $http.post($rootScope.baseUrl + "map/m_getBuildingDocument", {
			'UserId': userID,
			'token': token,
			'DocumentId': documentID,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	};

	this.getGroupUserList = function() {
		return $http.get(getUsersGroupsList_URL, {
			params : {
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	};

	this.deleteMap = function(id) {
		return $http.post(deleteMap_URL, {
			mapID : id,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	};

	this.deleteLayer = function(layerId) {
		return $http.post(deleteLayer_URL, {
			layerId : layerId,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	};

	this.updateLayerAlias = function(layerAlias) {
		return $http.post(updateLayerAlias_URL, {
			layerNameAliasList : layerAlias,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	}

	this.updateLayerProp = function(templayer) {
		var obj = {
			layerNameAliasArabic : templayer.layerNameAliasArabic,
			layerNameAliasEnglish : templayer.layerNameAliasEnglish,
			layerNameAliasArabicID : templayer.layerNameAliasArabicID,
			layerNameAliasEnglishID : templayer.layerNameAliasEnglishID,
			userIds : templayer.userIds,
			defaultAttrArabic : templayer.defaultAttrArabic,
			defaultAttrEnglish : templayer.defaultAttrEnglish,
			Opacity : Number(templayer.Opacity),
			LayerID : templayer.LayerID,
			MapID : templayer.MapID,
			Accessibility : templayer.Accessibility

		};
		return $http.post(updateLayerDetail_URL, {
			layerDetail : obj,
			'foobar' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	}

	this.getLayerAttribute = function(layerID, attributeAdminMode) {
		return $http.get(getLayerAttribute_URL, {
			params : {
				layerID : layerID,
				attributeAdminMode : attributeAdminMode,
				'timestamp' : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getDataBaseConnection = function() {
		// return $http.get(getLayerAttribute_URL, { params: { 'foobar': new
		// Date().getTime() } }).then(function (result) {
		// return result;
		// });
	}

	this.updateMapAlias = function(mapAlias, mapName, mapId, overviewMapID, userAcl, visibility) {
		return $http.post(updateMapAlias_URL, {
			mapAliasList : mapAlias,
			mapName : mapName,
			mapId : mapId,
			overviewMapID : overviewMapID,
			useracl : userAcl,
			visibility : visibility,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	}

	this.updateLayerOrder = function(layerOrderArr) {
		return $http.post(updateLayerOrder_URL, {
			mapLayerMappingList : layerOrderArr,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	}

	this.deleteMapLayerMapping = function(mapId, layerId) {
		return $http.post(deleteMapLayerMapping_URL, {
			mapId : mapId,
			layerId : layerId,
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	}

	this.getProjectionList = function() {
		return $http.post(getProjectionList_URL, {
			'timestamp' : new Date().getTime()
		}).then(function(result) {
			return result;
		});
	}

	this.addGroup = function(mapid, label, layerorder) {
		return $http.post(addLayerGroup_URL, {
			mapid : mapid,
			label : label,
			layerorder : layerorder
		}).then(function(result) {
			return result;
		});
	}

	this.createLayerIndex = function(layerId) {
		return $http.post(createLayerIndex_URL, {
			layerId : layerId
		}).then(function(result) {
			return result;
		});
	}

	this.getSearchSuggestions = function(mapid, searchText) {
		return $http.get(getSearchSuggestionsForMap_URL, {
			params : {
				mapid : mapid,
				searchText : searchText
			}
		}).then(function(result) {
			return result;
		});
	}

	this.findSimpleSearch = function(mapid, searchText, fromIndex, toIndex, returnTotalHits, exactMatch, filterLayers, coordinates) {
		var layerids = new Array();
		for (var i = 0; i < filterLayers.length; i++)
			layerids.push(filterLayers[i].id);
		return $http.get(simplesearch_URL, {
			params : {
				mapid : mapid,
				searchText : searchText,
				fromIndex : fromIndex,
				toIndex : toIndex,
				returnTotalHits : returnTotalHits,
				exactMatch : exactMatch,
				filterLayers : layerids,
				spatialfilterCoordinates : coordinates
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getIndexStatus = function(layerid) {
		return $http.get(getCheckIndexStatus_URL, {
			params : {
				layerId : layerid,
				timestamp : new Date().getTime()
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getLivefeedConfig = function() {
		return $http.get(getLivefeedConfig_URL, {}).then(function(result) {
			return result;
		});
	}

	this.getLatestEvents = function(startTime, endTime) {
		return $http.get(getLivefeedEvents_URL, {
			params : {
				startTime : startTime,
				endTime : endTime
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getLatestResources = function(startTime, endTime) {
		return $http.get(getLivefeedResources_URL, {
			params : {
				startTime : startTime,
				endTime : endTime
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getTimelineLayers = function(token, MapServiceID, year, month,fromDate,toDate) {
		return $http.get($rootScope.baseUrl + "MapMobile/getTimelineLayers", {
			params : {
				'MapServiceID' : MapServiceID,
				'year' : year,
				'month' : month,
				'fromDate':fromDate,
				'toDate':toDate,
				'token': token
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getTimelineYears = function(MapServiceID, token) {
		return $http.get($rootScope.baseUrl + "MapMobile/getTimelineYears", {
			params : {
				'MapServiceID' : MapServiceID,
				'token': token
			}
		}).then(function(result) {
			return result;
		});
	}

	this.getTimelineMonths = function(MapServiceID, year, token) {
		return $http.get($rootScope.baseUrl + "MapMobile/getTimelineMonths", {
			params : {
				'MapServiceID' : MapServiceID,
				'year' : year,
				'token': token
			}
		}).then(function(result) {
			return result;
		});
	}

	this.requestDownloadLayer = function(layerid, boundingboxArray) {
		return $http.get(getDownloadImagery_URL, {
			params : {
				'layerid' : layerid,
				'bounds' : boundingboxArray
			}
		}).then(function(result) {
			return result;
		});
	}
} ]);