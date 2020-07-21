mapModule.controller('TimelineCtrl', [ '$scope', 'mapservice', '$rootScope', function($scope, mapservice, $rootScope) {

	$scope.mapID = null;
	$rootScope.years = [];
	$rootScope.months = [];
	$scope.layers = $scope.L_layers = [];
	$rootScope.selectedYear;
	$rootScope.selectedMonth;
	$scope.selectedMonthLocal;
	$scope.selectedYearLocal;
	$scope.checked = null;
	$scope.opacity = null;
	$scope.map = null;
	$scope.tocctrl = null;
	$scope.extentDownload = null;
	$scope.currentDownloadableLayer = null;
	$scope.DownloadHttpEnabled = false;
	$scope.bShowallTimelineLayers = true;
	$scope.monthNames = [ {
		en : "January",
		ar : "يناير",
		en_short : "Jan"
	}, {
		en : "February",
		ar : "فبراير",
		en_short : "Feb"
	}, {
		en : "March",
		ar : "مارس",
		en_short : "Mar"
	}, {
		en : "April",
		ar : "أبريل",
		en_short : "Apr"
	}, {
		en : "May",
		ar : "مايو",
		en_short : "May"
	}, {
		en : "June",
		ar : "يونية",
		en_short : "Jun"
	}, {
		en : "July",
		ar : "يولية",
		en_short : "Jul"
	}, {
		en : "August",
		ar : "أغسطس",
		en_short : "Aug"
	}, {
		en : "September",
		ar : "سبتمبر",
		en_short : "Sep"
	}, {
		en : "October",
		ar : "أكتوبر",
		en_short : "Oct"
	}, {
		en : "November",
		ar : "نوفمبر",
		en_short : "Nov"
	}, {
		en : "December",
		ar : "ديسمبر",
		en_short : "Dec"
	} ];
	
	$scope.showYearFilter=true;
	$scope.showRangeFilter=false;
	$scope.filtertype = "filteryear";
	$scope.fromDate=moment().format("DD-MM-YYYY");
	$scope.toDate=moment().format("DD-MM-YYYY");
	$scope.ignoreSetEvent=false;
	$scope.busy=false;
	$scope.datePicker=null;
	$scope.type=null;
	
	$scope.onSelectDate= function(type){
		$scope.type=type;
		
		$("#divDateChooserModal").modal();
		var monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونية', 'يولية', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
		var monthsEn_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var monthsAr_short = ['يناير', 'فبراير', 'مارس', 'أبريل', 'قد', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
		var weekdays_en = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var weekdays_ar = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'يوم الجمعة', 'يوم السبت'];
		var weekdaysEnShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var weekdaysArShort = ['شمس', 'الإثنين', 'الثلاثاء', 'تزوج', 'الخميس', 'الجمعة', 'جلسنا'];

		$scope.datePicker=$('.datepicker').pickadate({
			onSet: function(thingSet) {
			    if(typeof thingSet.select!== 'undefined' && !$scope.ignoreSetEvent){
			    	if($scope.type=='from'){
			    		$scope.fromDate=$scope.datePicker.get("select","dd-mm-yyyy");
			    	}
			    	else{
			    		$scope.toDate=$scope.datePicker.get("select","dd-mm-yyyy");
			    	}
			    	$scope.requestForTimelineLayers();
			    	$scope.$apply();
			     }
			},
			onClose:function(){
				 $.modal.close();
			},
			close:'',
			max: true,
			monthsFull: ($rootScope.language == "en-US") ? monthsEn : monthsAr,
			monthsShort: ($rootScope.language == "en-US") ? monthsEn_short : monthsAr_short,
			weekdaysFull: ($rootScope.language == "en-US") ? weekdays_en : weekdays_ar,
			weekdaysShort: ($rootScope.language == "en-US") ? weekdaysEnShort : weekdaysArShort,
			today: ($rootScope.language == "en-US") ? "Today" : "اليوم",
  			clear: ($rootScope.language == "en-US") ? "Clear" : "واضح"
		}).pickadate('picker');

		// $scope.datePicker.set('max', true);

		setTimeout(function(){ 
			if($scope.datePicker) $scope.datePicker.open();
			$scope.ignoreSetEvent=true;
			if($scope.datePicker){
				if(type=='from'){
					$scope.datePicker.set('select', $scope.fromDate,{format:'dd-mm-yyyy'});
				}
				else
				{
					$scope.datePicker.set('select', $scope.toDate,{format:'dd-mm-yyyy'});
				}
			}
			$scope.ignoreSetEvent=false;
		}, 10);
			
	};
	
	 $scope.requestForTimelineLayers = function () {
	        $scope.busy = true;
	        $scope.removeAllLayers();
	        var fromDate, toDate;
	        if ($scope.filtertype != "filteryear") {
	            fromDate = moment($scope.fromDate,'DD-MM-YYYY').toISOString();
	            toDate = moment($scope.toDate,'DD-MM-YYYY').toISOString();
	        }

	        mapservice.getTimelineLayers($rootScope.userInfo.token, $rootScope.mapID, $scope.selectedYearLocal, $scope.selectedMonthLocal, fromDate, toDate).then(function (result) {
	        	$scope.layers = result.data.layers;
				$.each($scope.layers, function(index, layer) {
					layer.checked = true;
				});
				$scope.populateLayers();
				$scope.busy = false;
				if($scope.layers.length > 0) {
					$rootScope.$broadcast("ChangeDetection_LayerUpdated", $scope.layers);
				}
	        });
	    };
	
	$scope.onToggleFilter = function () {
	        if ($scope.filtertype != "filteryear") {
	           	$scope.showRangeFilter=true;
	        }
	        else {
	           	$scope.requestForTimelineLayers();
	        	$scope.showYearFilter=true;
	        }
	}     
	
	$rootScope.$on('yearChangedOnMainSlider', function (event, args) {
		$scope.selectedYearLocal = args;
		$rootScope.onYearChanged();
	});
	
//	$rootScope.$watch('selectedYear', function() {
//	    $scope.selectedYearLocal = $rootScope.selectedYear;
//	});
	 
	$scope.init = function(mapID, lang) {
		$rootScope.timelineCtrl = $scope;
		$rootScope.$on('MAP_REFRESHED', function(event, data) {
			$scope.map = data.map;
			mapservice.getTimelineYears($rootScope.mapID, $rootScope.userInfo.token).then(function(result) {
				$rootScope.years = result.data.years;
				console.log("years: " + $rootScope.years);
				var currentYear = new Date().getFullYear();
				if ($rootScope.years.indexOf(currentYear) >= 0) {
					$rootScope.selectedYear = currentYear;
					$scope.selectedYearLocal = currentYear;
				} else {
					if($rootScope.years.length > 0){
						$rootScope.selectedYear = $rootScope.years[0];
						$scope.selectedYearLocal = $rootScope.years[0];
					}else{
						 $rootScope.selectedYear = null;
						 $scope.selectedYearLocal= null;
					}
				}
				if ($scope.selectedYearLocal != null){
					$rootScope.onYearChanged();
				}
			});

		});

	};
	
	$scope.onYearChanged = function() {
		$rootScope.selectedYear = $scope.selectedYearLocal;
		$rootScope.onYearChanged();
	}

	$rootScope.onYearChanged = function() {
		
		if($scope.selectedYearLocal!=null)
		{
			$scope.busy=true;
			mapservice.getTimelineMonths($rootScope.mapID, $scope.selectedYearLocal, $rootScope.userInfo.token).then(function(result) {
				$rootScope.months = result.data.months;
				// $scope.tocctrl.timelineMonths = $scope.months;
				var currentMonth = new Date().getMonth();
				if ($rootScope.months.indexOf(currentMonth + 1) >= 0) {
					$rootScope.selectedMonth = currentMonth + 1;
					$scope.selectedMonthLocal =  currentMonth + 1;
				} else {
					if($rootScope.months.length > 0){
						$rootScope.selectedMonth = $rootScope.months[$rootScope.months.length-1];
						$scope.selectedMonthLocal =  $rootScope.months[$rootScope.months.length-1];
					}else{
						 $rootScope.selectedMonth = null;
						 $scope.selectedMonthLocal =  null;
					}
					
				}
				$rootScope.$broadcast('TIMELINE_MONTHS_LOADED', {});
				if ($scope.selectedMonthLocal != null) {
					$rootScope.onMonthChanged();
				}
				$scope.busy=false;

			});
		}
		
	};

	$rootScope.onMonthChanged = function(selectedMonth) {
		$scope.busy=true;
		if(selectedMonth != undefined && selectedMonth != null){
			$scope.selectedMonthLocal =selectedMonth;
		}
		
		$scope.removeAllLayers();
		mapservice.getTimelineLayers($rootScope.userInfo.token, $rootScope.mapID, $scope.selectedYearLocal, $scope.selectedMonthLocal).then(function(result) {
			$scope.layers = result.data.layers;
			$.each($scope.layers, function(index, layer) {
				layer.checked = true;
			});
			$scope.populateLayers();
			$scope.busy=false;
			if($scope.layers.length > 0) {
				$rootScope.$broadcast("ChangeDetection_LayerUpdated", $scope.layers);
			}
		});
		
		$rootScope.$broadcast('ON_MONTH_CHANGE_DROPDOW', $scope.selectedMonthLocal);
	};

	$scope.getMonthLabel = function(monthnum) {
		if ($rootScope.language == "en-US") {
			return $scope.monthNames[monthnum - 1].en;
		} else {
			return $scope.monthNames[monthnum - 1].ar;
		}
	};

	$rootScope.getMonthShortLabel = function(monthnum) {
		
		
		 if ($rootScope.language == "en-US") {
	            return $scope.monthNames[monthnum - 1].en_short;
	        }
	        else {
	            return $scope.monthNames[monthnum - 1].ar;
	        }
	};

	$scope.getLayerLabel = function(layer) {
		var label = layer.DefaultName;
		if ($rootScope.language == "en-US") {
			if (layer.layerNameAliasEnglish != null)
				label = layer.layerNameAliasEnglish;
		} else {
			if (layer.layerNameAliasArabic != null)
				label = layer.layerNameAliasArabic;
		}
		if(label.indexOf(":")!=-1)
            return label.substring(label.indexOf(":") + 1);
        else
            return label.replace(":", ": ").replace(".", ". ");
	};

	$scope.toggleLayer = function(layer) {
		if (!layer.checked) {
			try {

				if ($rootScope.mapObj.hasLayer(layer.L_Layer)) {
					$rootScope.mapObj.removeLayer(layer.L_Layer);
				}
			} catch (e) {
			}
		} else {
			var layerorder = $rootScope.L_layers.indexOf(layer.L_layer);
			$.each($rootScope.L_layers, function(index, L_layer) {
				if (index > $rootScope.L_layers.length - 1) {
					try {
						if ($rootScope.mapObj.hasLayer(L_layer))
							$rootScope.mapObj.removeLayer(L_layer);
					} catch (e) {
					}

				}
			});
			$.each($scope.layers, function(index, layer) {
				if (layer.checked) {
					$rootScope.mapObj.addLayer(layer.L_Layer);
				}
			});
		}

		// Change state of showall timeline layers checkbox to true if all are
		// selected
		var totalSelectedLayers = 0;
		$.each($scope.layers, function(index, layer) {
			if (layer.checked)
				totalSelectedLayers += 1;
		});
		if (totalSelectedLayers == $scope.layers.length)
			$scope.bShowallTimelineLayers = true;
		else
			$scope.bShowallTimelineLayers = false;
	};

	$scope.changeOpacity = function(from , layer) {
		layer.L_Layer.setOpacity(from / 100);
	};

	$scope.populateLayers = function() {
		$scope.busy=true;
		$scope.L_layers = [];
		var object = $rootScope.create_L_layers($scope.layers, $scope.L_layers, $rootScope.toc_map, false);
		var i = 0;
		var layerctrl = $rootScope.layercontrol;

		$.each($rootScope.L_layers, function(index, L_layer) {
			L_layer.setZIndex(index);
		})

		$.each($scope.L_layers, function(index, L_layer) {
			$rootScope.mapObj.addLayer(L_layer);
			if (typeof L_layer.options.description !== 'undefined' && L_layer.options.description != null)
				$rootScope.mapObj.attributionControl.addAttribution(L_layer.options.description);
			L_layer.setZIndex($rootScope.L_layers.length + index);
		});
		
		 $.each($rootScope.L_layers, function (index, L_layer) {
	            var options = L_layer.options;
	            if (typeof options.alwaysOnTop !== 'undefined' && options.alwaysOnTop != null && options.alwaysOnTop == 'Y') {
	                L_layer.setZIndex($rootScope.L_layers.length + $scope.L_layers.length + index + 1);
	            }
	         
	        })
	        $("#divGooglePoi").css('z-index', $rootScope.L_layers.length + $scope.L_layers.length + 2);
	        $scope.busy=false;
	};

	$scope.zoomToExtent = function(layer) {
		$rootScope.zoomToLayerExtent(layer);
		// $rootScope.onClickLeftMenu();
	};

	$scope.removeAllLayers = function() {
		$.each($scope.layers, function(index, layer) {
			if (layer.checked)
				try {
					$rootScope.mapObj.removeLayer(layer.L_Layer);
				} catch (e) {
				}
		});
	};

	$scope.showAllTimelinelayers = function() {
		if ($scope.bShowallTimelineLayers) {
			$scope.removeAllLayers();
			$.each($scope.layers, function(index, layer) {
				layer.checked = true;
				$rootScope.mapObj.addLayer(layer.L_Layer);
				if (typeof layer.L_Layer.options.description !== 'undefined' && layer.L_Layer.options.description != null) {
					$rootScope.mapObj.attributionControl.addAttribution(layer.L_Layer.options.description);
				}
				layer.L_Layer.setZIndex($rootScope.L_layers.length + index);
			});
		} else {
			$.each($scope.layers, function(index, layer) {
				if (layer.checked) {
					if ($rootScope.mapObj.hasLayer(layer.L_Layer)) {
						$rootScope.mapObj.removeLayer(layer.L_Layer);
						layer.checked = false;
					}
				}
			});
		}
	};

} ]);

mapModule.directive('tagTimeline', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			$timeout(function() {
				$("#range-l-slider-" + scope.layer.LayerID).ionRangeSlider({
					type : "single",
					min : 1,
					max : 100,
					grid : true,
					grid_margin : true,
					prettify_enabled : true,
					onChange : function(obj) {
						console.log(obj);
						scope.changeOpacity(obj.from,scope.layer);
						
					}
				});

				var slider = $("#range-l-slider-" + scope.layer.LayerID).data("ionRangeSlider");
				if(slider != undefined && slider != null){
					slider.update({
						from : scope.layer.Opacity,
					});
				}
			}, 0);
		}
	};
});



