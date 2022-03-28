'use strict';

const
    abApi = require('web-ab-api'),
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('../$layouts')
;

export default class ResetPassword extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.lb = system;

        this.l = system.createLayout($layouts.ResetPassword);
        
        this.l.$elems.Form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.resetPassword();
        });

        this.l.$elems.NewPassword.addEventListener('input', (evt) => {
            this.clearError();
        });
        this.l.$elems.NewPassword_Confirmation.addEventListener('input', 
                (evt) => {
            this.clearError();
        });

        this.$view = this.l;
    }

    clearError()
    {
        this.l.$fields.messageType = 'primary';
        this.l.$fields.message = null;
    }

    resetPassword()
    {
        if (this.l.$elems.NewPassword.value === '') {
            this.l.$fields.messageType = 'danger';
            this.l.$fields.message = this.lb.text('Errors_PasswordCannotBeEmpty');

            return false;
        }

        if (this.l.$elems.NewPassword.value !== 
                this.l.$elems.NewPassword_Confirmation.value) {
            this.l.$fields.messageType = 'danger';
            this.l.$fields.message = this.lb.text('Errors_PasswordsDoNotMatch');

            return false;
        }

        let resetPasswordHash = this.lb.pager.current.args.resetPasswordHash;
        let newPassword = this.l.$elems.NewPassword.value;

        this.lb.msgs.showLoading();

        this.lb.actions.resetPassword_Async(resetPasswordHash, newPassword)
            .then((result) => {
                if (result.success) {
                    this.l.$fields.messageType = 'success';
                    this.l.$fields.message = result.message;

                    this.l.$elems.NewPassword.value = '';
                    this.l.$elems.NewPassword_Confirmation.value = '';

                    setTimeout(() => {
                        this.lb.pager.setPage('lb.logIn');
                    }, 3000);
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