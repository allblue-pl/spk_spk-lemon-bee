'use strict';

const
    js0 = require('js0'),
    spkForms = require('spk-forms'),
    spocky = require('spocky'),
    webABApi = require('web-ab-api'),

    $layouts = require('../$layouts')
;

export default class Account extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.system = system;

        this.l = system.createLayout($layouts.Account);        
        this.f = new spkForms.Form(this.l, 'ChangePassword');        

        this.l.$elems.changePassword.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.changePassword();
        });

        this.$view = this.l;
    }

    checkNewPassword()
    {
        let fields = this.f.getValues();

        if (fields.NewPassword === '') {
            this.f.setValidator({
                valid: false,
                fields: {
                    NewPassword: {
                        valid: false,
                        errors: [ this.system.text('Errors_PasswordCannotBeEmpty') ],
                    },
                },
            });
            return false;
        }

        if (fields.NewPassword !== fields.NewPassword_Confirmation) {
            this.f.setValidator({
                valid: false,
                fields: {
                    NewPassword_Confirmation: {
                        valid: false,
                        errors: [ this.system.text('Errors_PasswordsDoNotMatch') ],
                    },
                },
            });
            return false;
        }

        return true;
    }

    changePassword()
    {
        this.message_Clear();

        if (!this.checkNewPassword())
            return;

        this.system.msgs.showLoading();
        let fValues = this.f.getValues();
        this.system.actions.changePassword_Async(fValues.Password, fValues.NewPassword)
            .then((result) => {
                if (result.success) {
                    this.message_SetSuccess(result.message);
                    this.f.setValues({
                        Password: '',
                        NewPassword: '',
                        NewPassword_Confirmation: '',
                    });
                } else
                    this.message_SetError(result.message);

                this.system.msgs.hideLoading();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    message_Clear()
    {
        this.l.$fields.message = null;
        this.l.$fields.messageType = 'dark';
    }

    message_SetError(message)
    {
        this.l.$fields.message = message;
        this.l.$fields.messageType = 'danger';
    }

    message_SetSuccess(message)
    {
        this.l.$fields.message = message;
        this.l.$fields.messageType = 'success';
    }

}