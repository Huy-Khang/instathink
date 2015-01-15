angular.module('eggly.models.bookmarks', [

])
  .service('bookmarks', function BookmarksService($http, $q) {

    /*
     *  fields
     */
    
    var URLS = {
          FETCH: 'data/bookmarks.json'
        };
    var bookmarks;
    var bookmarksModel = this;

    /*
     * private methods
     */

    function extract(result) {
      return result.data;
    }

    function cacheBookmarks(result) {
      bookmarks = extract(result);
      return bookmarks;
    }

    function findBookmark(bookmarkId) {
      return _.find(bookmarks, function (bookmark) {
        return bookmark.id === parseInt(bookmarkId, 10);
      })
    }


    /*
     * public methods
     */

    bookmarksModel.getBookmarks = function () {
      return (bookmarks) ? $q.when(bookmarks) : $http.get(URLS.FETCH).then(cacheBookmarks);
    };

    bookmarksModel.getBookmarkById = function (bookmarkId) {
      var deferred = $q.defer();
      if (bookmarks) {
        deferred.resolve(findBookmark(bookmarkId))
      } else {
        bookmarksModel.getBookmarks().then(function () {
          deferred.resolve(findBookmark(bookmarkId))
        })
      }
      return deferred.promise;
    };

    bookmarksModel.getBookmarksForCategory = function (category) {
      _.filter(bookmarks, function (b) {
        return b.category == category;
      });
    };

    bookmarksModel.createBookmark = function (bookmark) {
      bookmark.id = bookmarks.length;
      bookmarks.push(bookmark);
    };

    bookmarksModel.updateBookmark = function (bookmark) {
      var index = _.findIndex(bookmarks, function (b) {
        return b.id == bookmark.id
      });
      bookmarks[index] = bookmark;
    };

    bookmarksModel.deleteBookmark = function (bookmark) {
      _.remove(bookmarks, function (b) {
        return b.id == bookmark.id;
      });
    };




    

    
  })
;