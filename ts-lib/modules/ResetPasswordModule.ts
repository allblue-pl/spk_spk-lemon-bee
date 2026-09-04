import abApi from "web-ab-api";
import spocky from "spocky";
import type LBSystem from "../LBSystem.ts";
import { ts0Assert } from "@allblue/ts0";

export default class ResetPasswordModule extends spocky.Module {
    #lb: LBSystem;
    
    constructor(lb: LBSystem) { super();
        this.#lb = lb;

        this.l = lb.createLayout(this.#lb.layouts.ResetPassword);
        
        this.l.$elems.Form.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.resetPassword_Async();
        });

        this.l.$elems.NewPassword.addEventListener('input', (evt: Event) => {
            this.clearError();
        });
        this.l.$elems.NewPassword_Confirmation.addEventListener('input', 
                (evt: Event) => {
            this.clearError();
        });

        lb.msgs.hideLoading();

        this.$view = this.l;
    }

    clearError(): void {
        this.l.$fields.messageType = 'primary';
        this.l.$fields.message = null;
    }

    resetPassword_Async(): void {
        if (this.l.$elems.NewPassword.value === '') {
            this.l.$fields.messageType = 'danger';
            this.l.$fields.message = this.#lb.text('Errors_PasswordCannotBeEmpty');

            return;
        }

        if (this.l.$elems.NewPassword.value !== 
                this.l.$elems.NewPassword_Confirmation.value) {
            this.l.$fields.messageType = 'danger';
            this.l.$fields.message = this.#lb.text('Errors_PasswordsDoNotMatch');

            return;
        }

        let resetPasswordHash = this.#lb.pager.current.args.resetPasswordHash;
        let newPassword = this.l.$elems.NewPassword.value;

        this.#lb.msgs.showLoading();

        ts0Assert(this.#lb.actions.resetPassword_Async !== null,
                `'resetPassword' action not set.`);
        this.#lb.actions.resetPassword_Async(resetPasswordHash, newPassword)
            .then((result) => {
                if (result.success) {
                    this.l.$fields.messageType = 'success';
                    this.l.$fields.message = result.message;

                    this.l.$elems.NewPassword.value = '';
                    this.l.$elems.NewPassword_Confirmation.value = '';

                    setTimeout(() => {
                        this.#lb.pager.setPage('lb.logIn');
                    }, 3000);
                } else {
                    this.l.$fields.messageType = 'danger';
                    this.l.$fields.message = result.message;
                }

                this.#lb.msgs.hideLoading();
            })
            .catch((e) => {
                console.error(e.stack);
                this.#lb.msgs.showMessage_Failure(e.toString());
            });
    }

}