mapModule.controller('MapLayersCtrl', function($scope, $rootScope,mapservice,$filter) {
	
	$scope.onClkChangeLayer = function(layerCat){
		$rootScope.layerCategory = layerCat;
	};
	
    $scope.setLayerOpacity = function (opacity, layerObject) {
        var tempObj = $filter('filter')($rootScope.toc_layers, { LayerID: layerObject.LayerID });
        var overlay = tempObj[0].L_Layer;
        layerObject.previousLayerOpacities = opacity;
        if (overlay != null) {
            opacity = (opacity / 100.0);
            overlay.setOpacity(opacity);
        }
    };
    
	$scope.toggleLayer = function(layerId, layerOrder, event, layer) {
		if ($(event.target).is(':checked')) {
			$('.priority-is-' + layerId).each(function(i, obj) {
				$(this).prop('checked', true);
				$.each($rootScope.L_layers, function(index, value) {
					if (value.options.parentID == layerId) {
						value.options.checked = true;
					}
				});
			});

			if (typeof $rootScope.mapObj !== 'undefined' && $rootScope.mapObj != null) {
				$.each($rootScope.L_layers, function(index, value) {
					if ((value.options.layerid == layerId) || (value.options.layerid != layerId && value.options.checked == true)) {
						delete $rootScope.unchecked_layerids[String(layerId)];
					}
					try {
						if ($rootScope.mapObj.hasLayer(value))
							$rootScope.mapObj.removeLayer(value);
					} catch (e) {
					}
				});
			}

			var overlays = {};

			if (layer.L_Layer != null)
				layer.L_Layer.options.checked = true;// -------

			for (var i = 0; i < $rootScope.L_layers.length; i++) {
				var options = $rootScope.L_layers[i].options;
				if (options.checked) {
					$rootScope.mapObj.addLayer($rootScope.L_layers[i]);
					$rootScope.L_layers[i].setZIndex(i);
				}
			}
			if ($scope.layercontrol != null) {
				$rootScope.mapObj.removeControl($scope.layercontrol);
			}
		} else {

			$('.priority-is-' + layerId).each(function(i, obj) {
				$(this).prop('checked', false);
				$.each($rootScope.L_layers, function(index, value) {
					if (value.options.parentID == layerId) {
						value.options.checked = false;
					}
				});
			});

			$.each($rootScope.L_layers, function(i, value) {
				if ((value.options.layerid == layerId) || (value.options.layerid != layerId && value.options.checked == false)) {
					try {
						if ($rootScope.mapObj.hasLayer(value)) {
							$rootScope.mapObj.removeLayer(value);
							value.options.checked = false;
						}
					} catch (e) {
						console.log(e);
					}
					$rootScope.unchecked_layerids[String(layerId)] = layerId;
				}
			});
		}
	};
});