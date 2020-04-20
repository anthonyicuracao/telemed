app.factory('ArAPI', function ($resource, $rootScope) {
    var sys = $rootScope.sys;
    var server = 'https://exchangeweb.lacuracao.com:2007/ws1/restapi/projects';

    function dynHeader() {
        return sysDynHeader(sys);
    }


    var header = {
        'X-Api-Key': dynHeader,
        'Content-Type': 'application/json'
    };

    return $resource('', {},
        {
            pullTeleMed: {
                method: 'POST',
                headers: header,
                isArray: false,
                url: server + '/pullTeleMed'
            },
            pushTeleMed: {
                method: 'POST',
                headers: header,
                isArray: false,
                url: server + '/pushTeleMed'
            },
            teleMedSendCode: {
                method: 'POST',
                headers: header,
                isArray: false,
                url: server + '/teleMedSendCode'
            }
        });
})

function sysDynHeader(sys) {
    var keyprod = keyprod || 'PROD-b6JH1h381JMNbyW';
    var keytest = keytest || 'TEST-Q92m8xyc8NhxI5K';

    var url_string = window.location.href;
    var url = new URL(url_string);

    if (url && url.searchParams && url.searchParams.get('local') === 'true') {
        keyprod = 'zzzprod';
        keytest = 'zzztest';
    }

    return sys.testMode ? keytest : keyprod;
}

