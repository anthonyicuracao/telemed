var app = angular.module('telemed', [
    'ngResource'
])

    .factory('ArAPI', function ($resource, $rootScope) {
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

    .run(function ($rootScope) {
        $rootScope.sys = {};
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
    })

    .controller('telemed-ctrl', function (
        //$scope, $rootScope, $stateParams, $state, $timeout, WebAPI, $document, $localStorage, $filter) {
        $scope, $rootScope, ArAPI) {
        var sys = $rootScope.sys;

        $scope.data = {};
        var data = $scope.data;

        $scope.reset = function () {
            data.cust_id = '';
            data.cellLast4 = '';
            data.plan = null;
            data.paid = false;
            data.verifyByCode = true;
            data.codeSent = false;
            data.codeVerified = false;
            data.pinCode = '';
        };

        $scope.reset();

        $scope.onChange = function (field) {
            var x;

            if (data.curacao) {
                delete data.curacao;
            }

            if (field === 'cust_id' && data.cust_id) {
                x = data.cust_id.replace(/[^0-9\-]/g, '');

                if (x.length > 8) {
                    x = x.slice(0, 8);
                }

                data.cust_id = x;

            }
        };

        $scope.isOk = function (tag) {
            var age;
            var re;

            if (tag === 'cust_id') {
                return data.cust_id.toString().length === 7 || data.cust_id.toString().length === 8;
            }
            else if (tag === 'email2') {
                return data.curacao
                    && data.curacao[tag.toUpperCase()]
                    && data.curacao[tag.toUpperCase()].toString().length > 0
                    && data.curacao.EMAIL.toUpperCase() === data.curacao.EMAIL2.toUpperCase();
            }
            else if (tag === 'dob' && data.curacao) {
                age = moment().diff(moment($filter('date')(new Date(data.curacao.DOB), 'yyyyMMdd'), 'YYYYMMDD'), 'years');

                return age >= 18;
            }
            else if (tag === 'cell' && data.curacao) {
                re = /^\(?\d{3}\)?\d{3}-?\d{4}$/;
                return re.test(data.curacao.CELL);
            }
            else if (tag === 'state' && data.curacao) {
                return data.curacao.STATE && data.curacao.STATE.length === 2;
            }
            else if (tag === 'zip' && data.curacao) {
                return data.curacao.ZIP && data.curacao.ZIP.length === 5;
            }
            else if (data.curacao) {
                return data.curacao[tag.toUpperCase()] && data.curacao[tag.toUpperCase()].toString().length > 0;

            }

        };

        $scope.continueWithPlan = function (cust_id) {
            sys.ajax(
                ArAPI.pullTeleMed,
                {
                    cust_id: data.cust_id,
                    pullCell: true
                },
                function (obj) {
                    if (obj.OK) {
                        //console.log(obj);
                        document.activeElement.blur();
                        data.cellLast4 = obj.DATA.CELLLAST4;

                        data.codeSent = false;
                        $('#account-verification').modal('show');

                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: obj.INFO
                        });
                    }
                },
                function (obj) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unable to contact our servers!',
                        text: 'Please try later!'
                    });
                }

            );

        };

        $scope.sendCode = function () {
            sys.ajax(
                ArAPI.teleMedSendCode,
                {
                    cust_id: data.cust_id,
                    generatePinCode: true
                },
                function (obj) {
                    if (obj.OK) {
                        console.log(obj);
                        document.activeElement.blur();
                        data.codeSent = true;
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: obj.INFO
                        });
                    }
                },
                function (obj) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unable to contact our servers!',
                        text: 'Please try later!'
                    });
                }

            );
        };

        $scope.verifyCode = function () {
            sys.ajax(
                ArAPI.pullTeleMed,
                {
                    cust_id: data.cust_id,
                    pinCode: data.pinCode
                },
                function (obj) {
                    if (obj.OK) {
                        //console.log(obj);
                        document.activeElement.blur();
                        data.codeVerified = true;

                        obj.DATA.CITY = sys.toTitleCase(obj.DATA.CITY);
                        obj.DATA.EMAIL = obj.DATA.EMAIL.toLowerCase();
                        obj.DATA.EMP_NAME = sys.toTitleCase(obj.DATA.EMP_NAME);
                        obj.DATA.F_NAME = sys.toTitleCase(obj.DATA.F_NAME);
                        obj.DATA.L_NAME = sys.toTitleCase(obj.DATA.L_NAME);
                        obj.DATA.STREET = sys.toTitleCase(obj.DATA.STREET, 2);
                        data.curacao = obj.DATA;
                        data.curacao.DOB = new Date(moment.tz(data.curacao.DOB, "America/Los_Angeles").format());
                        data.curacao.EMAIL2 = '';

                        console.log(data.curacao);
                        $('#account-verification').modal('hide');

                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: obj.INFO
                        });
                    }
                },
                function (obj) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unable to contact our servers!',
                        text: 'Please try later!'
                    });
                }

            );
        };


    })
    .value('version', '0.1');

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

    return sys.testMode ? keytest : keyprod;

}

