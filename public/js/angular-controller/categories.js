angular.module('categories', [
    'eggly.models.categories'
])

    /*
     Config
     */

    .config(function ($stateProvider) {
        $stateProvider
            .state('eggly.categories', {
                url: '/',
                views: {
                    'categories@': {
                        controller: 'CategoriesCtrl',
                        templateUrl: 'app/module/categories/categories.tmpl.html'
                    },
                    'bookmarks@': {
                        controller: 'BookmarksCtrl',
                        templateUrl: 'app/module/bookmarks/bookmarks.tmpl.html'
                    }
                }
            });
    })

    /*
     Controllers
     */

    .controller('CategoriesCtrl', function CategoriesCtrl($scope, categories) {
        $scope.getCurrentCategoryName = categories.getCurrentCategoryName;

        categories.getCategories()
            .then(function (result) {
                $scope.categories = result;
            });

        $scope.isCurrentCategory = function (category) {
            return category.name === $scope.getCurrentCategoryName();
        }
    })
;