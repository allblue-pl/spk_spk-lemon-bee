'use strict';

const
    abApi = require('web-ab-api'),
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('../$layouts')
;

export default class RemindPassword extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.lb = system;

        this.l = system.createLayout($layouts.RemindPassword);
        
        this.l.$elems.Form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.remindPassword();
        });

        this.$view = this.l;
    }

    clearError()
    {
        this.lForm.$fields.error = {
            show: false,
            message: ''
        };
    }

    remindPassword()
    {
        this.lb.msgs.showLoading();

        this.lb.actions.remindPassword_Async(this.l.$elems.Login.value)
            .then((result) => {
                if (result.success) {
                    this.l.$fields.messageType = 'success';
                    this.l.$fields.message = result.message;

                    this.l.$elems.Login.value = '';
                } else {
                    this.l.$fields.messageType = 'danger';
                    this.l.$fields.message = result.message;
                }

                this.lb.msgs.hideLoading();
            })
            .catch((e) => {
                console.error(e.stack);
                this.lb.msgs.showMessage_Failure(e.toString());
            });
    }

}