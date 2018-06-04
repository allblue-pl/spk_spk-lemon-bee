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

        this.sys = system;

        this.l = system.createLayout($layouts.LogIn);
        this.lForm = system.createLayout($layouts.LogIn_Form);

        this.lForm.$elems.form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.logIn();
        });
        this.lForm.$elems.login.addEventListener('change', (evt) => {
            this.clearError();
        });
        this.lForm.$elems.password.addEventListener('change', (evt) => {
            this.clearError();
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
        this.sys.msgs.showLoading();

        abApi.json(this.sys.uris.api, {
            login: this.lForm.$elems.login.value,
            password: this.lForm.$elems.password.value,
                }, (result) => {
            if (result.isSuccess())
                window.location = this.sys.uris.base;
            else if (result.isFailure()) {
                this.lForm.error = {
                    show: true,
                    message: this.sys.text('logIn_LogIn_Failed'),
                };
                this.sys.msg.finishLoading();
            } else {
                console.warn(result);
                this.lForm.$fields.error = {
                    show: true,
                    message: this.sys.text('Users:logIn_LogIn_Error'),
                };
                this.sys.msgs.hideLoading();
            }
        });
    }

}