angular.module('bookmarks', [
  'categories.bookmarks.edit',
  'categories.bookmarks.create',
  'eggly.models.categories',
  'eggly.models.bookmarks'
])

  /*
    Config
   */
  
  .config(function ($stateProvider) {
    $stateProvider
      .state('eggly.categories.bookmarks', {
        url: 'categories/:category',
        views: {
          'bookmarks@': {
            controller: 'BookmarksCtrl',
            templateUrl: 'app/module/bookmarks/bookmarks.tmpl.html'
          }
        }
      })
    ;
  })

  /*
    Controller
   */

  .controller('BookmarksCtrl', function BookmarksCtrl($scope, $stateParams, bookmarks, categories) {
    categories.setCurrentCategory();

    if ($stateParams.category) {
      categories.getCategoryByName($stateParams.category).then(function (category) {
        categories.setCurrentCategory(category);
      })
    }

    bookmarks.getBookmarks()
      .then(function (result) {
        $scope.bookmarks = result;
      });

    /*
      public methods
     */
    $scope.getCurrentCategory = categories.getCurrentCategory;
    $scope.getCurrentCategoryName = categories.getCurrentCategoryName;
    $scope.deleteBookmark = bookmarks.deleteBookmark;
    $scope.isSelectedBookmark = function (bookmarkId) {
      return $stateParams.bookmarkId == bookmarkId;
    };
  })
;

