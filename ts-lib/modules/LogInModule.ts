import abApi from "web-ab-api";
import spocky, { Layout } from "spocky";
import type LBSystem from "../LBSystem.ts";
import LogIn_FormLayout from "../../$layouts/LogIn_FormLayout.ts";
import type { LBActions_LogInResult_User } from "../lb-actions.ts";

export default class LogInModule extends spocky.Module {
    #lb: LBSystem;
    #l: Layout;

    constructor(lb: LBSystem) { super();
        this.#lb = lb;

        this.#l = lb.createLayout(this.#lb.layouts.LogIn);
        this.lForm = lb.createLayout(LogIn_FormLayout);

        this.lForm.$elems.Form.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.logIn();
        });
        this.lForm.$elems.Login.addEventListener('change', (evt: Event) => {
            this.clearError();
        });
        this.lForm.$elems.Password.addEventListener('change', (evt: Event) => {
            this.clearError();
        });

        this.lForm.$elems.RemindPassword.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            this.#lb.pager.setPage('lb.remindPassword');
        });

        this.#l.$holders.form.$view = this.lForm;

        lb.msgs.hideLoading();

        this.$view = this.#l;
    }

    clearError(): void {
        this.lForm.$fields.error = {
            show: false,
            message: ''
        };
    }

    logIn(): void {
        this.#lb.msgs.showLoading();

        this.#lb.actions.logIn_Async(this.lForm.$elems.Login.value,
                this.lForm.$elems.Password.value)
            .then((result) => {
                let user: LBActions_LogInResult_User = {
                    loggedIn: false,
                    login: '',
                    permissions: [],
                };
                if (result.user !== null) 
                    user = result.user;

                if (user.loggedIn) {
                    this.lForm.$fields.error = {
                        show: false,
                        message: '',
                    };

                    if (result.reload) {
                        window.location.reload();
                        return;
                    } else {
                        this.#lb.setUser(result.user);
                        if (this.#lb.setDefaultPageFn === null)
                            this.#lb.pager.setPage("lb.main");
                        else
                            this.#lb.setDefaultPageFn();
                    }
                } else {
                    this.lForm.$fields.error = {
                        show: true,
                        message: result.error,
                    };
                }

                this.#lb.msgs.hideLoading();
            })
            .catch((err: any) => {
                console.error(err);
                this.#lb.msgs.showMessage_Failure(this.#lb.text('Errors_CannotLogIn'), 
                        (err as Error).toString());
                this.#lb.msgs.hideLoading();
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