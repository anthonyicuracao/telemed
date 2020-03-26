var app = angular.module('telemed', [
    'ngResource',
    'pascalprecht.translate'
]);

app.run(function ($rootScope, $translate) {
    $rootScope.sys = {
        idioma: 'en',
};
    var sys = $rootScope.sys;

    sys.ajax = function (method, json, success, failure, message) {
        sys.loadingText = message || 'Loading';
        sys.loading = true;

        var ajaxOk = function (obj) {
            sys.loading = false;

            if (success) {
                success(obj);
            }
        };

        var ajaxErr = function (obj) {
            sys.loading = false;

            if (failure) {
                failure(obj);
            }
        };

        method(
            json,
            ajaxOk,
            ajaxErr
        );
    };

    sys.toTitleCase = function (str, len) {
        return str ? str.replace(/\w\S*/g, function (txt) {
            if (txt.length > (len || 3)) {
                txt = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
            return txt;
        }) : '';
    };

    //set idioma
    sys.setIdioma = function (idioma) {
        if (sys.idioma === 'en') {
            sys.idioma = 'es';
        } else {
            sys.idioma = 'en';
        }

        $translate.use(sys.idioma);
        event.stopPropagation();
    }

});

app.value('version', '0.1');
