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

function sysDynHeader(sys, keyprod, keytest) {
    //console.log(102, sys)

    keyprod = keyprod || 'PROD-b6JH1h381JMNbyW';
    keytest = keytest || 'TEST-Q92m8xyc8NhxI5K';

    var url_string = window.location.href;
    var url = new URL(url_string);

    if (url && url.searchParams && url.searchParams.get('sysmode') === 'local') {
        keyprod = 'zzzprod';
        keytest = 'zzztest';
    }

    if (url && url.searchParams && url.searchParams.get('test') === 'true') {
        sys.testMode = true;
    }

    if (url.port && '5500,5501,8000,8100'.indexOf(url.port) !== -1) {
        keyprod = 'zzzprod';
        keytest = 'zzztest';
    }

    sys.keyprod = keyprod;
    sys.keytest = keytest;

    //******** TEMP
    //keytest = 'zzztest';
    //sys.testMode = true;
    //******** TEMP



    return sys.testMode ? keytest : keyprod;

}

