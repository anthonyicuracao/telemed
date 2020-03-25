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
        $scope, $rootScope, ArAPI, $filter) {
        var sys = $rootScope.sys;

        $scope.data = {};
        var data = $scope.data;

        $scope.clear = function () {
            data.cellLast4 = '';
            data.paid = false;
            data.verifyByCode = true;
            data.codeSent = false;
            data.codeVerified = false;
            data.pinCode = '';
            data.last4ssn = '';
            data.dob = null;
            data.mmn = '';
        };


        $scope.reset = function () {
            data.plan = null;
            data.price = 0;
            data.cust_id = '';

            $scope.clear();
        };

        $scope.reset();

        $scope.selectPlan = function () {
            if (data.plan === 'M') {
                data.price = 40;
            }
            else if (data.plan === '1') {
                data.price = 359;
            }
            else if (data.plan === '2') {
                data.price = 599;
            }
            else {
                data.price = 0;
            }

            return;
        }

        $scope.onChange = function (tag) {
            var x;

            if (data.curacao) {
                delete data.curacao;
            }

            if (tag === 'cust_id' && data.cust_id) {
                x = data.cust_id.replace(/[^0-9\-]/g, '');

                if (x.length > 8) {
                    x = x.slice(0, 8);
                }

                data.cust_id = x;

            }
            else if ('pinCode,last4ssn'.indexOf(tag) !== -1 && data[tag]) {
                x = data[tag].replace(/[^0-9\-]/g, '');

                if (x.length > 4) {
                    x = x.slice(0, 4);
                }

                data[tag] = x;
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
            else if (tag === 'dob2' && data.curacao) {
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
            else if ('pinCode,last4ssn'.indexOf(tag) !== -1 && data[tag]) {
                re = /^\d{4}$/;
                return re.test(data[tag]);
            }
            else if (tag === 'dob' && data[tag]) {
                console.log(data[tag])
                age = moment().diff(moment($filter('date')(new Date(data[tag]), 'yyyyMMdd'), 'YYYYMMDD'), 'years');
                return age >= 18;
            }
            else if (tag === 'mmn' && data[tag]) {
                return data[tag].length > 0;
            }
            else if (tag.indexOf('password') !== -1) {
                re = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
                return re.test(data[tag]);
            }
            else if (data.curacao) {
                return data.curacao[tag.toUpperCase()] && data.curacao[tag.toUpperCase()].toString().length > 0;

            }

            return false;
        };


        $scope.step2ok = function () {
            return $scope.step2buttonOk()
                && data.curacao
                ;
        };

        $scope.confirmButtonOk = function () {
            return data.curacao
                && $scope.isOk('f_name')
                && $scope.isOk('l_name')
                && $scope.isOk('email')
                && $scope.isOk('email2')
                && $scope.isOk('gender')
                && $scope.isOk('dob2')
                && $scope.isOk('cell')
                && $scope.isOk('street')
                && $scope.isOk('city')
                && $scope.isOk('state')
                && $scope.isOk('zip')
                && $scope.isOk('password')
                && $scope.isOk('password2')
                && data.password === data.password2
                ;
        };

        $scope.continueWithPlan = function () {
            $scope.clear();

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
                    pinCode: data.pinCode,
                    ssn: data.last4ssn,
                    dob: data.dob ? $filter('date')(new Date(data.dob), 'yyyy-MM-dd') : null,
                    mmaiden: data.mmn
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

        //pushTeleMed
        $scope.pushTeleMed = function () {
            data.curacao.PLAN = data.plan;
            data.curacao.pass = data.password;
            sys.ajax(
                ArAPI.pushTeleMed,
                data.curacao,
                function (obj) {
                    if (obj.OK) {
                        document.activeElement.blur();
                        console.log(obj);
                        data.paid = true;

                        Swal.fire({
                            title: '<strong class="text-primary">Thank you for your order!</strong>',
                            icon: 'success',
                            html:
                                'Your confirmation number is: <b>' + obj.INFO + '_' + obj.INV_NO + '</b><br /><br />' +
                                '<p class="fs-1">An email from Hello Alvin containing a link with setup instructions was sent to:</p>'
                                + '<a class="fs-1" href="mailto:' + data.curacao.EMAIL + '">' + data.curacao.EMAIL + '</a>',
                            showCloseButton: true,
                            confirmButtonText:
                                '<i class="fa fa-thumbs-up"></i> Great!',
                        }).then(() => {
                            $rootScope.$apply(function () {
                                $scope.reset();
                                window.scrollTo(0, 0);
                            });

                        })

                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: sys.toTitleCase(obj.INFO, 2),
                        })
                    }
                },
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

    //******** TEMP
    keytest = 'zzztest';
    sys.testMode = true;
    //******** TEMP



    return sys.testMode ? keytest : keyprod;

}

