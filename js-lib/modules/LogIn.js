'use strict';

const
    abApi = require('web-ab-api'),
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('../$layouts')
;

export default class LogIn extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.lb = system;

        this.l = system.createLayout($layouts.LogIn);
        this.lForm = system.createLayout($layouts.LogIn_Form);

        this.lForm.$elems.Form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.logIn();
        });
        this.lForm.$elems.Login.addEventListener('change', (evt) => {
            this.clearError();
        });
        this.lForm.$elems.Password.addEventListener('change', (evt) => {
            this.clearError();
        });

        this.lForm.$elems.RemindPassword.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.lb.pager.setPage('lb.remindPassword');
        });

        this.l.$holders.form.$view = this.lForm;

        this.$view = this.l;
    }

    clearError()
    {
        this.lForm.$fields.error = {
            show: false,
            message: ''
        };
    }

    logIn()
    {
        this.lb.msgs.showLoading();

        this.lb.actions.logIn_Async(this.lForm.$elems.Login.value,
                this.lForm.$elems.Password.value)
            .then((result) => {
                if (result.user.loggedIn) {
                    this.lForm.$fields.error = {
                        show: false,
                        message: '',
                    };

                    this.lb.setUser(result.user);
                    this.lb.pager.setPage('lb.main');
                } else {
                    this.lForm.$fields.error = {
                        show: true,
                        message: result.error,
                    };
                }

                this.lb.msgs.hideLoading();
            })
            .catch((e) => {
                console.error(e.stack);
                this.lb.msgs.showMessage_Failure(e.toString());
            });


        // abApi.json(`${this.lb.uris.api}log-in`, {
        //     Login: this.lForm.$elems.login.value,
        //     Password: this.lForm.$elems.password.value,
        //         }, (result) => {
        //     if (result.isSuccess())
        //         window.location = this.lb.uris.base;
        //     else if (result.isFailure()) {
        //         this.lForm.$fields.error = {
        //             show: true,
        //             message: this.lb.text('errors_LogInFailed'),
        //         };
        //         this.lb.msgs.hideLoading();
        //     } else {
        //         this.lForm.$fields.error = {
        //             show: true,
        //             message: this.lb.text('errors_LogInError'),
        //         };
        //         this.lb.msgs.hideLoading();
        //     }
        // });
    }

}