'use strict';

const
    abApi = require('web-ab-api'),
    js0 = require('js0'),
    spocky = require('spocky')
;

export default class LogIn extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.lb = system;

        this.l = system.createLayout(this.lb.layouts.LogIn);
        this.lForm = system.createLayout(this.lb.layouts.LogIn_Form);

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

        system.msgs.hideLoading();

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
                js0.typeE(result, js0.Preset({
                    user: [ js0.RawObject, js0.Null, js0.Default(null) ],
                    error: [ 'string', js0.Null, js0.Default(null) ],
                    reload: [ 'boolean', js0.Default(false) ],
                }));

                let user = {
                    loggedIn: false,
                    login: '',
                    permissions: [],
                };
                if (result.user !== null) 
                    user = result.user;
                // if (result.error !== null) {
                //     this.lb.msgs.showMessage_Failure(result.error);
                //     return;
                // }

                if (user.loggedIn) {
                    this.lForm.$fields.error = {
                        show: false,
                        message: '',
                    };

                    if (result.reload) {
                        window.location.reload();
                        return;
                    } else {
                        this.lb.setUser(result.user);
                        this.lb.setDefaultPageFn();
                    }
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
                this.lb.msgs.showMessage_Failure(this.lb.text('Errors_CannotLogIn'), 
                        e.toString());
                this.lb.msgs.hideLoading();
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