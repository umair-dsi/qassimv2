mapModule.controller('TasksCtrl', [ '$scope', 'mapservice', '$rootScope', '$timeout', '$window', '$translate', function($scope, mapservice, $rootScope, $timeout, $window, $translate) {
  
  $scope.init = function() {
    $scope.inAppBrowserRef = null;

    try {
        mapservice.getAllTasksWithUsername($rootScope.userInfo.token, $rootScope.userInfo.userId).then(function(result) {
          if(result.data.code == 2) {
            $rootScope.listOfTasks =_.filter(result.data.assignquery,function(value) {
              if(value.UserName==$rootScope.userInfo.username) { 
                 return value;
               }
             });
          } else if(result.data.code == -1) {
            $rootScope.sessionTimeoutAlert();
          } else {

          }
        }, function(response) {

        });
    } catch (e) {

    }
  };

  // $scope.$on('$viewContentLoaded', function(){
		
	// });
  
  $scope.deleteUploadedDocuments = function(values, index) {
    var value = values[index];
    try {
      $rootScope.loading = true;
      mapservice.deleteTaskBuildingDocuments($rootScope.userInfo.token, $rootScope.userInfo.userId, value.Id).then(function(result) {
        $rootScope.loading = false;
        if(result.data.code == 2) {
          $translate('MAP.DELETED_SUCCESSFUL').then(function (alert101) {
            $translate('MAP.OK').then(function (alert102) {
              lnv.alert({
                content: alert101,
                alertBtnText: alert102,
                alertHandler: function() {
                  values.splice(index,1);
                  $scope.$apply();
                }
              });
            });
          });
        } else if(result.data.code == -1){
          $rootScope.sessionTimeoutAlert();
        } else {
          $translate('MAP.WRONGVALUES').then(function (alert101) {
            $translate('MAP.OK').then(function (alert102) {
              lnv.alert({
                content: alert101,
                alertBtnText: alert102
              });
            });
          });
        }
      }, function(response) {
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
    } catch (e) {
      $rootScope.loading = false;
    }
  };

  $scope.googleCoords = null;
  $scope.openGoogleMaps = function() {
    if($scope.googleCoords != null){
      var _lat = $scope.googleCoords[1];
      var _long = $scope.googleCoords[0];
      
      //window.open("https://maps.google.com?z=10&q=" + _lat + "," + _long, "_system");
      //window.open("geo:0,0?z=10&q=" + _lat + "," + _long, "_system");
      cordova.InAppBrowser.open("https://maps.google.com?z=10&q=" + _lat + "," + _long, '_blank', 'location=no')
    } else {
        //cordova.InAppBrowser.open("https://maps.google.com?z=10&q=" + 33.15454 + "," + 71.65561, '_blank', 'location=no')
      console.log("lat long is missing");
    }
    
  };
  $scope.buildingClicked = function(building) {
    if (building.isOpened == undefined || building.isOpened == null || building.isOpened == false) {
      building.isOpened = true;
      var layerName = $rootScope.timelineCtrl.layers[0].DefaultName
      if(layerName != undefined && layerName != null) {
        try {
          mapservice.getBuildingsbyBuildingId($rootScope.userInfo.token, $rootScope.userInfo.userId, building.BuildingId, layerName).then(function(result) {
            if(result.data.code == 2) {
              var jsonData = JSON.parse(result.data.requestJson);
              $scope.googleCoords = jsonData.features[0].geometry.coordinates[0][0];

              if (jsonData.totalFeatures > 0) {
                  var myStyle = {
                      "color": "#ff7800",
                      "weight": 5,
                      "opacity": 0.65
                  };
                  $scope.zoomToSelectedBuilding = L.geoJson(jsonData, { style: myStyle }).addTo($rootScope.mapObj);
                  $rootScope.mapObj.fitBounds($scope.zoomToSelectedBuilding.getBounds());
              }
            } else if(result.data.code == -1){
              $rootScope.sessionTimeoutAlert();
            } else {

            }
          }, function(response) {
            
          });
        } catch (e) {
          
        }
      }
    } else {
      building.isOpened = false;
    }
  };

  $scope.showModel = function(building) {
    if (building.isModelVisible == undefined || building.isModelVisible == null || building.isModelVisible == false) {
      building.isModelVisible = true;
    } else {
      building.isModelVisible = false;
    }
  };

  $scope.base64ToBlob = function(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  $scope.viewUploadedDocument = function(value) {
    try {
      $rootScope.loading = true;
      mapservice.getBuildingDocument($rootScope.userInfo.token, $rootScope.userInfo.userId, value.Id).then(function(result) {
        $rootScope.loading = false;
        if(result.data.code == 2) {
          if(result.data.str != undefined && result.data.str != null && result.data.str.length > 0) {
            if(device.platform == 'browser') {
              var blob = $scope.base64ToBlob(result.data.str, value.File_Type); 
              var fileURL = URL.createObjectURL(blob);
              window.open(fileURL, "_system");
            } else {
              var file103 = {name: value.File_Name, type: value.File_Type, base64: result.data.str};
              $scope.showDocument(file103)
            }
          } else {
            $translate('MAP.IMAGE_VIEW_FAILED').then(function (alert101) {
              $translate('MAP.OK').then(function (alert102) {
                lnv.alert({
                  content: alert101,
                  alertBtnText: alert102
                });
              });
            });
          }
        } else if(result.data.code == -1){
          $rootScope.sessionTimeoutAlert();
        } else {
          $translate('MAP.DATA_NOT_FOUND').then(function (alert101) {
            $translate('MAP.OK').then(function (alert102) {
              lnv.alert({
                content: alert101,
                alertBtnText: alert102
              });
            });
          });
        }
      }, function(response) {
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
    } catch (e) {
      $rootScope.loading = false;
    }
  };

  $scope.taskClicked = function(task) {
    if (task.isOpened == undefined || task.isOpened == null || task.isOpened == false) {
      try {
        $rootScope.loading = true;
        mapservice.getBuildingsByTaskId($rootScope.userInfo.token, $rootScope.userInfo.userId, task.ID).then(function(result) {
          $rootScope.loading = false;
          if(result.data.code == 2){
            task.isOpened = true;
            task.listOfBuildings = result.data.Buldings;
          } else if(result.data.code == -1){
            $rootScope.sessionTimeoutAlert();
          } else {
            $translate('MAP.DATA_NOT_FOUND').then(function (alert101) {
              $translate('MAP.OK').then(function (alert102) {
                lnv.alert({
                  content: alert101,
                  alertBtnText: alert102
                });
              });
            });
          }
        }, function(response) {
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
      } catch (e) {
        $rootScope.loading = false;
      }
    } else {
      task.isOpened = false;
      task.listOfBuildings = null;
    }
  };

  $scope.showUploadedFile = function(file102) {  
    if(device.platform == 'browser') {
      var url = URL.createObjectURL(file102.file);
      window.open(url, "_system");
    } else {
      var file103 = {name: file102.file.name, type: file102.file.type, base64: file102.fileBinary};
      $scope.showDocument(file103)
    }
  };

  $scope.closeModel = function(building102) {
    building102.isModelVisible = false;
  };

  $scope.deleteUploadedFile = function(uploadedFiles, index) {
    uploadedFiles.splice(index, 1);
    // $scope.$apply();
  };

  $scope.submitBuildingInfo = function(buildings) {

    if(buildings.Comments == undefined || buildings.Comments == null || buildings.Comments == "NA" || buildings.Comments.length == 0) {
      $translate('MAP.COMMENTS_MANDATORY_ALERT').then(function (alert101) {
        $translate('MAP.OK').then(function (alert102) {
          lnv.alert({
            content: alert101,
            alertBtnText: alert102,
            alertHandler: function() {
              
            }
          });
        });
      });
      return;
    }

    var buildingDocuments = {};
    buildingDocuments.BuildingID = buildings.BuildingId;
    var comments101 = (buildings.Comments != undefined && buildings.Comments != null) ? buildings.Comments : "";
    buildingDocuments.Documents = [];
    if(buildings.uploadedFiles != undefined && buildings.uploadedFiles != null) {
      buildings.uploadedFiles.forEach(element => {
        var docs = {File_Name: element.file.name, File_Type: element.file.type, Content: element.fileBinary};
        buildingDocuments.Documents.push(docs);
      });
    }
    
    try {
      $rootScope.loading = true;
      $timeout(function() {
        mapservice.uploadBuildingDocuments($rootScope.userInfo.token, $rootScope.userInfo.userId, buildingDocuments, comments101).then(function(result) {
          $rootScope.loading = false;
          if(result.data.code == 2) {
            $translate('MAP.UPLOADED_SUCCESSFUL').then(function (alert101) {
              $translate('MAP.OK').then(function (alert102) {
                lnv.alert({
                  content: alert101,
                  alertBtnText: alert102,
                  alertHandler: function() {
                    if(result.data.AllDocuments != undefined && result.data.AllDocuments != null && result.data.AllDocuments.length > 0) {
                      if(buildings.Alldocuments == undefined || buildings.Alldocuments == null) {
                        buildings.Alldocuments = [];
                      }
                      result.data.AllDocuments.forEach(element => {
                        buildings.Alldocuments.push(element);
                      });
                      buildings.uploadedFiles = [];
                      $scope.$apply();
                    }
                  }
                });
              });
            });
          } else if(result.data.code == -1){
            $rootScope.sessionTimeoutAlert();
          } else {
            $translate('MAP.DATA_NOT_FOUND').then(function (alert101) {
              $translate('MAP.OK').then(function (alert102) {
                lnv.alert({
                  content: alert101,
                  alertBtnText: alert102
                });
              });
            });
          }
        }, function(response) {
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
      }, 1000);
    } catch (e) {
      $rootScope.loading = false;
    }
  };

  $scope.uploadFile = function(building, event) {
    var file = event.target.files[0];
    var i = file.name.indexOf('.') + 1;
    var fileType = file.name.substring(i, file.name.length);
    if(fileType == "png" || fileType == "jpg" || fileType == "jpeg" || fileType == "pdf" || fileType == "doc" || fileType == "docx") {
      if (file != undefined && file != null) {
        var r = new FileReader();
        r.onload = function(evt){ 
          if(building.uploadedFiles == undefined || building.uploadedFiles == null) {
            building.uploadedFiles = [];
          }
          var base64 = evt.target.result;
          // var byteArray = new Uint8Array(arrayBuffer);
          var i = base64.indexOf(',') + 1;
          base64 = base64.substring(i, base64.length);
          building.uploadedFiles.push({file: file, fileBinary: base64});
          $scope.$apply();
        };
        r.readAsDataURL(file);
      } else {
        $translate('MAP.FILE_UPLOAD_FAILED').then(function (alert101) {
          $translate('MAP.OK').then(function (alert102) {
            lnv.alert({
              content: alert101,
              alertBtnText: alert102
            });
          });
        });
      }
    } else {
      $translate('MAP.UPLOAD_REQUIRED_DOCUMENTS').then(function (alert101) {
        $translate('MAP.OK').then(function (alert102) {
          lnv.alert({
            content: alert101,
            alertBtnText: alert102
          });
        });
      });
    }
    
  };

  // view document

  $scope.viewDocument = function(filePath, fileMIMEType) {
    cordova.plugins.fileOpener2.open(
      filePath,
      fileMIMEType,
      {
          error : function(){ 
            $translate('MAP.PDFVIEWERROR').then(function (alert101) {
              $translate('MAP.OK').then(function (alert102) {
                lnv.alert({
                  content: alert101,
                  alertBtnText: alert102,
                });
              });
            });
          },
          success : function(){ 

          }
      }
    );
  };

  $scope.showDocument = function(value) {
    try {
      window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
        console.log('file system open: ' + fs.name);
        fs.root.getFile(value.name, {create: true, exclusive: false}, function(fileEntry) {
          fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
                $scope.viewDocument(fileEntry.nativeURL, value.type);
            };
    
            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
                $translate('MAP.PDFVIEWERROR').then(function (alert101) {
                  $translate('MAP.OK').then(function (alert102) {
                    lnv.alert({
                      content: alert101,
                      alertBtnText: alert102,
                    });
                  });
                });
            };

            var dataObj = $scope.base64ToBlob(value.base64, value.type);
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }
    
            fileWriter.write(dataObj);
          });
        }, function(){
          // $rootScope.loading = false;
          $translate('MAP.PDFVIEWERROR').then(function (alert101) {
            $translate('MAP.OK').then(function (alert102) {
              lnv.alert({
                content: alert101,
                alertBtnText: alert102,
              });
            });
          });
        });
      }, function(){
        // $rootScope.loading = false;
        $translate('MAP.PDFVIEWERROR').then(function (alert101) {
          $translate('MAP.OK').then(function (alert102) {
            lnv.alert({
              content: alert101,
              alertBtnText: alert102,
            });
          });
        });
      });
    } catch (error) {
      $rootScope.loading = false;
    }
  };

}]).directive('onFileChange', function() {
  return {
    restrict: 'A',
    scope:{
      onChange:'&'
    },
    link: function (scope, element, attrs) {
      // scope.onChangeHandler = scope.$eval(attrs.onChange);
      element.on('change', function(event){
        scope.onChange({arg101: event});
      });
      element.on('$destroy', function() {
        element.off();
      });
    }
  };
});;
  
  
  
  
