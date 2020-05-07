var app = angular.module('telemed', [
    'ui.router',
    'ngResource',
    'pascalprecht.translate',
    'gavruk.card'
]);

app.run(function ($rootScope, $translate) {
    $rootScope.sys = {
        idioma: 'en',
    };

    var sys = $rootScope.sys;

    var url_string = window.location.href;
    var url = new URL(url_string);

    console.log(url)

    if (url.port && '5500,5501,8000,8100'.indexOf(url.port) !== -1) {
        sys.testMode = true;
    }

    if (url && url.searchParams && url.searchParams.get('test') !== null) {
        sys.testMode = url.searchParams.get('test') === 'true';
    }

    if (url && url.searchParams && url.searchParams.get('l') === 'es') {
        sys.idioma = 'es';
        $translate.use(sys.idioma);
    }

    if (url && url.searchParams && url.searchParams.get('cc') === 'true' ||
        url.hostname === 'curacao-telemed-cc.azurewebsites.net') {
        sys.cc = true;
    }

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
        console.log(0, idioma);

        if (sys.idioma === 'en') {
            sys.idioma = 'es';
        } else {
            sys.idioma = 'en';
        }

        $translate.use(sys.idioma);

        if (event) {
            event.stopPropagation();
        }
    }

    sys.getIdioma = function () {
        return (sys.idioma === 'en' ? 'eng' : 'esp');
    }

});

app.value('version', '0.1');
