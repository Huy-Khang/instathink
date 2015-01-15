var instathinkApp = angular.module('Instathink', [
  'ngAnimate',
  'ui.router',
  'categories',
  'bookmarks'
  //'chatpane',
  //'ChatBoxController'
  //'feed',
  //'topnavbar'
]);

instathinkApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/feed");
    $stateProvider
        .state('feed', {
            url: "/feed",
            templateUrl: "app/module/feed/feed.tmpl.html"
            //controller: FeedController

        })
        .state('chatbox', {
            url: "/chatbox",
            templateUrl: "app/module/chat-box/chat-box.tmpl.html"
            //controller: ChatBoxController

        })
            .state('profile', {
            url: "/profile",
            templateUrl: "app/module/userprofile/userprofile.tmpl.html"
            //controller: ChatBoxController

        });
}]);

instathinkApp.controller('MainController', [function() {
    var self = this;
    self.navBarTemplate = "app/module/navbar/navbar.tmpl.html";
    self.chatPaneTemplate = "app/module/chat-pane/chat-pane.tmpl.html";
}]);