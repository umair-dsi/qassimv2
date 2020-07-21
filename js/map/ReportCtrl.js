mapModule.controller('ReportCtrl', [ '$scope', 'mapservice', '$rootScope', '$window', function($scope, mapservice, $rootScope, $window) {

	$scope.init = function() {

        

    };

    $scope.regionSelected = function(regions) {
        if(regions.isSelected) {
            regions.isSelected = false;
        } else {
            regions.isSelected = true;
        }
    };

    // $scope.showPdf = function(regions) {
    //     $window.open(regions.pdfpath, "_system");
    // };

    $scope.showRegionPdf = function(regions) {
        if($rootScope.language == "en-US") {
            $window.open(regions.PdfRegionEn, "_system");
        } else {
            $window.open(regions.PdfRegionAr, "_system");
        }
    };

    $scope.showAreaPdf = function(regions) {
        if($rootScope.language == "en-US") {
            $window.open(regions.PdfAreaEn, "_system");
        } else {
            $window.open(regions.PdfAreaAr, "_system");
        }
    };

    $scope.$on("ChangeDetection_LayerUpdated", function (evt, data) {
	  return;//delete this line before deploying on production
        try {
            mapservice.getReports(data[0].LayerID, $rootScope.userInfo.token, $rootScope.userInfo.userId).then(function(result) {
                
                if(result.data.code == 2) {
                    var listOfAreas = result.data.allAreaBuilding.lstAreas;
                    $scope.uniqueRegionList = _.uniq(listOfAreas, function (x) {
                        return x.Region_En;
                    });
                    $.each($scope.uniqueRegionList, function(index, region) {
                        $scope.uniqueRegionList[index].isSelected = false;
                        $scope.uniqueRegionList[index].lstOfAreas = _.where(listOfAreas, { Region_En: $scope.uniqueRegionList[index].Region_En });
                    });
                } else if(result.data.code == -1) {
                    $rootScope.sessionTimeoutAlert();
                }
            }, function(response) {

            });
        } catch (e) {

        }
    });
    
}]);



