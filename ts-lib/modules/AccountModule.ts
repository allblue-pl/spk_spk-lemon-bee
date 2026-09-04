import spkForms, { Form } from "spk-forms";
import { Layout, Module } from "spocky";
import type LBSystem from "../LBSystem.ts";
import type { LBActions_ChangePasswordResult } from "../lb-actions.ts";

export default class AccountModule extends Module {
    #l: Layout;
    #lb: LBSystem;
    #f: Form;

    constructor(lb: LBSystem) { super();
        this.#lb = lb;

        this.#l = this.#lb.createLayout(this.#lb.layouts.Account);        
        this.#f = new spkForms.Form(this.#l, 'ChangePassword');        

        this.#l.$elems.BackButton.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            this.#lb.pager.setPage('lb.main');
        });
        this.#l.$fields.Uris.Main = this.#lb.pager.getPageUri('lb.main');
        this.#l.$elems.changePassword.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            this.changePassword();
        });

        this.#lb.msgs.hideLoading();

        this.$view = this.#l;
    }
    

    checkNewPassword(): boolean {
        let fields = this.#f.getValues();

        if (fields.NewPassword === '') {
            this.#f.setValidator({
                valid: false,
                fields: {
                    NewPassword: {
                        errors: [ this.#lb.text('Errors_PasswordCannotBeEmpty') ],
                        state: "",
                        successes: [],
                        valid: false,
                        value: fields.NewPassword,
                        warnings: [],
                    },
                },
                state: '',
                errors: [],
            });
            return false;
        }

        if (fields.NewPassword !== fields.NewPassword_Confirmation) {
            this.#f.setValidator({
                valid: false,
                fields: {
                    NewPassword_Confirmation: {
                        errors: [ this.#lb.text('Errors_PasswordsDoNotMatch') ],
                        state: "",
                        successes: [],
                        valid: false,
                        value: String(fields.NewPassword),
                        warnings: [],
                    },
                },
                state: "",
                errors: [],
            });
            return false;
        }

        return true;
    }

    changePassword(): void {
        this.message_Clear();

        if (!this.checkNewPassword())
            return;

        this.#lb.msgs.showLoading();
        let fValues = this.#f.getValues();
        this.#lb.actions.changePassword_Async(String(fValues.Password), 
                String(fValues.NewPassword))
            .then((result: LBActions_ChangePasswordResult) => {
                if (result.success) {
                    this.message_SetSuccess(result.message);
                    this.#f.setValues({
                        Password: '',
                        NewPassword: '',
                        NewPassword_Confirmation: '',
                    });
                } else
                    this.message_SetError(result.message);

                this.#lb.msgs.hideLoading();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    message_Clear(): void {
        this.#l.$fields.message = null;
        this.#l.$fields.messageType = 'dark';
    }

    message_SetError(message: string): void {
        this.#l.$fields.message = message;
        this.#l.$fields.messageType = 'danger';
    }

    message_SetSuccess(message: string): void {
        this.#l.$fields.message = message;
        this.#l.$fields.messageType = 'success';
    }

}