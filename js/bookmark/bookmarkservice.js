/**
 * 
 */

mapModule.service('bookmarkservice', ['$http', '$rootScope', function($http, $rootScope){
    	
	var baseUrl = $rootScope.baseUrl;
	var locale = $rootScope.language;
    	
	this.userLogin = function(username,password) {
		return $http.post(baseUrl + "Account/m_Login", { username: username, password: password}).then(function (result) {
           		return result;
       		});
	};
	
	this.getAllBookmarksFoldersAndBookmarks = function(userId, token) {
	   return $http.post(baseUrl + "BookMark/m_GetBookMarkFolderList", { userId: userId, token: token, locale: locale}).then(function (result) {
	           return result;
	       });
	};
	
	this.deleteBookmark = function(bookmarkId, userId, token) {
 	   return $http.post(baseUrl + "BookMark/m_deleteBookmark", { bookmarkId: bookmarkId, userId: userId, token: token, locale: locale}).then(function (result) {
 	           return result;
 	       });
 	};
 	
 	this.deleteBookmarkFolder = function(folderId, userId, token) {
  	   return $http.post(baseUrl + "BookMark/m_deleteBookmarkFolder", { folderId: folderId, userId: userId, token: token, locale: locale}).then(function (result) {
  	           return result;
  	       });
  	};
  	
  	this.saveBookmark = function(bookmark, userId, token) {
   	   return $http.post(baseUrl + "BookMark/m_saveBookmark", { bookmark: bookmark, userId: userId, token: token, locale: locale}).then(function (result) {
   	           return result;
   	       });
   	};
   	
   	this.saveBookmarkFolder = function(bookmarkfolder, userId, token) {
	   return $http.post(baseUrl + "BookMark/m_saveBookmarkFolder", { bookmarkfolder: bookmarkfolder, userId: userId, token: token, locale: locale}).then(function (result) {
	           return result;
	       });
	};
}]);