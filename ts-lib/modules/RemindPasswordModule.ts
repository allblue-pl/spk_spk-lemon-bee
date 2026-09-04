import abApi from "web-ab-api";
import spocky from "spocky";
import type LBSystem from "../LBSystem.ts";
import RemindPasswordLayout from "../../$layouts/RemindPasswordLayout.ts";
import { ts0Assert } from "@allblue/ts0";

export default class RemindPasswordModule extends spocky.Module {
    #lb: LBSystem;

    constructor(lb: LBSystem) { super();
        this.#lb = lb;

        this.l = lb.createLayout(RemindPasswordLayout);
        
        this.l.$elems.Form.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.remindPassword();
        });

        lb.msgs.hideLoading();

        this.$view = this.l;
    }

    clearError(): void {
        this.lForm.$fields.error = {
            show: false,
            message: ''
        };
    }

    remindPassword(): void {
        this.#lb.msgs.showLoading();

        ts0Assert(this.#lb.actions.remindPassword_Async !== null, 
                `'remindPassword' action not set.`);
        this.#lb.actions.remindPassword_Async(this.l.$elems.Login.value)
            .then((result) => {
                if (result.success) {
                    this.l.$fields.messageType = 'success';
                    this.l.$fields.message = result.message;

                    this.l.$elems.Login.value = '';
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