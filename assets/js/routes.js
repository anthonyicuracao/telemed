app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "home.html",
            controller: 'telemed-ctrl',
        })
        ;
});
