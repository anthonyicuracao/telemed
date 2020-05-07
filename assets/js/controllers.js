app.controller('telemed-ctrl', function ($scope, $rootScope, ArAPI, $filter, $translate) {
    var sys = $rootScope.sys;

    $scope.data = {};
    var data = $scope.data;

    var url_string = window.location.href;
    var url = new URL(url_string);

    if (url && url.searchParams && url.searchParams.get('l') === 'es') {
        sys.idioma = 'es';
        $translate.use(sys.idioma);
    }

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
        data.termsOk = false;
        data.cc = false;
        data.paymentMethod = '';
    };

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

    $scope.reset = function () {
        data.plan = null;
        data.price = 0;
        data.cust_id = '';
        data.dob = null;
        data.emp_id = '';

        $scope.clear();

        if (sys.cc) {
            data.cc = true;
            data.paymentMethod = 'cc';

            data.curacao = {
                CELL: "",
                CITY: "",
                CUST_ID: "500-8777",
                DOB: null,
                EMAIL: "",
                F_NAME: "",
                GENDER: "",
                L_NAME: "",
                STATE: "",
                STREET: "",
                ZIP: "",
                SANDBOX: sys.testMode
            };
            data.codeVerified = true;
            data.curacao.EMAIL2 = '';

            data.card = {
                name: '',
                number: '',
                expiry: '',
                expiryMonth: '',
                expiryYear: '',
                cvc: '',
                dataValue: null,
                dataDescriptor: null
            };

            if (sys.testMode) {
                data.codeVerified = true;
                data.password = 'Tony0000';
                data.password2 = 'Tony0000';
                data.plan = '1';
                $scope.selectPlan();
                data.curacao = {
                    CELL: "2134345858",
                    CITY: "Alhambra",
                    CUST_ID: "500-8777",
                    DOB: new Date(1967, 3, 15),
                    EMAIL: "tony@bretado.com",
                    EMAIL2: "tony@bretado.com",
                    F_NAME: "Tony",
                    GENDER: "M",
                    L_NAME: "Bretado",
                    STATE: "CA",
                    STREET: "714 W Commonwealth Ave Unit B",
                    ZIP: "91801",
                    SANDBOX: sys.testMode
                };

                data.card = {
                    name: 'Tony Bretado',
                    number: '4111 1111 1111 1111',
                    expiry: '10 / 2020',
                    expiryMonth: '10',
                    expiryYear: '2020',
                    cvc: '900',
                    dataValue: null,
                    dataDescriptor: null
                };
            }
        }
    };

    $scope.reset();

    $scope.cardPlaceholders = {
        name: 'Your Full Name',
        number: 'xxxx xxxx xxxx xxxx',
        expiry: 'MM/YYYY',
        cvc: 'xxx'
    };

    $scope.cardMessages = {
        validDate: 'valid\nthru',
        monthYear: 'MM/YYYY',
    };

    $scope.cardOptions = {
        debug: false,
        formatting: true
    };

    $scope.getIdioma = function () {
        return (sys.idioma === 'en' ? 'eng' : 'esp');
    }

    $scope.onChange = function (tag) {
        var x;

        if (tag === 'name' && data.curacao) {
            data.card.name = data.curacao.F_NAME + ' ' + data.curacao.L_NAME

        }
        else if (tag === 'cc-number' && data.card.number) {
            x = data.card.number;

            if (x.length > 19) {
                x = x.slice(0, 19);
            }

            data.card.number = x;
        }
        else if (data.curacao) {
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
        else if (tag === 'emp_id') {
            return data.emp_id && data.emp_id.length === 3;
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
        else if (tag === 'cc-number' && data.card && data.card.number) {
            return data.card.number.length >= 14; //including spaces
        }
        else if (tag === 'cc-month' && data.card && data.card.expiryMonth) {
            return data.card.expiryMonth.length === 2;
        }
        else if (tag === 'cc-year' && data.card && data.card.expiryYear) {
            return data.card.expiryYear.length === 4;
        }
        else if (tag === 'cc-cvc' && data.card && data.card.cvc) {
            return data.card.cvc.length >= 3;
        }
        // last one
        else if (data.curacao) {
            return data.curacao[tag.toUpperCase()] && data.curacao[tag.toUpperCase()].toString().length > 0;

        }

        return false;
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
            && data.termsOk
            && (!data.cc || (
                $scope.isOk('cc-number')
                && $scope.isOk('cc-month')
                && $scope.isOk('cc-year')
                && $scope.isOk('cc-cvc')
            ))
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

                    if (sys.testMode) {
                        data.curacao.EMAIL2 = data.curacao.EMAIL;
                        data.curacao.GENDER = 'M';
                        data.password = 'Tony0000';
                        data.password2 = 'Tony0000';
                        data.paymentMethod = data.cc ? 'cc' : 'curacao';
                        data.plan = '1';
                        $scope.selectPlan();
                    }

                    console.log(data.curacao);
                    $('#account-verification').on('hidden.bs.modal', function (e) {
                        console.log(-20)
                        document.getElementById('editCollapseParentOne').scrollIntoView();
                        window.scrollBy(0, -50)
                    }) 
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

    $scope.scrollTo = function (tag) {
        console.log(tag)
        document.getElementById(tag).scrollIntoView();
        window.scrollBy(0, -50)
    }

    if (sys.testMode && !data.cc) {
        data.cust_id = '571-8214';
        data.last4ssn = '6680';
        $scope.verifyCode();
    }

    $scope.handleAnetInfo = function (o) {
        console.log(1, o);

        if (o.messages.resultCode === "Error") {
            var i = 0;
            var error = '';

            while (i < o.messages.message.length) {
                error += o.messages.message[i].code + ": " +
                    o.messages.message[i].text + '; '
                i = i + 1;
            }

            Swal.fire({
                icon: 'error',
                title: error
            });
        }
        else {
            data.curacao.anet = o.opaqueData;
            $scope.pushTeleMed();
        }
    }

    $scope.goAnet = function () {
        if (data.cc) {
            var authDataSandbox = {
                clientKey: "87qJE9HqQx8dybaL397DGJ58kpp4LC64N56FuKnEZ7aq6JqrwrH476M3uA8T5SmV",
                apiLoginID: "55uNBcE4tXD"
            };

            var authDataProduction = {
                //clientKey: "6AJM9Bnx7TS4678nfWP84bmvRe6BDBR4Lmcf2dUCEg9bz4sn2htCaY4hS4P43gp4",
                //apiLoginID: "57g9XLk5HG"
                clientKey: "test-Bnx7TS4678nfWP84bmvRe6BDBR4Lmcf2dUCEg9bz4sn2htCaY4hS4P43gp4",
                apiLoginID: "test-Lk5HG"
            };

            var authData = sys.testMode ? authDataSandbox : authDataProduction;

            var cardData = {
                cardNumber: data.card.number.replace(/[^0-9\-]/g, ''),
                month: data.card.expiryMonth,
                year: data.card.expiryYear.slice(-2),
                cardCode: data.card.cvc
            };

            var secureData = {
                authData: authData,
                cardData: cardData
            };

            console.log(secureData);

            Accept.dispatchData(secureData, $scope.handleAnetInfo);
        }
        else {
            $scope.pushTeleMed();
        }
    }


    //pushTeleMed
    $scope.pushTeleMed = function () {
        data.curacao.PLAN = data.plan;
        data.curacao.pass = data.password;

        Swal.fire({
            icon: 'info',
            title: 'Creating Order',
            html: 'Please wait until we display the results.',
            timer: 1000 * 60 * 5,
            onBeforeOpen: () => {
                data.loading = true;
                Swal.showLoading()
            },
            onClose: () => {
                console.log(22)
            }
        }).then((result) => {
            console.log(11, result)
        })


        sys.ajax(
            ArAPI.pushTeleMed,
            data.curacao,
            function (obj) {
                if (obj.OK) {
                    document.activeElement.blur();
                    console.log(obj);
                    data.paid = true;

                    if (data.loading) {
                        Swal.close()
                    }

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
            function () {
                if (data.loading) {
                    Swal.close()
                }
            }
        );
    };

    $scope.createOrder = function (data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: $scope.data.price.toString()
                }
            }]
        });
    }

    $scope.onApprove = function (o, actions) {
        console.log(o, actions)
        data.curacao.paypal = {};
        data.curacao.paypal.approval = o;
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
            console.log(details)
            data.curacao.paypal.capture = details;
            $scope.pushTeleMed();
            //// This function shows a transaction success message to your buyer.
            ////alert('Transaction completed by ' + details.payer.name.given_name);
            //Swal.fire({
            //    title: '<strong class="text-primary">Thank you for your order!</strong>',
            //    icon: 'success',
            //    html: 'Transaction completed by : <b>' + details.payer.name.given_name + '</b>',
            //    showCloseButton: true,
            //    confirmButtonText:
            //        '<i class="fa fa-thumbs-up"></i> Great!',
            //}).then(() => {
            //    //$rootScope.$apply(function () {
            //    //    $scope.reset();
            //    //    window.scrollTo(0, 0);
            //    //});

            //})
        });
    }

    paypal.Buttons(
        {
            createOrder: $scope.createOrder,
            onApprove: $scope.onApprove
        }
    ).render('#paypal-button-container');

})

