// Side Navgiation
$(document)
    .ready(function() {
        $("html, body")
            .animate({
                scrollTop: 0
            }, "slow");
        $("#dismiss, .sidebarBg")
            .on("click", function() {
                $("#sidebar")
                    .removeClass("active");
                $(".sidebarBg")
                    .removeClass("active");
            });
        $("#sidebarCollapse")
            .on("click", function() {
                $("#sidebar")
                    .addClass("active");
                $(".sidebarBg")
                    .addClass("active");
                $(".collapse.in")
                    .toggleClass("in");
                $("a[aria-expanded=true]")
                    .attr("aria-expanded", "false");
            });
    });

// Collapse

function collapseFn(x) {
    if (x.classList.contains("collapsed") === true) {
        x.classList.remove("collapsed");
    } else {
        x.classList.add("collapsed");
    }
}

// Animate CSS

$(window).scroll(function() {
    $("nav").toggleClass("scrolled", $(this).scrollTop() > 1);
    $(".animateImg").toggleClass("animated zoomIn", $(this).scrollTop() > 450);
});

// Toggle Password Visibility

var togglePw = document.getElementsByClassName("toggle-password");
var inputPw = document.getElementById("password");
if (typeof togglePw !== "undefined" && togglePw !== null) {
    if (typeof inputPw !== "undefined" && inputPw !== null) {
        for (let i = 0; i < togglePw.length; i++) {
            var j = i;
            viewPasswordFunction(togglePw, inputPw, j);
        }
    }
}

function viewPasswordFunction(a, b, c) {
    a[c].addEventListener("click", function(event) {
        a[c].classList.toggle("fa-eye-slash");
        if (typeof b !== "undefined" && b !== null) {
            if (b.type === "password") {
                b.type = "text";
            } else {
                b.type = "password";
            }
        }
    });
}

// Privacy Policy

var privacyPolicyContinue = document.getElementsByClassName("privacyPolicyContinue");
var privacyPolicyCheckbox = document.getElementsByClassName("privacyPolicyCheckbox");
var privacyPolicyGroup = document.getElementsByClassName("privacyPolicyGroup");

function privacyPolicyFunction(privacyPolicyContinue, privacyPolicyCheckbox, privacyPolicyGroup) {
    if (typeof privacyPolicyGroup !== "undefined" && privacyPolicyGroup !== null) {
        for (let i = 0; i < privacyPolicyCheckbox.length; i++) {
            var j = i;
            privacyPolicyFunction2(privacyPolicyGroup, privacyPolicyCheckbox, j, privacyPolicyContinue);
        }
    }
}

function privacyPolicyFunction2(a, b, c, d) {
    a[c].addEventListener("click", function() {
        if (b[c].checked === true) {
            d[c].removeAttribute("disabled");
        } else {
            d[c].setAttribute("disabled", true);
        }
    });
}

privacyPolicyFunction(privacyPolicyContinue, privacyPolicyCheckbox, privacyPolicyGroup);

// Floating Action Button

var fab = document.getElementById("fab");
if (typeof fab != "undefined" && fab != null) {
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            fab.setAttribute("style", "display: block; transition: all .3s;")
        } else {
            fab.setAttribute("style", "display: none; transition: all .3s;")
        }
    };


}
$("#fab")
    .on("click", function(e) {
        var href = $(this)
            .attr("href");
        $("html, body")
            .animate({
                scrollTop: $(href)
                    .offset()
                    .top
            }, "slow");
    });

// New Billing Address

function billingAddressFn() {
    var sameBilling = document.getElementById("sameBilling");
    var addAddress = document.getElementById("addAddress");
    if (typeof sameBilling != "undefined" && sameBilling != null && addAddress != "undefined" && addAddress != null && sameBilling.checked === true) {
        addAddress.setAttribute("style", "display: none;");
    } else {
        addAddress.setAttribute("style", "display: block;");
    }
}

// Radio Button Controls Label

var information = document.getElementById("information");
var option1 = document.getElementById("thirtyFour1");
var option4 = document.getElementById("thirtyFour2");
var option2 = document.getElementById("thirtyFour3");
var option3 = document.getElementById("thirtyFour4");
var label = document.getElementById("insideLabel");
if (typeof option1 != "undefined" && option1 != null && information != "undefined" && information) {
    option1.addEventListener("click", function() {
        radioFn();
    });
}
if (typeof option2 != "undefined" && option2 != null && information != "undefined" && information) {
    option2.addEventListener("click", function() {
        radioFn();
    });
}
if (typeof option3 != "undefined" && option3 != null && information != "undefined" && information) {
    option3.addEventListener("click", function() {
        radioFn();
    });
}
if (typeof option4 != "undefined" && option4 != null && information != "undefined" && information) {
    option4.addEventListener("click", function() {
        radioFn();
    });
}

function radioFn() {
    if (typeof option1 != "undefined" && option1 != null && option1.checked === true) {
        label.innerHTML = "Account number";
        information.setAttribute("type", "text");
        information.removeEventListener('keydown', enforceFormat);
        information.removeEventListener('keyup', formatToPhone);
        information.removeEventListener('blur', formatToPhone);
    } else if (typeof option2 != "undefined" && option2 != null && option2.checked === true) {
        label.innerHTML = "Email address";
        information.setAttribute("type", "email");
        information.removeEventListener('keydown', enforceFormat);
        information.removeEventListener('keyup', formatToPhone);
        information.removeEventListener('blur', formatToPhone);
    } else if (typeof option3 != "undefined" && option3 != null && option3.checked === true) {
        label.innerHTML = "Phone number";
        information.setAttribute("type", "tel");
        var typeTel = document.querySelectorAll("input[type='tel']");
        if (typeof typeTel !== "undefined" && typeTel !== null) {
            for (var i = 0; i < typeTel.length; i++) {
                let tel = typeTel[i];
                tel.addEventListener('keydown', enforceFormat);
                tel.addEventListener('keyup', formatToPhone);
                tel.addEventListener('blur', formatToPhone);
            }
        }
    } else if (typeof option4 != "undefined" && option4 != null && option4.checked === true) {
        label.innerHTML = "Username";
        information.setAttribute("type", "text");
        information.removeEventListener('keydown', enforceFormat);
        information.removeEventListener('keyup', formatToPhone);
        information.removeEventListener('blur', formatToPhone);
    } else {
        console.log('Error in "payments.js"');
    }
}

// Format Phone Number

const isNumericInput = (event) => {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
};
const isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (

            // Allow Ctrl/Command + A,C,V,X,Z
            (event.ctrlKey === true || event.metaKey === true) && (key === 65 || key === 67 || key === 86 || key === 88 || key === 90));
};
const enforceFormat = (event) => {

    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
        event.preventDefault();
    }
};
const formatToPhone = (event) => {
    if (isModifierKey(event)) {
        return;
    }
    const target = event.target;
    const input = event.target.value.replace(/\D/g, '')
        .substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);
    if (input.length > 6) {
        target.value = `(${zip}) ${middle} - ${last}`;
    } else if (input.length > 3) {
        target.value = `(${zip}) ${middle}`;
    } else if (input.length > 0) {
        target.value = `(${zip}`;
    }
};

var isTel = document.querySelectorAll("input[type='tel']");
if (typeof isTel !== "undefined" && isTel !== null) {
    for (var i = 0; i < isTel.length; i++) {
        let tel = isTel[i];
        tel.addEventListener('keydown', enforceFormat);
        tel.addEventListener('keyup', formatToPhone);
        tel.addEventListener('blur', formatToPhone);
        tel.addEventListener('keyup', function() {
            this.setAttribute("value", this.value);
        });
        tel.addEventListener('blur', function() {
            this.setAttribute("value", this.value);
        });
    }
}

// See More

function showMore(x, y, u, z) {
    if (typeof x !== "undefined" && x !== null && typeof y !== "undefined" && y !== null) {
        if (document.getElementById(x)
            .style.display === "none") {
            document.getElementById(x)
                .removeAttribute("style");
            document.getElementById(y)
                .innerHTML = z;
        } else {
            document.getElementById(x)
                .setAttribute("style", "display: none;");
            document.getElementById(y)
                .innerHTML = u;
        }
    }
}

// Format Date
var isDate = document.getElementsByClassName("is-date");
if (typeof isDate !== "undefined" && isDate !== null) {
    for (let i = 0; i < isDate.length; i++) {
        var j = isDate[i];
        testFn(j);
    }
}

function testFn(x) {
    x.addEventListener("input", function(e) {
        this.type = "text";
        var input = this.value;
        if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
        var values = input.split("/")
            .map(function(v) {
                return v.replace(/\D/g, "");
            });
        if (values[0]) values[0] = checkValue(values[0], 12);
        if (values[1]) values[1] = checkValue(values[1], 31);
        var output = values.map(function(v, i) {
            return v.length == 2 && i < 2 ? v + " / " : v;
        });
        this.value = output.join("")
            .substr(0, 14);
    });
    x.addEventListener("blur", function(e) {
        this.type = "text";
        var input = this.value;
        var values = input.split("/")
            .map(function(v, i) {
                return v.replace(/\D/g, "");
            });
        var output = "";
        if (values.length == 3) {
            var year = values[2].length !== 4 ? parseInt(values[2]) + 2000 : parseInt(values[2]);
            var month = parseInt(values[0]) - 1;
            var day = parseInt(values[1]);
            var d = new Date(year, month, day);
            if (!isNaN(d)) {
                x.innerText = d.toString();
                var dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
                output = dates.map(function(v) {
                        v = v.toString();
                        return v.length == 1 ? "0" + v : v;
                    })
                    .join(" / ");
            }
        }
        this.value = output;
        this.setAttribute('value', output);
    });
}




function checkValue(str, max) {
    if (str.charAt(0) !== "0" || str == "00") {
        var num = parseInt(str);
        if (isNaN(num) || num <= 0 || num > max) num = 1;
        str = num > parseInt(max.toString()
                .charAt(0)) && num.toString()
            .length == 1 ? "0" + num : num.toString();
    }
    return str;
}

// Format Currency

$("input[data-type='currency']")
    .on({
        keyup: function() {
            formatCurrency($(this));
        },
        blur: function() {
            formatCurrency($(this), "blur");
            this.setAttribute("value", this.value);
        }
    });

function formatNumber(n) {
    return n.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
    let input_val = input.val();
    if (input_val === "") {
        return;
    }
    let original_len = input_val.length;
    let caret_pos = input.prop("selectionStart");
    if (input_val.indexOf(".") >= 0) {
        let decimal_pos = input_val.indexOf(".");
        let left_side = input_val.substring(0, decimal_pos);
        let right_side = input_val.substring(decimal_pos);
        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);
        if (blur === "blur") {
            right_side += "00";
        }
        right_side = right_side.substring(0, 2);
        input_val = "$" + left_side + "." + right_side;
    } else {
        input_val = formatNumber(input_val);
        input_val = "$" + input_val;
        if (blur === "blur") {
            input_val += ".00";
        }
    }
    input.val(input_val);
    let updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}