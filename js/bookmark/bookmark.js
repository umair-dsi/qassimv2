mapModule.controller('MyBookmarksTreeCtrl', function ($scope, $timeout, $http, $modal, $rootScope, $filter, $translate) {
    $scope.bookmarkCat = "tree";
    $scope.bookMarkLayerGroup = new L.featureGroup();
    $scope.bookMarkeditableNodeID = null;
    $scope.bookMarkeditable = null;
    $scope.bookMarkerObject = [];
    $scope.$on('updateBookMarkTreeEvent', function (event, args) {
        $scope.getBookMarkList(true);
    });
    $scope.$on('selectLatestBookMark', function (event, args) {
        $('#bookmark_jstree').jstree('select_node', 'bk_' + args.BookMarkID);
    });

    $scope.updateBookMark = function (fitBound) {
        $scope.bookMarkLayerGroup.clearLayers();
        var layerCount = 0;
        $.each($scope.bookMarkerObject, function (index, value) {
            $.each($scope.bookMarkSelected, function (i, selectedBookmark) {
                if (value.object.BookMarkID == Number(selectedBookmark.id.split("_")[1])) {
                    if ($scope.bookMarkeditableNodeID != null && $scope.bookMarkeditableNodeID == selectedBookmark.id) {
                        return;
                    }
                    //value.marker.bindLabel(value.object.Name, { noHide: true });
                    value.marker.bindTooltip(value.object.Name, { permanent: true });
                    layerCount++;
                    $scope.bookMarkLayerGroup.addLayer(value.marker);
                }
            });
        });
        if (layerCount > 0) {
            $scope.bookMarkLayerGroup.addTo($rootScope.mapObj);
        }
        if (fitBound && layerCount > 0) {
            $rootScope.mapObj.fitBounds($scope.bookMarkLayerGroup.getBounds());
        }
    }

    $scope.getBookMarkList = function (refresh) {
        var getBookMarkFolderList_URL = $rootScope.baseUrl + "BookMark/m_GetBookMarkFolderList";
        $http.get(getBookMarkFolderList_URL,
            {
                params: {
                    'userId': $rootScope.userInfo.userId,
                    'token': $rootScope.userInfo.token
                }
            }).then(function (result) {

                $scope.bookMarkerObject = [];

                var bookmarkFolderList = result.data.bookMarkFolderList;
                var bookmarkList = result.data.bookMarkList_arr;

                var bookmarkFolderPublicList = result.data.bookMarkFolderPublicList;
                var bookmarkPublicList = result.data.bookMarkListPublic_arr;

                var finalBookMarkList = [
                    { "id": "myBookmark", "parent": "#", "text": $translate.instant('BOOKMARK.MY_BOOKMARKS'), "icon": "glyphicon glyphicon-folder-open", "li_attr": { "type": "folder" } },
                    { "id": "sharedBookmark", "parent": "#", "text": $translate.instant('BOOKMARK.sharedbookmarks'), "icon": "glyphicon glyphicon-folder-open", "li_attr": { "type": "folder" } }
                ];


                $.each(bookmarkFolderList, function (index, value) {
                    if (value.ParentID == null) {
                        finalBookMarkList.push({ "id": "fd_" + value.BookMarkFolderID, "parent": "myBookmark", "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-folder-open", "li_attr": { "type": "folder" }, "data": { "isPublic": value.IsPublic } });
                    } else if (value.ParentID != null) {
                        finalBookMarkList.push({ "id": "fd_" + value.BookMarkFolderID, "parent": "fd_" + value.ParentID, "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-folder-open", "li_attr": { "type": "folder" }, "data": { "isPublic": value.IsPublic } });
                    }
                });

                $.each(bookmarkList, function (index, value) {

                    var wkt = new Wkt.Wkt();
                    wkt.read(value.Shape);
                    var markerObj = new L.marker(wkt.toObject().getLatLng(), { icon: L.AwesomeMarkers.icon({ icon: 'bookmark', prefix: 'fa', markerColor: 'blue' }) });
                    if (value.Description != null && value.Description.trim() != "") {
                        markerObj.bindPopup("<div class=\"panel panel-default\" style=\"border:none;box-shadow:none;width:250px;\"><div class=\"panel-body\"><strong>Description:</strong><br/>" + (value.Description != null ? value.Description : "N/A") + "</div></div>");
                    }
                    $scope.bookMarkerObject.push({ marker: markerObj, object: value });

                    if (value.ParentID != null) {
                        finalBookMarkList.push({ "id": "bk_" + value.BookMarkID, "parent": "fd_" + value.ParentID, "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-bookmark", "li_attr": { "type": "bookmark" }, "data": { "isPublic": value.IsPublic, "description": value.Description, "shape": value.Shape } });
                    } else if (value.ParentID == null) {
                        finalBookMarkList.push({ "id": "bk_" + value.BookMarkID, "parent": "myBookmark", "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-bookmark", "li_attr": { "type": "bookmark" }, "data": { "isPublic": value.IsPublic, "description": value.Description, "shape": value.Shape } });
                    }

                });

                //For Public folder and bookmarks

                $.each(bookmarkFolderPublicList, function (index, value) {
                    if (value.ParentID == null) {
                        finalBookMarkList.push({ "id": "fd_" + value.BookMarkFolderID, "parent": "sharedBookmark", "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-folder-open", "li_attr": { "type": "folder" }, "data": { "isPublic": value.IsPublic } });
                    } else if (value.ParentID != null) {
                        finalBookMarkList.push({ "id": "fd_" + value.BookMarkFolderID, "parent": "fd_" + value.ParentID, "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-folder-open", "li_attr": { "type": "folder" }, "data": { "isPublic": value.IsPublic } });
                    }
                });

                $.each(bookmarkPublicList, function (index, value) {

                    var wkt = new Wkt.Wkt();
                    wkt.read(value.Shape);
                    var markerObj = new L.marker(wkt.toObject().getLatLng(), { icon: L.AwesomeMarkers.icon({ icon: 'bookmark', prefix: 'fa', markerColor: 'blue' }) });
                    if (value.Description != null && value.Description.trim() != "") {
                        markerObj.bindPopup("<div class=\"panel panel-default\" style=\"width:250px;\"><div class=\"panel-body\">" + (value.Description != null ? value.Description : "N/A") + "</div></div>");
                    }
                    $scope.bookMarkerObject.push({ marker: markerObj, object: value });

                    if (value.ParentID != null) {
                        finalBookMarkList.push({ "id": "bk_" + value.BookMarkID, "parent": "fd_" + value.ParentID, "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-bookmark", "li_attr": { "type": "bookmark" }, "data": { "isPublic": value.IsPublic, "description": value.Description, "shape": value.Shape } });
                    } else if (value.ParentID == null) {
                        finalBookMarkList.push({ "id": "bk_" + value.BookMarkID, "parent": "sharedBookmark", "text": value.Name, a_attr: { 'title': 'Created By: ' + value.owner.UserName }, "icon": "glyphicon glyphicon-bookmark", "li_attr": { "type": "bookmark" }, "data": { "isPublic": value.IsPublic, "description": value.Description, "shape": value.Shape } });
                    }

                });



                if (refresh) {
                    $('#bookmark_jstree').jstree(true).settings.core.data = finalBookMarkList;
                    $('#bookmark_jstree').jstree(true).refresh();
                } else {
                    $('#bookmark_jstree').jstree({
                        'core': {
                            //'worker': false,
                            'themes': {
                                'name': 'proton',
                                'responsive': true
                            },
                            "checkbox": {
                                "keep_selected_style": true
                            },
                            'data': finalBookMarkList,
                        },
                        'plugins': ["checkbox", "wholerow", "ui", "contextmenu", "types"],
                        'contextmenu': {
                            items: function (node) {
                                var items = {
                                    addBookMark: {
                                        label: $translate.instant("BOOKMARK.ADD_BOOKMARK"),
                                        icon: "glyphicon glyphicon-bookmark",
                                        action: function () {
                                            //$("#dlg_addBookmark").addClass("open");
                                            $scope.bookmarkCat = "addModifyBk";
                                            var scopeBk = angular.element($("#dlg_addBookmark")).scope();
                                            scopeBk.$apply(function () {
                                                scopeBk.formData = {
                                                    isPublic: "N",
                                                    parentId: node.id.split("_")[1],
                                                    bkOperationType: $translate.instant("BOOKMARK.ADD_BOOKMARK")
                                                };
                                            });
                                            scopeBk.init();
                                        }
                                    },
                                    addBookMarkFolder: {
                                        label: $translate.instant("BOOKMARK.ADD_BOOKMARK_FOLDER"),
                                        icon: "glyphicon glyphicon-folder-open",
                                        action: function () {
                                            $modal.open({
                                                templateUrl: 'BookMarkFolder.html',
                                                controller: 'BookMarkFolderCtrl',
                                                backdrop: 'static',
                                                resolve: {
                                                    parentId: function () {
                                                        return node.id.split("_")[1];
                                                    },
                                                    folderVO: function () {
                                                        return null;
                                                    }
                                                },
                                                size: 'sm'
                                            });
                                        }
                                    },
                                    modifyBookMarkFolder: {
                                        label: $translate.instant("BOOKMARK.MODIFY_BOOKMARK_FOLDER"),
                                        icon: 'glyphicon glyphicon-edit',
                                        action: function () {
                                            var folderVO = {
                                                name: node.text,
                                                isPublic: node.data.isPublic,
                                                bookmarkfolderId: node.id.split("_")[1],
                                                parentId: node.parent.split("_")[1]
                                            };
                                            $modal.open({
                                                templateUrl: 'BookMarkFolder.html',
                                                controller: 'BookMarkFolderCtrl',
                                                backdrop: 'static',
                                                resolve: {
                                                    parentId: function () {
                                                        return node.id.split("_")[1];
                                                    },
                                                    folderVO: function () {
                                                        return folderVO;
                                                    }
                                                },
                                                size: 'sm'
                                            });

                                        }
                                    },
                                    modifyBookMark: {
                                        label: $translate.instant("BOOKMARK.MODIFY_BOOKMARK"),
                                        icon: 'glyphicon glyphicon-edit',
                                        action: function () {
                                            //$("#dlg_addBookmark").addClass("open");
                                            $scope.bookmarkCat = "addModifyBk";
                                            var scopeBk = angular.element($("#dlg_addBookmark")).scope();
                                            $('#bookmark_jstree').jstree(true).set_icon(node.id, "glyphicon glyphicon-edit");
                                            scopeBk.$apply(function () {
                                                scopeBk.formData = {
                                                    bookmarkID: (node.id == "myBookmark" ? null : node.id.split("_")[1]),
                                                    name: node.text,
                                                    isPublic: (node.data != null ? node.data.isPublic : 'N'),
                                                    description: (node.data != null ? node.data.description : null),
                                                    bkOperationType: $translate.instant("BOOKMARK.MODIFY_BOOKMARK")
                                                };
                                            });

                                            if ($scope.bookMarkeditableNodeID != null && $scope.bookMarkeditableNodeID != node.id) {
                                                $('#bookmark_jstree').jstree(true).set_icon($scope.bookMarkeditableNodeID, "glyphicon glyphicon-bookmark");
                                            }

                                            $scope.bookMarkeditableNodeID = node.id;
                                            var sel_bk = $filter('filter')($scope.bookMarkerObject, { object: { BookMarkID: node.id.split("_")[1] } });
                                            if (sel_bk.length > 0) {

                                                $scope.bookMarkLayerGroup.removeLayer($scope.bookMarkLayerGroup.getLayerId(sel_bk[0].marker));
                                                var tempIsSelected = false;
                                                $.each($scope.bookMarkSelected, function (i, selectedBookmark) {
                                                    if (selectedBookmark.id.split("_")[1] == node.id.split("_")[1]) {
                                                        tempIsSelected = true;
                                                    }
                                                });

                                                if (tempIsSelected) {
                                                    $scope.updateBookMark(false);
                                                } else {
                                                    $('#bookmark_jstree').jstree('select_node', 'bk_' + node.id.split("_")[1]);
                                                }

                                                if ($scope.bookMarkeditable != null) {
                                                    $rootScope.mapObj.removeLayer($scope.bookMarkeditable);
                                                    $scope.bookMarkeditable = null;
                                                }

                                                var wkt = new Wkt.Wkt();
                                                wkt.read(node.data.shape);
                                                $scope.bookMarkeditable = new L.marker(wkt.toObject().getLatLng(), { icon: L.AwesomeMarkers.icon({ icon: 'arrows', prefix: 'fa', markerColor: 'red' }) });
                                                //$scope.bookMarkeditable.bindLabel(sel_bk[0].object.Name, { noHide: true });//version .6.x.x
                                                $scope.bookMarkeditable.bindTooltip(sel_bk[0].object.Name, { permanent: true });//version 1.4
                                                $rootScope.mapObj.addLayer($scope.bookMarkeditable);
                                                $scope.bookMarkeditable.dragging.enable();
                                                $rootScope.mapObj.panTo(sel_bk[0].marker.getLatLng());
                                            }
                                        }
                                    },
                                    zoomToBookMark: {
                                        label: $translate.instant("BOOKMARK.ZOOM_TO_BOOKMARK"),
                                        icon: "glyphicon glyphicon-search",
                                        action: function () {
                                            if (node.data != null && node.data.shape != null) {
                                                var wkt = new Wkt.Wkt();
                                                wkt.read(node.data.shape);
                                                var tempObj = wkt.toObject();
                                                $rootScope.mapObj.panTo(tempObj.getLatLng());
                                                setTimeout(function () {
                                                    $rootScope.mapObj.setZoom(14);
                                                }, 1000);

                                            }
                                        }
                                    },
                                    deleteBookMark: { // The "delete" menu item
                                        label: $translate.instant("BOOKMARK.DELETE_BOOKMARK"),
                                        icon: "glyphicon glyphicon-trash",
                                        action: function () {

                                            $modal.open({
                                                templateUrl: 'SplashContent.html',
                                                controller: 'ModalInstanceCtrl',
                                                resolve: {
                                                    items: function () {
                                                        return { operation: 'deleteBookmark', bookMarkId: node.id.split("_")[1], msg: $translate.instant('BOOKMARK.deleteBookmarkMsg') };
                                                    }
                                                },
                                                backdrop: 'static'
                                            });
                                        }
                                    },
                                    deleteBookMarkFolder: {
                                        label: $translate.instant("BOOKMARK.DELETE_BOOKMARK_FOLDER"),
                                        icon: "glyphicon glyphicon-trash",
                                        action: function () {

                                            $modal.open({
                                                templateUrl: 'SplashContent.html',
                                                controller: 'ModalInstanceCtrl',
                                                resolve: {
                                                    items: function () {
                                                        return { operation: 'deleteBookmarkFolder', folderId: node.id.split("_")[1], msg: $translate.instant('BOOKMARK.deleteBookmarkFolderMsg') };
                                                    }
                                                },
                                                backdrop: 'static'
                                            });

                                        }
                                    }
                                };


                                if (node.parent == '#') {
                                    //if ($scope.user.UserID !== 1 && $filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_ADD_BOOKMARK" }, true).length === 0) {
                                    //    //delete items.addBookMark;
                                    //    //delete items.addBookMarkFolder;
                                    //    items.addBookMark._disabled = true;
                                    //    items.addBookMarkFolder._disabled = true;
                                    //}

                                    delete items.modifyBookMarkFolder;
                                    delete items.deleteBookMarkFolder;
                                    delete items.modifyBookMark;
                                    delete items.deleteBookMark;
                                    delete items.zoomToBookMark;
                                }

                                if (node.id === "sharedBookmark") {
                                    delete items.addBookMark;
                                    delete items.addBookMarkFolder;
                                    delete items.modifyBookMark;
                                    delete items.deleteBookMark;
                                    delete items.zoomToBookMark;
                                }

                                if (node.li_attr.type === "folder") {
                                    if ($rootScope.userInfo.userId !== 1 && $filter('filter')(node.parents, "sharedBookmark").length > 0) {
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_MODIFY_OTHER_BOOKMARK_FOLDER" }, true).length === 0 || $filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_MODIFY_BOOKMARK" }, true).length === 0) {
                                        ////delete items.modifyBookMarkFolder;
                                        //items.modifyBookMarkFolder._disabled = true;
                                        //}
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_DELETE_OTHER_BOOKMARK_FOLDER" }, true).length === 0 || $filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_DELETE_BOOKMARK" }, true).length === 0) {
                                        ////delete items.deleteBookMarkFolder;
                                        //items.deleteBookMarkFolder._disabled = true;
                                        //}
                                        //In case 
                                        delete items.addBookMark;
                                        delete items.addBookMarkFolder;
                                    } else if ($rootScope.userInfo.userId !== 1 && $filter('filter')(node.parents, "myBookmark").length > 0) {

                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_MODIFY_BOOKMARK" }, true).length === 0) {
                                        ////delete items.modifyBookMarkFolder;
                                        //items.modifyBookMarkFolder._disabled = true;

                                        //}
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_DELETE_BOOKMARK" }, true).length === 0) {
                                        ////delete items.deleteBookMarkFolder;
                                        //items.deleteBookMarkFolder._disabled = true;
                                        //}

                                    }
                                    delete items.deleteBookMark;
                                    delete items.modifyBookMark;
                                    delete items.zoomToBookMark;

                                } else if (node.li_attr.type === "bookmark") {

                                    if ($rootScope.userInfo.userId !== 1 && $filter('filter')(node.parents, "sharedBookmark").length > 0) {
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_MODIFY_OTHER_BOOKMARK_FOLDER" }, true).length === 0 || $filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_MODIFY_BOOKMARK" }, true).length === 0) {
                                        delete items.modifyBookMark;
                                        //items.modifyBookMark._disabled = true;
                                        //}
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_DELETE_OTHER_BOOKMARK_FOLDER" }, true).length === 0 || $filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_DELETE_BOOKMARK" }, true).length === 0) {
                                        delete items.deleteBookMark;
                                        //items.deleteBookMark._disabled = true;
                                        //}
                                    } else if ($rootScope.userInfo.userId !== 1 && $filter('filter')(node.parents, "myBookmark").length > 0) {
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_MODIFY_BOOKMARK" }, true).length === 0) {
                                        ////delete items.modifyBookMark;
                                        //items.modifyBookMark._disabled = true;
                                        //}
                                        //if ($filter('filter')($scope.user.arr_permsission, { PermissionConstant: "PERMISSION_DELETE_BOOKMARK" }, true).length === 0) {
                                        ////delete items.deleteBookMark;
                                        //items.deleteBookMark._disabled = true;
                                        //}
                                    }
                                    delete items.modifyBookMarkFolder;
                                    delete items.deleteBookMarkFolder;
                                    delete items.addBookMark;
                                    delete items.addBookMarkFolder;
                                }

                                return items;
                            },
                            select_node: false
                        }
                    }).on("changed.jstree", function (evt, data) {
                        var i, j;
                        var prev_sel_node = $scope.bookMarkSelected;
                        $scope.bookMarkSelected = [];
                        for (i = 0, j = data.selected.length; i < j; i++) {
                            var temp = data.instance.get_node(data.selected[i]);
                            if (temp != null && temp.li_attr.type === "bookmark") {
                                $scope.bookMarkSelected.push(data.instance.get_node(data.selected[i]));
                            }
                        }
                        if ($scope.bookMarkeditableNodeID != null) {
                            var isEditedNodeFound = false;
                            $.each($scope.bookMarkSelected, function (i, selectedBookmark) {
                                if ($scope.bookMarkeditableNodeID == selectedBookmark.id) {
                                    isEditedNodeFound = true;
                                }
                            });

                            if (!isEditedNodeFound) {
                                var scopeBk = angular.element($("#dlg_addBookmark")).scope();
                                scopeBk.cancel();
                                $scope.bookMarkeditableNodeID = null;
                            }
                        }
                        $scope.updateBookMark(false);
                    });
                }
            });
    }
    $scope.getBookMarkList();
});

mapModule.controller('BookMarkFolderCtrl', ['$scope', '$http', '$modalInstance', '$rootScope', 'parentId', 'folderVO', function ($scope, $http, $modalInstance, $rootScope, parentId, folderVO) {
    $scope.uniqueError = false;
    $scope.formData = { isPublic: "N", operation: $translate.instant("BOOKMARK.ADD_BOOKMARK_FOLDER") };
    if (folderVO != null) {
        $scope.formData = {
            name: folderVO.name,
            isPublic: folderVO.isPublic,
            bookmarkfolderId: folderVO.bookmarkfolderId,
            parentId: folderVO.parentId,
            operation: $translate.instant("BOOKMARK.MODIFY_BOOKMARK_FOLDER")
        };
    }
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.removeMessage = function () {
        $scope.uniqueError = false;
    };

    $scope.submitBookMarkFolderForm = function (bookmark) {

        var bookmarkVo = {
            name: bookmark.name,
            isPublic: bookmark.isPublic,
            parentFolderId: (parentId === "myBookmark" ? null : parentId),
            bookmarkfolderId: bookmark.bookmarkfolderId
        };
        var checkDuplicateFolderName_URL = $rootScope.baseUrl + "Bookmar/m_checkDuplicateBookMarkName";
        if (bookmark.bookmarkfolderId != null && bookmark.bookmarkfolderId != "") {

            $http.get(checkDuplicateFolderName_URL,
                {
                    params: {
                        'userId': $rootScope.userInfo.userId,
                        'token': $rootScope.userInfo.token,
                        bookmark: bookmarkVo,
                        'timeStamp': new Date().getTime()
                    }
                }
            ).then(function (result) {
                var updateBookMarkFolderName_URL = $rootScope.baseUrl;
                if (result.data.status === 0) {
                    $http.get(updateBookMarkFolderName_URL, { bookmark: bookmarkVo, 'timeStamp': new Date().getTime() }).then(function (result) {
                        if (result.data.msgId === 1) {
                            //toastr.error(result.data.msg, localize.getLocalizedString("Error"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                            lnv.alert({
                                content: result.data.msg,
                                alertBtnText: $translate.instant('MAP.OK')
                            });
                        } else {
                            //toastr.success(localize.getLocalizedString("msg-bookmark-folder-modify"), localize.getLocalizedString("Success"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                            lnv.alert({
                                content: $translate.instant("BOOKMARK.msg-bookmark-folder-modify"),
                                alertBtnText: $translate.instant('MAP.OK')
                            });
                            $modalInstance.close();
                            $rootScope.$broadcast('updateBookMarkTreeEvent');
                        }
                    });
                } else {
                    $scope.uniqueError = true;
                }
            });

        } else {
            $http.get(checkDuplicateFolderName_URL, { bookmark: bookmarkVo, 'timeStamp': new Date().getTime() }).then(function (result) {
                if (result.data.status === 0) {
                    var addBookMarkFolder_URL = $rootScope.baseUrl;
                    $http.get(addBookMarkFolder_URL, { bookmark: bookmarkVo, 'timeStamp': new Date().getTime() }).then(function (result) {
                        if (result.data.msgId === 1) {
                            //toastr.error(result.data.msg, localize.getLocalizedString("Error"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                            lnv.alert({
                                content: result.data.msg,
                                alertBtnText: $translate.instant('MAP.OK')
                            });
                        } else {
                            //toastr.success(localize.getLocalizedString("msg-bookmark-folder-created"), localize.getLocalizedString("Success"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                            lnv.alert({
                                content: $translate.instant("BOOKMARK.msg-bookmark-folder-created"),
                                alertBtnText: $translate.instant('MAP.OK')
                            });
                            $modalInstance.close();
                            $rootScope.$broadcast('updateBookMarkTreeEvent');
                        }
                    });
                } else {
                    $scope.uniqueError = true;
                }
            });
        }
    };
}]);


mapModule.controller('BookMarkCtrl', ['$scope', '$http', '$rootScope', '$timeout', '$translate', function ($scope, $http, $rootScope, $timeout, $translate) {

    $scope.uniqueError = false;
    $scope.parentId = null;
    $scope.formData = {};
    $scope.marker = null;

    $scope.removeMessage = function () {
        $scope.uniqueError = false;
    };

    $scope.ok = function () {
        $scope.cancel();
    };

    $scope.cancel = function () {
        if ($scope.$parent.bookMarkeditable != null) {
            $rootScope.mapObj.removeLayer($scope.$parent.bookMarkeditable);
            $scope.$parent.bookMarkeditable = null;
        }

        if ($scope.marker != null) {
            $rootScope.mapObj.removeLayer($scope.marker);
            $scope.marker = null;
        }

        //$("#dlg_addBookmark").removeClass("open");
        $scope.$parent.bookmarkCat = "tree";
        $rootScope.$broadcast('updateBookMarkTreeEvent');
    };

    $scope.init = function () {
        $scope.marker = L.marker($rootScope.mapObj.getCenter(), { icon: L.AwesomeMarkers.icon({ icon: 'bookmark', prefix: 'fa', markerColor: 'blue' }), draggable: true });
        $rootScope.mapObj.addLayer($scope.marker);
    };

    $scope.submitAddBookMarkForm = function () {
        var checkDuplicateBookMarkName_URL = $rootScope.baseUrl + "Bookmark/m_checkDuplicateBookMarkName";
        if ($scope.formData.bookmarkID == null || $scope.formData.bookmarkID == "") {
            $scope.formData.parentId = $scope.formData.parentId === "myBookmark" ? null : $scope.formData.parentId;
            $http.get(checkDuplicateBookMarkName_URL,
                {
                    params: {
                        'userId': $rootScope.userInfo.userId,
                        'token': $rootScope.userInfo.token,
                        bookmark: JSON.stringify($scope.formData),
                        'timeStamp': new Date().getTime()
                    }
                }
            ).then(function (result) {
                //if (result.data.status === 0) {
                var wkt = new Wkt.Wkt();
                wkt.fromObject($scope.marker);
                $scope.formData.pointWkt = wkt.write();
                var addBookMark_URL = $rootScope.baseUrl + "Bookmark/m_addBookmark";
                $http.get(addBookMark_URL,
                    {
                        params: {
                            'userId': $rootScope.userInfo.userId,
                            'token': $rootScope.userInfo.token,
                            bookmark: JSON.stringify($scope.formData),
                            'timeStamp': new Date().getTime()
                        }
                    }
                ).then(function (result) {
                    if (result.data.msgId === 1) {
                        //toastr.error(result.data.msg, localize.getLocalizedString("Error"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                        lnv.alert({
                            content: result.data.msg,
                            alertBtnText: $translate.instant('MAP.OK')
                        });
                    } else {
                        $rootScope.mapObj.removeLayer($scope.marker);
                        //toastr.success(localize.getLocalizedString("msg-bookmark-created"), localize.getLocalizedString("Success"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                        lnv.alert({
                            content: $translate.instant("BOOKMARK.msg-bookmark-created"),
                            alertBtnText: $translate.instant('MAP.OK')
                        });
                        //$("#dlg_addBookmark").removeClass("open");
                        $scope.cancel();
                        $rootScope.$broadcast('updateBookMarkTreeEvent');
                        $timeout(function () {
                            $rootScope.$broadcast('selectLatestBookMark', result.data.bookmarkObj);
                        }, 1000);
                    }
                });
                //}
            });
        } else {
            $http.get(checkDuplicateBookMarkName_URL,
                {
                    params: {
                        'userId': $rootScope.userInfo.userId,
                        'token': $rootScope.userInfo.token,
                        bookmark: JSON.stringify($scope.formData),
                        'timeStamp': new Date().getTime()
                    }
                }
            ).then(function (result) {
                //if (result.data.status === 0) {
                var wkt = new Wkt.Wkt();
                wkt.fromObject($scope.$parent.bookMarkeditable);
                $scope.formData.pointWkt = wkt.write();
                var updateBookMark_URL = $rootScope.baseUrl + "Bookmark/m_updateBookMark";
                $http.get(updateBookMark_URL,
                    {
                        params: {
                            'userId': $rootScope.userInfo.userId,
                            'token': $rootScope.userInfo.token,
                            bookmark: JSON.stringify($scope.formData),
                            'timeStamp': new Date().getTime()
                        }
                    }
                ).then(function (result) {
                    if (result.data.msgId === 1) {
                        //toastr.error(result.data.msg, localize.getLocalizedString("Error"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                        lnv.alert({
                            content: result.data.msg,
                            alertBtnText: $translate.instant('MAP.OK')
                        });
                    } else {
                        $scope.$parent.bookMarkeditableNodeID = null;
                        $rootScope.mapObj.removeLayer($scope.$parent.bookMarkeditable);
                        //toastr.success(localize.getLocalizedString("msg-bookmark-modify"), localize.getLocalizedString("Success"), { positionClass: (currentLanguage == 'ar' ? 'toast-top-left' : 'toast-top-right') });
                        lnv.alert({
                            content: $translate.instant("BOOKMARK.msg-bookmark-modify"),
                            alertBtnText: $translate.instant('MAP.OK')
                        });
                        //$("#dlg_addBookmark").removeClass("open");
                        $scope.cancel();
                        $rootScope.$broadcast('updateBookMarkTreeEvent');
                    }
                });
                //}
            });
        }
    }

}]);


mapModule.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, $http, $rootScope, $translate) {
    $scope.items = items;
    $scope.ok = function () {
        if ($scope.items != null && $scope.items.operation == "deleteBookmarkFolder") {
            var deleteBookMarkFolderList_URL = $rootScope.baseUrl;
            $http.get(deleteBookMarkFolderList_URL, { folderId: $scope.items.folderId, 'timeStamp': new Date().getTime() }).then(function (result) {
                if (result.data.msgId === 1) {
                    lnv.alert({
                        content: result.data.msg,
                        alertBtnText: $translate.instant('MAP.OK')
                    });
                    //toastr['error']('', result.data.msg, { closeButton: true });
                } else {
                    //toastr['success']('', $translate.instant("BOOKMARK.msg-bookmark-folder-deleted"), { closeButton: true });
                    lnv.alert({
                        content: $translate.instant("BOOKMARK.msg-bookmark-folder-deleted"),
                        alertBtnText: $translate.instant('MAP.OK')
                    });
                    $rootScope.$broadcast('updateBookMarkTreeEvent');
                }
            });
         } else if ($scope.items != null && $scope.items.operation == "deleteBookmark") {
             var deleteBookMark_URL = $rootScope.baseUrl + "Bookmark/m_deleteBookmark";
             $http.get(deleteBookMark_URL,
                 {
                     params: {
                         'userId': $rootScope.userInfo.userId,
                         'token': $rootScope.userInfo.token,
                         bookMarkId: $scope.items.bookMarkId,
                         'timeStamp': new Date().getTime()
                     }
                 }).then(function (result) {
                if (result.data.msgId === 1) {
                    //toastr['error']('', result.data.msg, { closeButton: true });
                    lnv.alert({
                        content: result.data.msg,
                        alertBtnText: $translate.instant('MAP.OK')
                    });
                } else {
                    //toastr['success']('', $translate.instant("BOOKMARK.msg-bookmark-deleted"), { closeButton: true });
                    lnv.alert({
                        content: $translate.instant("BOOKMARK.msg-bookmark-deleted"),
                        alertBtnText: $translate.instant('MAP.OK')
                    });
                    $rootScope.$broadcast('updateBookMarkTreeEvent');
                }
            });
        } 
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
