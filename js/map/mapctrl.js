mapModule.controller('MapCtrl', [
		'$scope',
		'$rootScope',
		'mapservice',
		'bookmarkservice',
		'userservice',
		'$filter',
		'$stateParams',
		'$state',
		'$window',
		'$translate',
		'$timeout',
		'utilService',
		function($scope, $rootScope, mapservice, bookmarkservice, userservice, $filter, $stateParams, $state, $window, $translate,$timeout, utilService) {
			
			$scope.init = function () {
					$rootScope.mapID = null;
					$scope.VisibleLayerAfterReOrder = [];
					$rootScope.layercontrol = null;
					$scope.isScaleShow = true;
					$rootScope.loadingComplete = false;
					$scope.mapBookmarkRightSideBarDisplayView = "NONE";
					$rootScope.boolLeftDivState = "layers";
					$scope.selectedMonthLocal;
					$scope.selectedYearLocal;
					$scope.simplesearchval;
					$scope.locationMarker = null;
					$scope.isGoogleTafficLayerEnabled = null;
					$scope.googleTrafficLayer = null;
					$scope.isEnablePoiLayerAsOverlay = false;
					$scope.hasGoogleHybridLayer = false;

					$rootScope.mapID = $stateParams.mapid;

					$scope.updateUI($rootScope.language);

					$state.go('map.layers');

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
			};
			
			$scope.$on('$viewContentLoaded', function(event) {
				
			});

		    $scope.onToggleTrafficLayer = function (isGoogleTafficLayerEnabled) {
				$scope.isGoogleTafficLayerEnabled = isGoogleTafficLayerEnabled;
				if (isGoogleTafficLayerEnabled) {
					/*if ($scope.googleTrafficLayer == null)
						$scope.googleTrafficLayer = new google.maps.TrafficLayer();
					$scope.googleTrafficLayer.setMap($scope.googleMap._google);*/
					if ($scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer)
						$scope.googleMapPoi.addGoogleLayer('TrafficLayer');
					else
						$scope.googleMap.addGoogleLayer('TrafficLayer');
				}
				else {
					/*if ($scope.googleTrafficLayer != null)
						$scope.googleTrafficLayer.setMap(null);*/
					if ($scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer) 
						$scope.googleMapPoi.removeGoogleLayer('TrafficLayer');
					else
						$scope.googleMap.removeGoogleLayer('TrafficLayer');
				}
			};

			jQuery('#toolBarDiv').click(function() { 
				jQuery('#toolBarDiv').removeClass('active-share-bottom');
			});

			$rootScope.snapper = new Snap({
				element : document.getElementById('content'),
				elementMirror : document.getElementById('header-fixed'),
				elementMirror2 : document.getElementById('footer-fixed'),
				disable : 'none',
				tapToClose : true,
				touchToDrag : true,
				maxPosition : 266,
				minPosition : -266
			});
			
			$scope.onClickStatChangeCustom= function(value){
				$rootScope.boolLeftDivState = value;
			};
			 
			$scope.findCurrentLocation = function(){
				navigator.geolocation.getCurrentPosition(function(position) {
					if($scope.locationMarker != null) {
                        $rootScope.mapObj.removeLayer($scope.locationMarker);
                    }
					var userLocationIcon = L.icon({ iconUrl: 'images/userlocation.png', iconSize: [38, 52] });
	                $scope.locationMarker = L.marker([position.coords.latitude, position.coords.longitude],{icon: userLocationIcon}).addTo($rootScope.mapObj).bindPopup("User Location");
					$rootScope.mapObj.setView([position.coords.latitude, position.coords.longitude], 16);
				}, function(error){
					switch(error.code)
		            {
		                case error.PERMISSION_DENIED: 
		                break;
		 
		                case error.POSITION_UNAVAILABLE: 
		                break;
		 
		                case error.TIMEOUT: 
		                break;
		 
		                default: 
		                break;
		            }
				}, { enableHighAccuracy: true });
			}
			
			$scope.goToUser = function() {
				$window.location.href = "index.html";
			}
			
			$rootScope.$watch('selectedYear', function() {
			    $scope.selectedYearLocal = $rootScope.selectedYear;
			});
			
			$scope.onYearChanged = function(){
				$rootScope.$emit('yearChangedOnMainSlider',  $scope.selectedYearLocal);
			}

			$scope.$on('updateLayerListEvent', function(event, args) {
				$rootScope.toc_layers = [];
				$rootScope.toc_map = null;
				if($rootScope.mapObj) {
					$rootScope.mapObj.remove();
				}
				$rootScope.mapObj = null;
				$rootScope.loading = true;
				try {
					mapservice.getMapLayersByMapID(args, $rootScope.userInfo.token).then(function(result) {
						$rootScope.loading = false;
						$rootScope.toc_map = result.data.mainMap.Data.map;
						$rootScope.toc_layers = result.data.mainMap.Data.layer;
						if (result.data.overViewMap != null) {
							$scope.toc_overviewMap = result.data.overViewMap.Data.map;
							$scope.toc_overviewLayers = result.data.overViewMap.Data.layer;
						}
						 //Added for google POI layer 
			            if ($rootScope.toc_layers != null && $rootScope.toc_layers.length > 0) {
			                var hybridGoogleLayer = $filter('filter')($rootScope.toc_layers, { GoogleLayerType: 'HYBRID' })[0];
			                if (hybridGoogleLayer) {
			                    console.log("------------------------- Hybrid layer found --------------------------------------------------");
			                    $scope.hasGoogleHybridLayer = true;
			                    if (hybridGoogleLayer.EnablePoiLayerAsOverlay == "1") {
			                        $scope.isEnablePoiLayerAsOverlay = true;
			                        console.log("------------------------- GOOGLE Poi enabled -------------------------------------------------");
			                    }
			                }
			            }
						$scope.showLayersOnMap();
						$rootScope.loading = false;
					}, function(response) {
						$rootScope.loading = false;
					});
				} catch (e) {
					$rootScope.loading = false;
				}

			});

			$rootScope.onClickMenu = function() {
				if ($rootScope.language == "en-US") {
					if ($rootScope.snapper.state().state == "left") {
						$rootScope.snapper.close();
					} else {
						$rootScope.snapper.open('left');
					}
				} else {
					if ($rootScope.snapper.state().state == "right") {
						$rootScope.snapper.close();
					} else {
						$rootScope.snapper.open('right');
					}
				}
				
				
				jQuery('#toolBarDiv').removeClass('active-share-bottom');
			}

			$scope.showLayersOnMap = function() {
				//disable leaflet hyper link
				if (typeof $rootScope.mapObj !== 'undefined' && $rootScope.mapObj != null) {
					$.each($rootScope.L_layers, function(index, value) {
						$rootScope.mapObj.removeLayer(value);
					});
				}
				var resolutions = [];
				$rootScope.L_layers = [];
				var origin = null;

				var hasTiledBaseLayer = false;
				var firstTileLayerMinZoom = 0;
				var firstTileLayerMaxZoom = null;
				var crs = null

				if ($scope.toc_layers != null && $scope.toc_layers.length > 0) {

					var arr_VisibleLayer = [];
					$.each($scope.toc_layers, function(index, value) {
						var tempFilter = $filter('filter')($scope.VisibleLayerAfterReOrder, {
							LayerID : value.LayerID
						});
						if (tempFilter != null && tempFilter.length == 1) {
							value.visible = tempFilter[0].visible;
							value.Opacity = tempFilter[0].Opacity;
						}
						if (value.visible) {
							arr_VisibleLayer.push(value);
						}
					});

					if ($scope.VisibleLayerAfterReOrder != null && $scope.VisibleLayerAfterReOrder.length > 0) {
						$scope.VisibleLayerAfterReOrder = [];
					}

					var object = $rootScope.create_L_layers($scope.toc_layers, $scope.L_layers, $scope.toc_map, false);
					hasTiledBaseLayer = object.hasTiledBaseLayer;
					resolutions = object.resolutions;
					firstTileLayerMinZoom = object.firstTileLayerMinZoom;
					firstTileLayerMaxZoom = object.firstTileLayerMaxZoom;
					origin = object.origin;
					crs = object.crs;
					mapOptions = object.mapOptions;
					//mapOptions.crs=crs;

					if ($rootScope.mapObj == null) {
						var baseLayerBounds = null;
						var initialMapPos = [26.1752, 43.1982];
						if ($scope.toc_layers.length != 0) {
							baseLayerBounds = $scope.getBaseLayerBounds();
						}
						if (baseLayerBounds != null)
		                {
		                    var center = baseLayerBounds.getCenter();
		                    if (center.lat >= -90 && center.lat <= 90 && center.lng >= -180 && center.lng <= 180)
		                        initialMapPos = center;
		                }

						//$rootScope.mapObj = L.map('map-canvas', mapOptions).setView(initialMapPos, resolutions.length - 3);
						$rootScope.mapObj = L.map('map-canvas', mapOptions).setView(initialMapPos, 12);

						// Hack for map freezing issue on android devices for
						// google map
						$rootScope.mapObj.on('zoomanim', $scope.debounce($rootScope.mapObj._onZoomTransitionEnd, 250));

						$('.leaflet-control-attribution').hide();
						$('a[href$="http://leafletjs.com"]').removeAttr("href");

						if ($rootScope.language == "en-US") {
							L.control.zoom({
								position : 'topright'
							}).addTo($rootScope.mapObj);
							L.control.scale({
								position : 'bottomleft',
								metric : true
							}).addTo($rootScope.mapObj);
						} else {
							L.control.zoom({
								position : 'topleft'
							}).addTo($rootScope.mapObj);
							L.control.scale({
								position : 'bottomleft',
								metric : true
							}).addTo($rootScope.mapObj);
						}

						try{
							if ($scope.prevExtent != null) {
								$rootScope.mapObj.fitBounds($scope.prevExtent);
							} else {
								if (baseLayerBounds != null)
									$rootScope.mapObj.fitBounds(baseLayerBounds);
							}
						}
						catch(ex)
						{
							 console.log(ex.message);
						}
					

						for (var k = 0; k < $scope.L_layers.length; k++) {
							var L_Layer = $scope.L_layers[k];
							if (typeof $scope.L_layers[k].options.minscale !== 'undefined' && $scope.L_layers[k].options.minscale != 0)
								$scope.L_layers[k].options.minZoom = $scope.getZoomFromScale($scope.L_layers[k].options.minscale);
							if (typeof $scope.L_layers[k].options.maxscale !== 'undefined')
								$scope.L_layers[k].options.maxZoom = $scope.getZoomFromScale($scope.L_layers[k].options.maxscale);
						}

						$scope.drawnItems = new L.FeatureGroup();
						$scope.drawControl = new L.Control.Draw({
							draw : false,
							edit : {
								featureGroup : $scope.drawnItems,
								edit : false,
								remove : false
							}
						});
						$rootScope.mapObj.addControl($scope.drawControl);

						// $scope.bookMarkLayerGroup = new L.featureGroup();
						// $scope.mapLabelLayerGroup = new L.featureGroup();
						// $scope.mapLabelMakerGroup = new L.featureGroup();
						// $scope.searchMarkersLayerGroup = new
						// L.featureGroup();

						// var scopeMapLabel =
						// angular.element($("#dlg_addMapLabel")).scope();
						// scopeMapLabel.initializeDrawComponent();

						$rootScope.mapObj.on('move', function(e) {
							jQuery('#toolBarDiv').removeClass('active-share-bottom');
							
							//$("#divGooglePoi").css("opacity", "0");
							$scope.prevExtent = $rootScope.mapObj.getBounds();
							$scope.showScale();
							if($("body").hasClass("snapjs-left")){
								//$rootScope.onClickLeftMenu();
							}
							/*if ($scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer) {
		                        $(".leaflet-popup-pane").css("transform", $(".leaflet-map-pane").css("transform"));
		                    }*/
						});

						$rootScope.mapObj.on('click', function(e) {
							// $scope.identifyLayers(e);
							//if($("body").hasClass("snapjs-left"))
							//	$rootScope.onClickLeftMenu();
						});

						$rootScope.mapObj.on('mousedown', function(e) {
							// $scope.identifyLayers(e);
							//if($("body").hasClass("snapjs-left"))
							//	$rootScope.onClickLeftMenu();
						});
						
						$rootScope.mapObj.on('moveend', function(e) {
							// $scope.identifyLayers(e);
							//if($("body").hasClass("snapjs-left"))
							//	$rootScope.onClickLeftMenu();
							/*
							//not required for leafletv2
							$scope.removeGoogleTiles();
							*/
						});
						
						
						$rootScope.mapObj.on('zoomend', function(e) {
							// if ($scope.mapLabelSelected.length > 0) {
							// $rootScope.$broadcast('updateMapLabelZoomLevel');
							// }
							$scope.showScale();
							/*
							//not required for leafletv2
							if ($scope.hasGoogleBasemap) {
								$(".leaflet-tile-pane").show();
							}*/
						});
						
						$rootScope.mapObj.on('zoomstart', function(e) {
							/*
							//not required for leafletv2
							if ($scope.hasGoogleBasemap) {
								$(".leaflet-tile-pane").hide();
							}*/
						});
						
						$rootScope.mapObj.on('dragstart', function(e) {
							if($("body").hasClass("snapjs-left"))
								$rootScope.onClickMenu();
						});

						$rootScope.mapObj.on('mousemove', function(e) {
							$scope.showScale();
							if (!$scope.disableMousemoveEvent) {
								$scope.currentMousePos = e;
							}
						});

						$rootScope.mapObj.on('popupopen', function(e) {
							//$("#maplabelinfowindow_tab").responsiveSlider();
						});

						$rootScope.mapObj.on('draw:created', function(e) {
							var rectLayer = e.layer;
							var type = e.layerType, layer = e.layer;
							layer.options.name = "gistool";
							layer.options.geomType = type;
							var tempData = rectLayer.toGeoJSON().geometry.coordinates;
							var layerTYpeName = layer.options.geomType;
							map.fitBounds(rectLayer.getBounds());
							layer.editing.enable();
							$scope.drawnItems.addLayer(layer);

							var boundary = rectLayer.getBounds();
							var setExtent = boundary.getSouth() + ',' + boundary.getWest() + ',' + boundary.getNorth() + ',' + boundary.getEast();
							$scope.setGeofence = setExtent;
						});

						$rootScope.mapObj.on('draw:edited', function(e) {
							var layers = e.layers;
							layers.eachLayer(function(layer) {
							});
						});

						/*
						L.control.coordinates({
							position : "bottomright",
							decimals : 4,
							decimalSeperator : ",",
							labelTemplateLat : "Lat: {y}",
							labelTemplateLng : "Lon: {x}"
						}).addTo($rootScope.mapObj);*/

						$('#map-canvas').contextmenu({
							target : '#map-context-menu',
							onItem : function(context, e) {
								$scope.disableMousemoveEvent = false;
								if (e.target.id == 'linkIdentify')
									$scope.identify($scope.currentMousePos);
								else if (e.target.id == 'linkExportPng')
									$scope.exportMapAsPng();
							}
						});

						/*
						//Not required for leafletv2
						if ($scope.hasGoogleBasemap) {
							$scope.googleMap = new L.Google($scope.GoogleBaseMapType, null, 'divGoogleBaseLayer');
							$rootScope.mapObj.addLayer($scope.googleMap);
		                    $scope.hasGoogleBasemap = true;
		                    if ($scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer) {
		                        $(".leaflet-popup-pane").appendTo("#map-canvas");
		                        $(".leaflet-control-container").css("z-index","9999999");
		                        $(".leaflet-control-container").css("height","100%");
		                    }
		                    google.maps.event.addListener($scope.googleMap._google, 'tilesloaded', function () {
                                    $scope.removeGoogleTiles();
                            });
						}*/
						
						  document.body.addEventListener('touchstart', function(e){
							    if(e.target.className.indexOf("snap-drawer")>=0)
							    {
									if($("body").hasClass("snapjs-left"))
										$rootScope.onClickMenu();
							    }
						
						    }, false)

						    $("body").removeClass("snapjs-left");
					} else {
						L.Util.setOptions($rootScope.mapObj, mapOptions);
					}
					if (arr_VisibleLayer.length > 0 || $scope.hasGoogleBasemap) {
						if ($scope.prevExtent != null) {
							$rootScope.mapObj.fitBounds($scope.prevExtent);
						}
					}
					setTimeout(function() {
						$scope.refreshMap();
						setTimeout(function() {
							$scope.refreshMap();
						}, 500);
					}, 500);
				}

			};
			
		    $scope.removeGoogleTiles = function () {
		        $timeout(function () {
		            $scope._removePoiImgs();
		        }, 500);
		    }

		    $scope._removePoiImgs = function () {
		    	 if ($scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer) {
		    		 $("#divGooglePoi img").each(function () {
				            if ($(this).attr('src').indexOf("khm") >= 0 || $(this).attr('src').indexOf("StaticMapService") >= 0) {
				                $(this).hide();
				            }
				        });
				      
				        
				        $("#divGoogleBaseLayer img").each(function () {
				            if ($(this).attr('src').indexOf("maps.googleapis.com") >= 0) {
				                $(this).hide();
				            }
				        });
				        $("#divGooglePoi").css("opacity", "1");
		    	 }
		    }

			$rootScope.create_L_layers = function(arr_VisibleLayer, L_layers, toc_map, isOverviewMap) {
				var resolutions = [];
				var origin = null;

				var hasTiledBaseLayer = false;
				var firstTileLayerMinZoom = 0;
				var firstTileLayerMaxZoom = null;
				for (var i = arr_VisibleLayer.length - 1; i >= 0; i--) {
					var value = arr_VisibleLayer[i];
					var visiblelayer = value;
					if (value.Type === 'ARCGISLAYER') {
						var obj = jQuery.parseJSON(visiblelayer.SpatialReference);
						if (visiblelayer.ArcGisLayerType === "SINGLEFUSEDMAPCACHE") {
							var tmpResolution = [];
							var tileInfo = JSON.parse(visiblelayer.tileInfo);
							$.each(tileInfo.lods, function(index, lod) {
								tmpResolution.push(lod.resolution);
							});
							var resolutionsMatch = true;
							if (resolutions.length != 0) {
								resolutionsMatch = (resolutions.length == tmpResolution.length) && resolutions.every(function(element, index) {
									return element.toFixed(2) === tmpResolution[index].toFixed(2);
								});
							}

							if (resolutions.length == 0 && toc_map.mapProjection.EPSG == visiblelayer.projection.EPSG) {
								$.each(tileInfo.lods, function(index, lod) {
									resolutions.push(lod.resolution);
								});
							}

							if (resolutionsMatch && toc_map.mapProjection.EPSG == visiblelayer.projection.EPSG) {
								if (tileInfo == null) {
									L_layers.push(L.tileLayer.arcGISDynamicLayer(visiblelayer.url, {
										format : 'image/png',
										transparent : true,
										continuousWorld : true,
										layers : visiblelayer.DefaultName,
										label : visiblelayer.DefaultName,
										layerindex : visiblelayer.LayerOrder,
										imageSR : toc_map.mapProjection.EPSG,
										bboxSR : toc_map.mapProjection.EPSG,
										layerid : visiblelayer.LayerID,
										parentID : visiblelayer.parentLayerID,
										checked : true,
										minscale : 9999999999999,
										maxscale : 0,
		                                alwaysOnTop: visiblelayer.AlwaysOnTop
									}));
								} else {

									var maxbounds = null;
									if (visiblelayer.fullextent != null) {
										var fullextent = JSON.parse(visiblelayer.fullextent);
										var toepsg4326 = proj4('EPSG:4326');
										var fromProj4 = proj4(toc_map.mapProjection.PROJ4);
										var southWest = proj4(fromProj4, toepsg4326).forward([Number(fullextent.xmin), Number(fullextent.ymin)]);
										var northEast = proj4(fromProj4, toepsg4326).forward([Number(fullextent.xmax), Number(fullextent.ymax)]);
										maxbounds = L.latLngBounds([southWest[1], southWest[0]], [northEast[1], northEast[0]]);
									}

									var tileWidth = tileInfo.rows;
									var tileHeight = tileInfo.cols;
									origin = [ tileInfo.origin.x, tileInfo.origin.y ];
									firstTileLayerMinZoom = 0
									firstTileLayerMaxZoom = tmpResolution.length - 1;
									var layerTmp = L.esri.tiledMapLayer({
										url : visiblelayer.url,
										tileSize : tileWidth,
										continuousWorld : true,
										layerindex : visiblelayer.LayerOrder,
										label : visiblelayer.DefaultName,
										maxZoom : firstTileLayerMaxZoom,
										minZoom : 0,
										layerid : visiblelayer.LayerID,
										checked : visiblelayer.visible,
										bounds : maxbounds,
										unloadInvisibleTiles : true,
										parentID : visiblelayer.parentLayerID,
										updateWhenIdle : true,
										reuseTiles : true,
										description : visiblelayer.Description,
		                                alwaysOnTop: visiblelayer.AlwaysOnTop
									});
									L_layers.push(layerTmp);
									hasTiledBaseLayer = true;
								}
							} else {
								L_layers.push(L.tileLayer.arcGISDynamicLayer(visiblelayer.url, {

									format : 'image/png',
									transparent : true,
									continuousWorld : true,
									layers : visiblelayer.DefaultName,
									label : visiblelayer.DefaultName,
									layerindex : visiblelayer.LayerOrder,
									imageSR : toc_map.mapProjection.EPSG,
									bboxSR : toc_map.mapProjection.EPSG,
									layerid : visiblelayer.LayerID,
									parentID : visiblelayer.parentLayerID,
									checked : visiblelayer.visible,
									minscale : 9999999999999,
									maxscale : 0,
									description : visiblelayer.Description,
	                                alwaysOnTop: visiblelayer.AlwaysOnTop
								}));
								if (firstTileLayerMaxZoom != null) {
									L.Util.setOptions(L_layers[L_layers.length - 1], {
										maxZoom : firstTileLayerMaxZoom,
										minZoom : 0
									});
								}
							}

						} else if (visiblelayer.ArcGisLayerType === "DYNAMIC") {

							L_layers.push(L.tileLayer.arcGISDynamicLayer(visiblelayer.url, {
								format : 'png',
								transparent : true,
								continuousWorld : true,
								layers : visiblelayer.DefaultName,
								label : visiblelayer.DefaultName,
								layerindex : visiblelayer.LayerOrder,
								imageSR : toc_map.mapProjection.EPSG,
								bboxSR : toc_map.mapProjection.EPSG,
								arcgislayerid : visiblelayer.ArcGisLayerName,
								layerid : visiblelayer.LayerID,
								parentID : visiblelayer.parentLayerID,
								checked: visiblelayer.visible,
								minscale : visiblelayer.MinScale,
								maxscale : visiblelayer.MaxScale,
								description : visiblelayer.Description,
                                alwaysOnTop: visiblelayer.AlwaysOnTop
							}));
							if (firstTileLayerMaxZoom != null) {
								L.Util.setOptions(L_layers[L_layers.length - 1], {
									maxZoom : firstTileLayerMaxZoom,
									minZoom : 0
								});
							}
						}

					} else if ((value.Type === 'WMSLAYER' || value.Type === 'SYSTEMLAYER')) {
						L_layers.push(L.tileLayer.wms(visiblelayer.url, {
							format : 'image/png',
							transparent : true,
							continuousWorld : true,
							layers : visiblelayer.DefaultName,
							label : visiblelayer.DefaultName,
							layerindex : visiblelayer.LayerOrder,
							layerid : visiblelayer.LayerID,
							parentID : visiblelayer.parentLayerID,
							checked: visiblelayer.visible,
							unloadInvisibleTiles : true,
							description : visiblelayer.Description,
							updateWhenIdle : true,
							reuseTiles : false,
							description : visiblelayer.Description,
                            alwaysOnTop: visiblelayer.AlwaysOnTop,
                            mobileBrowser:true
						}));
						if (firstTileLayerMaxZoom != null) {
							L.Util.setOptions(L_layers[L_layers.length - 1], {
								maxZoom : firstTileLayerMaxZoom,
								minZoom : 0
							});
						}
					} else if ((value.Type === 'GOOGLE') /* && value.visible */) {
						if (!isOverviewMap) {
							$scope.GoogleBaseMapType = value.GoogleLayerType;
							$scope.hasGoogleBasemap = true;
							
							$scope.googleMap = L.gridLayer.googleMutant({
								type: $scope.GoogleBaseMapType.toLowerCase(),	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
								checked: visiblelayer.visible,
								layerindex: visiblelayer.LayerOrder,
								layerid: visiblelayer.LayerID,
								label: visiblelayer.DefaultName,
								className: "divGoogleBaseLayer",
								removePois: $scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer?true:false
							});
							//$scope.googleMap.addTo(map);
							$scope.L_layers.push($scope.googleMap);
							if ($scope.googleMapPoi)
								$scope.googleMapPoi.removeGoogleLayer('TrafficLayer');
							if ($scope.isGoogleTafficLayerEnabled && !$scope.isEnablePoiLayerAsOverlay)
								$scope.googleMap.addGoogleLayer('TrafficLayer');
						} else {
							$scope.overviewmapGoogleMapType = value.GoogleLayerType;
						}

					} else if (value.Type === 'WMTSLAYER') {
						// /////////////////////////////////////
						var layerIGNScanStd = "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD";

						// The timeslider_id URL
						// var url =
						// "http://mirage:8082/geoserver/gwc/service/";
						var maxbounds = $scope.getLayerBounds(value);
						var wmtslayer = new L.TileLayer.WMTS(visiblelayer.url, {
							continuousWorld : true,
							minscale : 9999999999999,
							maxscale : 0,
							checked: visiblelayer.visible,
							layer : visiblelayer.DefaultName,
							layerid: visiblelayer.LayerID,
							tilematrixSet : "EPSG:900913",
							format : visiblelayer.Format,
							bounds : maxbounds,
							description : visiblelayer.Description,
							mobileBrowser:true
						});
						L_layers.push(wmtslayer);
						// ////////////////////////////////////
					}

					if (visiblelayer.FeatureType != "GROUPLAYER")
						visiblelayer.L_Layer = L_layers[L_layers.length - 1];
					if (typeof visiblelayer.previousLayerOpacities == 'undefined') {
						visiblelayer.previousLayerOpacities = visiblelayer.Opacity;
					}
					if (visiblelayer.L_Layer != null && visiblelayer.previousLayerOpacities != null) {
						visiblelayer.L_Layer.setOpacity(visiblelayer.previousLayerOpacities / (100.0));
					}

				}

				var crs = null;
				if (resolutions != null & resolutions.length > 0) {
					crs = new L.Proj.CRS('EPSG:' + toc_map.mapProjection.EPSG, toc_map.mapProjection.PROJ4, {
						origin : origin,
						resolutions : resolutions
					});
				} else {
					if (toc_map.mapProjection.EPSG == 4326) {
						resolutions = [ 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4,
								3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765629E-5, 4.29153442382814E-5, 2.14576721191407E-5, 1.07288360595703E-5, 0.536441802978515E-5 ];
					} else {
						resolutions = [ 156543.03392800014, 78271.51696399994, 39135.75848200009, 19567.87924099992, 9783.93962049996, 4891.96981024998, 2445.98490512499, 1222.992452562495,
								611.4962262813797, 305.74811314055756, 152.87405657041106, 76.43702828507324, 38.21851414253662, 19.10925707126831, 9.554628535634155, 4.77731426794937,
								2.388657133974685, 1.1943285668550503, 0.5971642835598172, /* 0.29858214164761665 */];
					}
					crs = new L.Proj.CRS('EPSG:' + toc_map.mapProjection.EPSG, toc_map.mapProjection.PROJ4, {
						resolutions : resolutions
					});
				}
				$scope.mapCrs = crs;
				var userMaxExtent = null;
				if ($scope.toc_map.SetExtent != null) {
					var arrPoints = $scope.toc_map.SetExtent.split(",");
					if (arrPoints.length == 4) {
						try {
							userMaxExtent = L.latLngBounds([ arrPoints[0], arrPoints[1] ], [ arrPoints[2], arrPoints[3] ]);
						} catch (e) {
						}
					}
				}

				var mapOptions = {
					zoomControl : false,
					fullscreenControl : true,
					//crs : crs,
					worldCopyJump : false,
					maxZoom : resolutions.length - 1,
					minZoom : 0,
					markerZoomAnimation : !$scope.hasGoogleBasemap,// Zoomanimation
					// do
					zoomAnimation : !$scope.hasGoogleBasemap,
					maxBounds : userMaxExtent
				};
				
				if (!$scope.hasGoogleBasemap) {
					mapOptions.crs = crs;
				}

				return {
					L_layers : L_layers,
					firstTileLayerMinZoom : firstTileLayerMinZoom,
					firstTileLayerMaxZoom : firstTileLayerMaxZoom,
					hasTiledBaseLayer : hasTiledBaseLayer,
					origin : origin,
					resolutions : resolutions,
					crs : crs,
					mapOptions : mapOptions
				};

			};

			$scope.getMapScale = function() {
				if ($rootScope.toc_map.mapProjection.EPSG != 4326) {
					return (96 * INCHES_PER_UNIT['m'] * $scope.mapCrs.options.resolutions[$rootScope.mapObj.getZoom()]);// res*dpi*inches_per_unit
				} else {
					return (96 * INCHES_PER_UNIT['dd'] * $scope.mapCrs.options.resolutions[$rootScope.mapObj.getZoom()]);// res*dpi*inches_per_unit
				}
			}

			$scope.getBaseLayerBounds = function() {
				for (var i = $rootScope.toc_layers.length - 1; i >= 0; i--) {
					if ($rootScope.toc_layers[i].Type != "GROUPLAYER")
						return $scope.getLayerBounds($rootScope.toc_layers[i]);
				}
			};

			$scope.getLayerBounds = function(layerObject) {
				if (layerObject != null && layerObject.initialextent != null && layerObject.initialextent.trim() != "") {
					var xmin, ymin, xmax, ymax, southWest, northEast;
					var extent = JSON.parse(layerObject.initialextent);
					if (layerObject.Type === "WMSLAYER" || layerObject.Type === "WMTSLAYER" || layerObject.Type === "SYSTEMLAYER") {
						var extentTmp = $filter('filter')(extent, {
							csr : 'CRS:84'
						});
						if (extentTmp != null && extentTmp.length == 0)
							extentTmp = $filter('filter')(extent, {
								csr : 'EPSG:4326'
							});
						if (extentTmp != null && extentTmp.length > 0) {
							extent = extentTmp[0];
							xmin = extent.minx;
							ymin = extent.miny;
							xmax = extent.maxx;
							ymax = extent.maxy;
						}
					} else {
						xmin = Number(extent.xmin);
						ymin = Number(extent.ymin);
						xmax = Number(extent.xmax);
						ymax = Number(extent.ymax);
					}

					if (layerObject.Type === "WMSLAYER" || layerObject.projection.EPSG == 4326 || layerObject.projection.EPSG == 4269 || layerObject.projection.EPSG == 4267) {
						southWest = L.latLng(ymin, xmin), northEast = L.latLng(ymax, xmax);
					} else {
						if (extent != null && (layerObject.projection.EPSG != 4326 && layerObject.projection.EPSG != 4269 && layerObject.projection.EPSG != 4267)) {
							var dest = proj4('EPSG:4326')
							var source = layerObject.projection.PROJ4;
							var bootomLeft = proj4(source, dest, [ xmin, ymin ]);
							var topRight = proj4(source, dest, [ xmax, ymax ]);
							southWest = L.latLng(bootomLeft[1], bootomLeft[0]), northEast = L.latLng(topRight[1], topRight[0]);
						}
					}
					var bounds = L.latLngBounds(southWest, northEast);
					return bounds;
				}
			};

			$scope.debounce = function(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this, args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate)
							func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow)
						func.apply(context, args);
				};
			};

			$scope.getZoomFromScale = function(scale) {
				if (scale == 0)
					return $scope.mapCrs.options.resolutions.length - 1;
				for (var i = 0; i < $scope.mapCrs.options.resolutions.length; i++) {
					var res = $scope.mapCrs.options.resolutions[i];
					var scaleToRes = $scope.getResolution(scale);
					if (scaleToRes >= res) {
						if (i - 1 > 0)
							return i - 1;
						else
							return i;
					}
				}
				return null;
			};

			$scope.getResolution = function(scale) {
				if ($rootScope.toc_map.mapProjection.EPSG != 4326) {
					return scale / (96 * INCHES_PER_UNIT['m']);
				} else {
					return scale / (96 * INCHES_PER_UNIT['dd']);
				}
			};

			$scope.refreshMap = function() {
				var overlays = {};
				var baselayer = {};
				if (typeof $rootScope.mapObj !== 'undefined' && $rootScope.mapObj != null) {
					$.each($rootScope.L_layers, function(index, value) {
						try {
							if ($rootScope.mapObj.hasLayer(value)) {
								$rootScope.mapObj.removeLayer(value);
							}
						} catch (e) {
						}
					});
				}

				
				for (var i = 0; i < $scope.L_layers.length; i++) {
					var options = $scope.L_layers[i].options;
					if (options.checked) {
						$rootScope.mapObj.addLayer($scope.L_layers[i]);
						$rootScope.L_layers[i].setZIndex(i);
					}
				}
				$rootScope.mapObj.setView([26.680703356729556, 43.593591975969105], 6);

				if ($rootScope.layercontrol != null) {
					$rootScope.mapObj.removeControl($rootScope.layercontrol);
				}
				$rootScope.mapObj.invalidateSize();
				$rootScope.$broadcast('MAP_REFRESHED', {
					map : $rootScope.mapObj
				});
				
				if ($scope.isEnablePoiLayerAsOverlay && $scope.hasGoogleHybridLayer) {
					/*
					//Not required for leafletv2
		            $scope.googleMap = new L.Google($scope.GoogleBaseMapType, null, 'divGooglePoi');
		            $rootScope.mapObj.addLayer($scope.googleMap);
		            //TODO: below line in web version is $rootScope.L_layers.length +1. but not working in mobile. .L_layers.length + 2 working in mobile . Need to investigate the caus
		            $("#divGooglePoi").css('z-index', $rootScope.L_layers.length +2);
		            $("#divGooglePoi").css('background-color', 'transparent !important');
					*/
					
					$scope.googleMapPoi = L.gridLayer.googleMutant({
						type: $scope.GoogleBaseMapType.toLowerCase(),
						className:"divGooglePoi",
						// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
						pane: "overlayPane",
						showPoisOnly:true
					});
					$rootScope.mapObj.addLayer($scope.googleMapPoi);
					if ($scope.isGoogleTafficLayerEnabled)
						$scope.googleMapPoi.addGoogleLayer('TrafficLayer');
		        }else{
		        	$("#divGooglePoi").remove();
		        }
				
				$scope.bringForegroundLayersOnTop();
				$(window).trigger('resize');
			};

			$scope.bringForegroundLayersOnTop = function () {
			        for (var i = 0; i < $scope.L_layers.length; i++) {
			            var options = $scope.L_layers[i].options;
			            if (typeof options.alwaysOnTop !== 'undefined' && options.alwaysOnTop != null && options.alwaysOnTop == 'Y') {
			                //overlays[String(i)] = $scope.L_layers[i];
			                var totalTimlineLayers = 0;
			                if (typeof $scope.timelineCtrl !== 'undefined' && $scope.timelineCtrl != null)
			                    totalTimlineLayers = $scope.timelineCtrl.L_layers.length;
			                var zindex = $scope.L_layers.length + totalTimlineLayers + i + 1;
			                $scope.L_layers[i].setZIndex(zindex);
			            }

			        }
			};
			
			$scope.zoomToLatLon = function(){
				var searchText = $("#txtSimpleSearch").val().trim().replace(" ",",").replace(",,",",");
	            if (searchText.indexOf(",") > 1 && searchText.split(",").length==2) {
	                var coord = searchText.trim().split(",");
	                var lat_y = coord[1].trim();
	                var lon_x = coord[0].trim();
	                if ($.isNumeric(lat_y) && $.isNumeric(lon_x) && (lat_y>=-90 && lat_y <=90 ) && ( lon_x>=-180 && lon_x<=180)) {
	                    /*L.marker([lat_y, lon_x]).addTo($rootScope.mapObj)
	                    .bindPopup('<b>Lat(Y):</b>' + lat_y + " <b>Lon(X):</b>" + lon_x)
	                    .openPopup();*/
	                	//L.marker([lat_y, lon_x]).addTo($rootScope.mapObj);
	                    $scope.latlonpopup = L.popup({'maxWidth':250,'closeButton':true})
	                    .setLatLng([lat_y, lon_x])
	                    .setContent('<div style="width:100%;text-align:center;"><b>Lat(Y):</b>' + lat_y + " <b>Lon(X):</b>" + lon_x + "")
	      
	                    .openOn($rootScope.mapObj);
	                    $(".leaflet-popup-close-button").css("z-index","10");
	                    $(".leaflet-popup").css("opacity","0.7");
	                    
	                    setTimeout(function () { $rootScope.mapObj.panTo([lat_y, lon_x]);$rootScope.onClickMenu(); }, 500);
	                }
	            }
                
                var address = searchText.trim().split(",");
                 if(address[0] != undefined && isNaN(address[0])) {
                     var geocoder = new google.maps.Geocoder();
                     geocoder.geocode({'address': searchText}, function(results, status) {
                          if (status === 'OK') {
                              var latLong = results[0].geometry.location;
                              
                              var lat_y = latLong.lat();
                              var lon_x = latLong.lng();
                                      
                              $scope.latlonpopup = L.popup({'maxWidth':250,'closeButton':true})
                              .setLatLng([lat_y, lon_x])
                              .setContent('<div style="width:100%;text-align:center;"><b>Lat(Y):</b>' + lat_y + " <b>Lon(X):</b>" + lon_x + "")
                              .openOn($rootScope.mapObj);
                            
                              $(".leaflet-popup-close-button").css("z-index","10");
                              $(".leaflet-popup").css("opacity","0.7");
                              
                              setTimeout(function () { $rootScope.mapObj.panTo([lat_y, lon_x]);$rootScope.onClickMenu(); }, 500);
                          } else {
							$translate('ERROR_MESSAGES.ENTER_USERNAME_AND_PASSWORD').then(function (alert101) {
								$translate('MAP.OK').then(function (alert102) {
									lnv.alert({
										content: 'Geocode was not successful for the following reason: ' + status,
										alertBtnText: alert102
									});
								});
							});
                          }
                      });
                 }
                
			};
			
			$scope.closePopup=function(){
				$rootScope.mapObj.closePopup();
			};
			
			$scope.showScale = function() {
				$("#divScale").html("<b>" + $filter('translate')("scale") + "</b> 1:" + $scope.getMapScale().toFixed(0));
			};

			$rootScope.zoomToLayerExtent = function(layerObject) {
				var bounds = $scope.getLayerBounds(layerObject);
				$rootScope.mapObj.fitBounds(bounds);
				$rootScope.onClickMenu();
			};

			$scope.openSliderBox = function() {
				jQuery('#toolBarDiv').toggleClass('active-share-bottom');
			};

			$scope.onClickToolbar = function() {
				jQuery('#toolBarDiv').toggleClass('active-share-bottom');
			};

			$scope.closeSliderBox = function() {
				jQuery('.share-bottom').removeClass('active-share-bottom');
				jQuery('#divScale').show();
				jQuery('#liSliderOpen').show();
			};
			
			$scope.openSliderDiv = function() {
				
				jQuery('#timeSilderDiv').addClass('active-share-bottom');
				jQuery('#divScale').hide();
				jQuery('#liSliderOpen').hide();
			};

			$scope.logout = function () {
				window.localStorage.setItem("allowFlag", 1);
				console.log(window.localStorage.getItem("allowFlag"));
				utilService.logout();
			};

			$scope.changeLocaleTo = function(locale) {
				utilService.changeLocaleTo(locale);
				$scope.updateUI(locale);
				$scope.changeDatePickerLang(locale);
			};

			$scope.changeDatePickerLang = function(locale){
				$rootScope.removeCSS("js/scripts/pickadate/compressed/themes/rtl.css");
				// $rootScope.removeJS("js/scripts/pickadate/compressed/translations/ar.js");
				if (locale === "ar-AE") {
					$rootScope.addCSS("js/scripts/pickadate/compressed/themes/rtl.css");
					// $rootScope.addJS("js/scripts/pickadate/compressed/translations/ar.js");
				} else {
					$rootScope.removeCSS("js/scripts/pickadate/compressed/themes/rtl.css");
					// $rootScope.removeJS("js/scripts/pickadate/compressed/translations/ar.js");
				}
			}

			$scope.updateUI = function(locale) {
				$scope.removeCSSStyles();
				if (locale === "ar-AE") {
					$rootScope.addCSS("css/styles/map/map_ar.css");
					$rootScope.removeCSS("css/styles/map/map_en.css");
				} else {
					$rootScope.addCSS("css/styles/map/map_en.css");
					$rootScope.removeCSS("css/styles/map/map_ar.css");
				}
				$rootScope.$broadcast('updateLayerListEvent', $rootScope.mapID);
				$scope.closeSliderBox();
				// $timeout(function() {
					
				// //  $scope.findCurrentLocation();
				// },1000);
			};

			$scope.$on('$destroy', function() { 
				$scope.removeCSSStyles();
			});
		
			$scope.removeCSSStyles = function() {
				$rootScope.removeCSS("css/styles/map/map_en.css");
				$rootScope.removeCSS("css/styles/map/map_ar.css");
			};
			/*Anudeep*/
			
			
}]);

mapModule.directive('tagSlider', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			$timeout(function() {
				$("#range-slider-" + scope.layer.LayerID).ionRangeSlider({
					type : "single",
					min : 1,
					max : 100,
					grid : true,
					grid_margin : true,
					prettify_enabled : true,
					onChange : function(obj) { // callback is called on every
						scope.setLayerOpacity(obj.from, scope.layer);
					}
				});

				var slider = $("#range-slider-" + scope.layer.LayerID).data("ionRangeSlider");
				slider.update({
					from : scope.layer.Opacity,
				});
			}, 0);
		}
	};
});

var mainTimeSliderMap = null;

mapModule.directive('timeSlider', function($rootScope) {
	return {
		restrict : 'AE',
		replace : 'true',
		template : '<input type="text" id="timeslider_id" name="timeslider_id" value="" />',
		link : function(scope, elem, attrs) {

			scope.$on('MAP_REFRESHED', function(event, data) {
				scope.map = data.map;
				var timelinectrl = scope.timelineCtrl;
			});
			
			$rootScope.$on('ON_MONTH_CHANGE_DROPDOW', function(event, data) {
				if(mainTimeSliderMap != null){
					mainTimeSliderMap.data("ionRangeSlider").update({
	                    from:  $rootScope.months.indexOf(data),
	                });
				}
			});

			$rootScope.$on('TIMELINE_MONTHS_LOADED', function(event, data) {
				var monthlabels = [];
				$.each($rootScope.months, function(index, monthnum) {
					monthlabels.push($rootScope.getMonthShortLabel(monthnum));
				});
				if ($rootScope.months != null && $rootScope.months.length > 1) {

					if(mainTimeSliderMap != null) {
						mainTimeSliderMap.data("ionRangeSlider").destroy();
					}
					mainTimeSliderMap = $("#timeslider_id").ionRangeSlider({
						type : "single",
						values : monthlabels,
						grid : true,
						grid_snap : true,
						prettify_enabled : true,
						from : $rootScope.months.indexOf($rootScope.selectedMonth),
						onStart : function(data) {

						},
						onChange : function(data) {
							$rootScope.selectedMonth = $rootScope.months[data.from];
							$rootScope.onMonthChanged($rootScope.selectedMonth);
						}
					});
				} else {
				}
			});
		}
	};
});
