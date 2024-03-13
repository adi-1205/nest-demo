class Handlers {
    static registrationHandler() {

        $('#register-btn').click(onRegisterBtnClick)
        $('#username').change(validateUsername).keyup(validateUsername)
        $('#email').change(validateEmail).keyup(validateEmail)
        $('#password').change(validatePassword).keyup(validatePassword)

        async function onRegisterBtnClick(e) {
            if (validateRegister()) {
                try {
                    let data = await Helpers.ajx(location.href, {
                        formData: {
                            email: $('#email').val().trim(),
                            username: $('#username').val().trim(),
                            password: $('#password').val().trim(),
                        }
                    })
                    console.log(data);
                    if (data.success) {
                        location.href = '/auth/check-email'
                    }
                } catch (err) {
                    console.log(err);
                    if (err.responseJSON.statusCode == 500) {
                        toastr.error('Something went wrong :(')
                    }
                    if (err.responseJSON.message == 'email exist') {
                        toastr.error('Email already exist')
                    }
                }
            }
        }

        function validateRegister() {
            const usernameIsValid = validateUsername();
            const emailIsValid = validateEmail();
            const passwordIsValid = validatePassword();

            return usernameIsValid && emailIsValid && passwordIsValid
        }

        function validateUsername() {
            const v = validator;
            const usernameField = $('#username').val().trim();
            if (!v.isEmpty(usernameField) && v.isLength(usernameField, { min: 5 })) {
                Helpers.setValidField($('#username'));
                return true;
            } else {
                Helpers.setInvalidField($('#username'));
                return false;
            }
        }

        function validateEmail() {
            const v = validator;
            const emailField = $('#email').val().trim();
            if (!v.isEmpty(emailField) && v.isEmail(emailField)) {
                Helpers.setValidField($('#email'));
                return true;
            } else {
                Helpers.setInvalidField($('#email'));
                return false;
            }
        }

        function validatePassword() {
            const v = validator;
            const passwordField = $('#password').val().trim();
            if (!v.isEmpty(passwordField) && v.isStrongPassword(passwordField)) {
                Helpers.setValidField($('#password'));
                return true;
            } else {
                Helpers.setInvalidField($('#password'));
                return false;
            }
        }
    }

    static loginHandler() {

        $('#login-btn').click(onLoginBtnClick)

        async function onLoginBtnClick(e) {
            if (validateLogin()) {
                console.log('ajx');
                try {
                    let data = await Helpers.ajx(location.href, {
                        formData: {
                            email: $('#email').val().trim(),
                            password: $('#password').val().trim(),
                        }
                    })
                    if (data.success) {
                        location.href='/todos'
                    }
                } catch (err) {
                    console.log(err);
                    let resJSON = err.responseJSON
                    switch (resJSON.statusCode) {
                        case 500:
                            toastr.error('Something went wrong :(')
                            break;
                        case 401:
                            toastr.error('Invalid email or password')
                            break;

                    }
                }
            }
        }

        function validateLogin() {
            const emailIsValid = validateEmail();
            const passwordIsValid = validatePassword();

            return emailIsValid && passwordIsValid
        }

        function validateEmail() {
            const v = validator;
            const emailField = $('#email').val().trim();
            if (!v.isEmpty(emailField)) {
                Helpers.setValidField($('#email'));
                return true;
            } else {
                Helpers.setInvalidField($('#email'));
                return false;
            }
        }

        function validatePassword() {
            const v = validator;
            const passwordField = $('#password').val().trim();
            if (!v.isEmpty(passwordField)) {
                Helpers.setValidField($('#password'));
                return true;
            } else {
                Helpers.setInvalidField($('#password'));
                return false;
            }
        }
    }
}

class Helpers {
    static setValidField(elem) {
        $(elem).removeClass('form-invalid')
        $(elem).addClass('form-valid')
        $(elem).next().hide()
    }
    static setInvalidField(elem) {
        $(elem).removeClass('form-valid')
        $(elem).addClass('form-invalid')
        $(elem).next().show()
    }

    static ajx(url, { ...opt }) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: opt.method ? opt.method : 'post',
                data: JSON.stringify(opt.formData),
                contentType: 'application/json',
                success: (data) => {
                    if (opt.cb) opt.cb()
                    resolve(data)
                },
                error: (err) => {
                    console.log(err);
                    reject(err)
                }
            });
        })
    }
}

