import { Pager } from "ab-pager";
import { Messages } from "spk-messages";
import { Layout, Module } from "spocky";

import { type AfterPageListener, type BeforePageListener, type MainFn, type ModuleFn, } from "./ts-types.ts";
import { presets_LBSystemPresets, type LBLayouts_Parsed, type LBSystemPresets, type LBSystemPresets_Parsed, type LBUris, type LBUser } from "./lb-system-presets.ts";
import ts0, { ts0Assert, TS0AssertError, type TS0RawObject } from "@allblue/ts0";
import BodyModule from "./modules/BodyModule.ts";
import { type LBPanel, type LBPanelPreset, type LBSubpanel, type LBSubpanelPreset, presets_LBPanel, presets_LBSubpanel } from "./lb-panel-presets.ts";
import MainModule from "./modules/MainModule.ts";
import LogInModule from "./modules/LogInModule.ts";
import RemindPasswordModule from "./modules/RemindPasswordModule.ts";
import ResetPasswordModule from "./modules/ResetPasswordModule.ts";
import AccountModule from "./modules/AccountModule.ts";
import { presets_LBActions_LogOutResult, type LBActions } from "./lb-actions.ts";

export default class LBSystem {
    #initialized: boolean;
    #listeners_AfterPage: Array<AfterPageListener>;
    #listeners_BeforePage: Array<BeforePageListener>;
    #listeners_OnBack: (() => void)|null;
    #locked: boolean;
    #mBody: BodyModule|null;
    #module_Layout: Layout;
    #module: Module;
    #msgs: Messages;
    #pager: Pager;
    #panels: Array<LBPanel>;
    #presets: LBSystemPresets_Parsed;
    #user: LBUser;
    #uris: LBUris;


    get actions(): LBActions {
        return this.#presets.actions;
    }

    get active(): boolean {
        return this.#mBody !== null;
    }

    get body(): BodyModule {
        if (this.#mBody === null)
            throw new Error('LemonBee system not active.');

        return this.#mBody;
    }

    get isLocked(): boolean {
        return this.#locked;
    }

    get layouts(): LBLayouts_Parsed {
        return this.#presets.layouts;
    }

    get mainFn(): MainFn|null {
        return this.#presets.mainFn;
    }

    get module(): Module {
        if (!this.#initialized)
            throw new Error('LemonBee system not initialized.');

        return this.#module;
    }

    get msgs(): Messages {
        return this.#msgs;
    }

    get pager(): Pager {
        return this.#pager;
    }

    get panels(): Array<LBPanel> {
        if (!this.#initialized)
            throw new Error('LemonBee system not initialized.');

        return this.#panels;
    }

    get presets(): LBSystemPresets_Parsed {
        return this.presets;
    }

    get setDefaultPageFn(): (() => void)|null {
        return this.#presets.setDefaultPageFn;
    }

    get title(): string {
        return this.#presets.title;
    }

    get uris(): LBUris {
        if (!this.#initialized)
            throw new Error('LemonBee system not initialized.');

        return this.#uris;
    }

    get user(): LBUser {
        if (!this.#initialized)
            throw new Error('LemonBee system not initialized.');

        return this.#user;
    }


    constructor(pager: Pager, msgs: Messages, presets: LBSystemPresets) {
        this.#initialized = false;
        this.#locked = false;
        this.#presets = ts0.assertType(presets, presets_LBSystemPresets) as 
                LBSystemPresets_Parsed;

        this.#user = {
            loggedIn: false,
            permissions: [],
            login: '',
        };

        this.#uris = {
            account: "/account/",
            base: "/",
            main: "/main/",
            package: "/node_modules/spk-lemon-bee/",
            remindPassword: "/remind-password/",
        };
        /* / Presets */

        this.#panels = [];
        this.#module = new Module();
        this.#module_Layout = new Layout([
            [ 'div', { _holder: 'content', } ],
            [ 'div', { _holder: 'msgs', } ],
        ]);
        this.#module.$view = this.#module_Layout;
        
        this.#pager = pager;
        this.#msgs = msgs;

        this.#mBody = null;

        this.#listeners_AfterPage = [];
        this.#listeners_BeforePage = [];
        this.#listeners_OnBack = null;
    }

    addListener_AfterPage(listener: AfterPageListener): void {
        this.#listeners_AfterPage.push(listener);
    }

    addListener_BeforePage(listener: BeforePageListener): void {
        this.#listeners_BeforePage.push(listener);
    }

    call_OnBack(): boolean {
        if (this.#locked)
            return true;

        if (this.#listeners_OnBack === null)
            return false;

        if (ts0.rtn('boolean', this.#listeners_OnBack()))
            return true;

        return false;
    }

    clear(): void {
        this.#mBody = null;
        // this.msgs.hide();
    }

    createLayout(layoutClass: new () => Layout): Layout {
        let layout = new layoutClass();
        layout.$fields.lb = this.getFields();

        return layout;
    }

    getFields(): object {
        return {
            dev: this.#presets.dev,
            images: this.#presets.images,
            settings: this.#presets.settings,
            shows: this.#presets.shows,
            text: (text: string) => {
                return this.text(text);
            },
            uris: this.#presets.uris,
            user: this.#user,
        };
    }

    getPanels(): Array<LBPanel> {
        let allowedPanels: Array<LBPanel> = [];
        for (let panel of this.#panels) {
            let allowed = true;
            for (let permission of panel.permissions) {
                if (!this.#user.permissions.includes(permission)) {
                    allowed = false;
                    break;
                }
            }

            if (!allowed)
                continue;

            allowedPanels.push(panel);
        }

        return allowedPanels;
    }

    lock(): void {
        this.#locked = true;
    }

    logOut(): void {
        this.#msgs.showLoading();
        this.actions.logOut_Async()
            .then((result) => {
                ts0.assertType(result, presets_LBActions_LogOutResult);

                if (result.error !== null) {
                    this.#msgs.showMessage_Failure(result.error);
                    this.#msgs.hideLoading();

                    return;
                }

                this.setUser({
                    loggedIn: false,
                    login: '',
                    permissions: [],
                });

                this.#msgs.hideLoading();

                this.#pager.setPage('lb.logIn');
            })
            .catch((err) => {
                console.error(err);
                this.#msgs.showMessage_Failure(err.toString());
            });
    }

    setBackButton(hasBackButton: boolean): void {
        if (this.#mBody === null)
            throw new Error('No active panel.');

        this.#mBody.lMenu.$fields.HasBackButton = hasBackButton;
    }

    setListener_OnBack(listener: () => void): void {
        this.#listeners_OnBack = listener;
    }

    setPanels(panels: Array<LBPanelPreset>): void {
        this.#panels = [];

        for (let panel of panels)
            this.#addPanel(panel);

        this.setup_Pager();
    }

    setUser(user: LBUser): void {
        this.#user = user;
    }

    setup(presets: LBSystemPresets): void {
        let presets_ = ts0.assertType(presets, presets_LBSystemPresets) as
                LBSystemPresets_Parsed;

        this.#presets = presets_;

        if (this.#presets.images.logo === null)
            this.#presets.images.logo = `${this.#presets.uris.package}images/logo.png`;
        if (this.#presets.images.logo_Main === null)
            this.#presets.images.logo_Main = `${this.#presets.uris.package}images/logo_main.png`;

        this.#presets.uris.base = this.#pager.base + this.#presets.uris.base;
        if (this.#presets.uris.package === null) {
            this.#presets.uris.package = this.#presets.uris.base + 
                    'dev/node_modules/spk-lemon-bee/';
        }

        this.setPanels(presets.panels);

        // this.msgs = spkMessages;
        
        // this.#module_Layout.$holders.msgs.$view = this.msgs;
    }

    setup_Pager(): void {
        this.#pager.page('lb.main', this.#presets.aliases.main, 
                (page, source, pageArgs) => {
            if (!this.#user.loggedIn) {
                this.#pager.setPage('lb.logIn', {}, {}, false);
                return;
            }

            for (let listener of this.#listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();
            this.#setBodyModule(new BodyModule(this));
            this.#setPanelModule(new MainModule(this), this.title);

            for (let listener of this.#listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        this.#uris.main = this.#pager.getPageUri('lb.main');

        this.#pager.page('lb.logIn', this.#presets.aliases.logIn, 
                (page, source, pageArgs) => {
            if (this.#user.loggedIn) {   
                if (this.#presets.setDefaultPageFn === null)            
                    this.#pager.setPage('lb.main');
                else
                    this.#presets.setDefaultPageFn();

                return;
            }

            for (let listener of this.#listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();

            this.#module_Layout.$holders.content.$view = new LogInModule(this);
            document.title = this.title + ' - ' + this.text('Titles_LogIn');

            for (let listener of this.#listeners_AfterPage)
                listener(page, source, pageArgs);
        });

        this.#pager.page('lb.remindPassword', this.#presets.aliases.remindPassword, 
                (page, source, pageArgs) => {
            if (this.#user.loggedIn) {            
                if (this.#presets.setDefaultPageFn === null)   
                    this.#pager.setPage('lb.main');
                else
                    this.#presets.setDefaultPageFn();

                return;
            }

            for (let listener of this.#listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();

            this.#module_Layout.$holders.content.$view = 
                    new RemindPasswordModule(this);
            document.title = this.title + ' - ' + 
                    this.text('Titles_RemindPassword');

            for (let listener of this.#listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        this.#uris.remindPassword = this.#pager.getPageUri('lb.remindPassword');

        this.#pager.page('lb.resetPassword', this.#presets.aliases.resetPassword + 
                '/:resetPasswordHash', (page, source, pageArgs) => {
             if (this.#user.loggedIn) {               
                if (this.#presets.setDefaultPageFn === null)
                    this.#pager.setPage('lb.main');
                else
                    this.#presets.setDefaultPageFn();

                return;
            }
    
            for (let listener of this.#listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();

            this.#module_Layout.$holders.content.$view = 
                    new ResetPasswordModule(this);
            document.title = this.title + ' - ' + 
                    this.text('Titles_ResetPassword');

            for (let listener of this.#listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        
        this.#pager.page('lb.account', this.#presets.aliases.account, 
                (page, source, pageArgs) => {
            if (!this.#user.loggedIn) {
                this.#pager.setPage('lb.logIn', {}, {}, false);
                return;
            }

            for (let listener of this.#listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();
            this.#setBodyModule(new BodyModule(this));
            this.#setPanelModule(new AccountModule(this), this.title + ' - ' +
                    this.text('Titles_Account'));

            for (let listener of this.#listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        this.#uris.account = this.#pager.getPageUri('lb.account');

        for (let panel of this.#panels) {
            if (panel.subpanels.length === 0)
                continue;

            this.#pager.page(`lb.panels.${panel.name}`, panel.alias, 
                    (page, source, pageArgs) => {

                for (let listener of this.#listeners_BeforePage)
                    listener(page, source, pageArgs);

                if (panel.subpanels.length === 0)
                    throw new Error(`No subpanels in panel '${panel.name}'.`);

                let defaultSubpanel = panel.subpanels.values().next().value;
                ts0Assert(defaultSubpanel !== undefined, 
                        `No subpanels in panel '${panel.name}'.`);

                this.clear();
                this.#pager.setPage(
                        `lb.subpanels.${panel.name}.${defaultSubpanel.name}`, 
                        {}, {}, false);
                // window.location = `${this.#uris.base}${panel.alias}/${defaultSubpanel.alias}`;

                // No AfterPage listeners if redirected.
                // for (let listener of this.#listeners_AfterPage)
                //     listener(page, source, pageArgs);
            });

            for (let subpanel of panel.subpanels) {
                if (subpanel.moduleFn === null)
                    continue;

                this.#pager.page(`lb.subpanels.${panel.name}.${subpanel.name}`, 
                        `${panel.alias}/${subpanel.alias}`, 
                        (page, source, pageArgs) => {
                    if (!this.#user.loggedIn) {
                        this.#pager.setPage('lb.logIn', {}, {}, false);
                        // window.location = this.#uris.base + this.#presets.aliases.logIn;
                        return;
                    }

                    for (let listener of this.#listeners_BeforePage)
                        listener(page, source, pageArgs);

                    this.clear();

                    this.#setBodyModule(new BodyModule(this));
                    
                    ts0Assert(subpanel.moduleFn !== null, `Subpanel` +
                        ` '${panel.name}:${subpanel.name}' 'moduleFn' is null.`);

                    let module = subpanel.moduleFn(this, page, source, pageArgs);
                    // if (!js0.type(module, spocky.Module)) {
                    //     throw new Error(`'moduleFn' of subpanel ` + 
                    //             `'${panel.name}.${subpanel.name}' does not return spocky.Module`);
                    // }

                    this.#setPanelModule(module, panel.title + ' - ' +
                            subpanel.title);

                    for (let listener of this.#listeners_AfterPage)
                        listener(page, source, pageArgs);
                });
            }
        }

        this.#presets.uris.account = this.#pager.getPageUri("lb.account");
    }

    init(): void {
        this.#pager.setListener_OnBeforePopState((uri) => {
            if (this.#locked) {
                window.location.assign(uri);
                return false;
            }

            return true;
        });

        window.onbeforeunload = (evt: Event) => {
            if (this.#locked)
                return true;

            return null;
        };

        this.#initialized = true;
    }

    text(text: string): string {
        return this.#presets.textFn(text);
    }

    unlock(): void {
        this.#locked = false;
    }


    #addPanel(panel: LBPanelPreset): void {
        this.#panels.push(this.#createPanel(panel));
    }

    #createPanel(panel: LBPanelPreset): LBPanel {
        let permissions = panel.permissions.slice();
        let subpanels: Array<LBSubpanel> = [];
        for (let subpanel of panel.subpanels)
            subpanels.push(this.#createSubpanel(panel, subpanel));

        return ts0.assertType({
            permissions: permissions,

            name: panel.name,
            shortcut: panel.shortcut,
            
            menu: {
                shortcut: panel.menu.shortcut,
                uri: panel.menu.uri === null ? 
                        this.#pager.parseUri(panel.alias) : panel.menu.uri,
                action: panel.menu.action,
            },

            alias: panel.alias,
            title: panel.title,
            faIcon: panel.faIcon,
            image: panel.image,
            
            subpanels: subpanels,

            uri: this.#pager.parseUri(panel.alias)
        }, presets_LBPanel) as LBPanel;
    }

    #createSubpanel(panel: LBPanelPreset, subpanel: LBSubpanelPreset): LBSubpanel {
        let permissions = subpanel.permissions.slice();
        
        let uri = subpanel.uri;
        if ((uri === null || uri === undefined) && subpanel.shortcut)
            uri = this.#pager.parseUri(`${panel.alias}/${subpanel.alias}`);

        return ts0.assertType({
            name: subpanel.name,
            moduleFn: subpanel.moduleFn,
            uri: uri,
        
            permissions: permissions,
        
            alias: subpanel.alias,
            title: subpanel.title,
            faIcon: subpanel.faIcon,
            image: subpanel.image,    
        
            shortcut: subpanel.shortcut,
        }, presets_LBSubpanel) as LBSubpanel;
    }

    #setBodyModule(bodyModule: BodyModule): void {
        this.#mBody = bodyModule;
    }

    #setPanelModule(module: Module, title: string|null = null): void {
        if (this.#mBody === null)
            throw new Error('Body module not set.');

        this.#mBody.setContent(module);

        document.title = title === null ? this.title : title;

        this.#module_Layout.$holders.content.$view = this.#mBody;
    }
}