'use strict';

const
    abPager = require('ab-pager'),
    js0 = require('js0'),
    spkMessages = require('spk-messages'),
    spocky = require('spocky'),

    $layouts = require('./$layouts'),
    modules = require('./modules')
;

export default class System
{

    get actions() {
        return this._actions;
    }

    get body() {
        return this._mBody;
    }

    get defaultPageName() {
        return this._defaultPageName;
    }

    get layouts() {
        return this._layouts;
    }

    get module() {
        if (!this._initialized)
            throw new Error('LemonBee system not initialized.');

        return this._module;
    }

    get panels() {
        if (!this._initialized)
            throw new Error('LemonBee system not initialized.');

        return this._panels;
    }

    get panels_Preset() {
        return js0.Iterable(js0.Preset({
            permissions: [ js0.Default([]), Array ],

            name: 'string',
            shortcut: [ 'boolean', js0.Default(true), ],
            
            menu: js0.Preset({
                shortcut: [ 'boolean', js0.Default(true), ],
                uri: [ 'boolean', js0.Null, js0.Default(null), ],
                action: [ 'function', js0.Null, js0.Default(null), ],
            }),

            alias: 'string',
            title: 'string',
            faIcon: [ 'string', js0.Null, js0.Default(null), ],
            image: [ 'string', js0.Null, js0.Default(null), ],
            
            subpanels: js0.Iterable(js0.Preset({
                name: 'string',
                moduleFn: [ 'function', js0.Null ],
                uri: [ 'string', js0.Null, js0.Default(null), ],

                permissions: [ js0.Default([]), Array ],

                alias: 'string',
                title: 'string',
                faIcon: [ js0.Default(null), 'string' ],
                image: [ js0.Default(null), 'string' ],    

                shortcut: [ js0.Default(true), 'boolean' ],
            })),
        }))
    }

    get uris() {
        if (!this._initialized)
            throw new Error('LemonBee system not initialized.');

        return this._uris;
    }

    get user() {
        if (!this._initialized)
            throw new Error('LemonBee system not initialized.');

        return this._user;
    }


    constructor(pager, msgs)
    {
        js0.args(arguments, abPager.Pager, spkMessages.Messages)

        this._initialized = false;

        /* Presets */
        this._actions = null;
        this._aliases = null;
        this._dev = null;
        this._defaultPageName = 'lb.main';
        this._defaultPageNames = null;
        this._images = null;
        this._layouts = null;
        this._settings = null;
        this._shows = null;
        this._title = null;
        this._textFn = null;
        this._uris = null;
        /* / Presets */

        this._user = {
            loggedIn: false,
            permissions: [],
            login: '',
        };
        /* / Presets */

        this._panels = new Map();
        this._module = new spocky.Module();
        this._module_Layout = new spocky.Layout([
            [ 'div', { _holder: 'content', } ],
            [ 'div', { _holder: 'msgs', } ],
        ]);
        this._module.$view = this._module_Layout;
        
        this.pager = pager;
        this.msgs = msgs;

        this._mBody = null;

        this._listeners_BeforePage = [];
        this._listeners_AfterPage = [];
    }

    addListener_AfterPage(listener)
    {
        js0.args(arguments, 'function');

        this._listeners_AfterPage.push(listener);
    }

    addListener_BeforePage(listener)
    {
        js0.args(arguments, 'function');

        this._listeners_BeforePage.push(listener);
    }

    call_OnBack()
    {
        if (this._mBody === null)
            return false;

        if (this._mBody.call_OnBack())
            return true;

        if (this.pager.current.name !== 'lb.main') {
            this.pager.setPage('lb.main');
            return true;
        }

        return false;
    }

    clear()
    {
        this._mBody = null;
        // this.msgs.hide();
    }

    createLayout(layoutClass)
    {
        let l = new layoutClass();
        l.$fields.lb = this.getFields();

        return l;
    }

    getFields()
    {
        return {
            dev: this._dev,
            images: this._images,
            settings: this._settings,
            shows: this._shows,
            text: (text) => {
                return this.text(text);
            },
            uris: this._uris,
            user: this._user,
        };
    }

    getPanels()
    {
        let allowedPanels = [];
        for (let [ panelName, panel ] of this._panels) {
            let allowed = true;
            for (let permission of panel.permissions) {
                if (!this._user.permissions.includes(permission)) {
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

    logOut()
    {
        this.msgs.showLoading();
        this.actions.logOut_Async()
            .then((result) => {
                if (!result.success) {
                    this.msgs.showMessage_Failure(result.error);
                    this.msgs.hideLoading();

                    return;
                }

                this.setUser({
                    loggedIn: false,
                    login: '',
                    permissions: [],
                });

                this.msgs.hideLoading();

                this.pager.setPage('lb.logIn');
            })
            .catch((e) => {
                console.error(e.stack);
                this.msgs.showMessage_Failure(e.toString());
            });
    }

    setBackButton(hasBackButton)
    {
        js0.args(arguments, 'boolean');

        if (this._mBody === null)
            throw new Error('No active panel.');

        this._mBody.lMenu.$fields.HasBackButton = hasBackButton;
    }

    setListener_OnBack(listener)
    {
        js0.args(arguments, 'function');

        this._mBody.setListener_OnBack(listener);
    }

    setPanels(panels)
    {
        js0.args(arguments, this.panels_Preset);

        this._panels.clear();

        for (let panel of panels)
            this._addPanel(panel);

        this.setup_Pager();
    }

    setUser(user)
    {
        js0.args(arguments, js0.RawObject);
        js0.typeE(user, js0.Preset({
            loggedIn: 'boolean',                
            login: 'string',
            permissions: Array,
        }));

        this._user = user;
    }

    setup(presets)
    {
        js0.args(arguments, js0.RawObject);
        js0.typeE(presets, js0.Preset({
            actions: js0.Preset({
                changePassword_Async: 'function',
                logIn_Async: 'function',
                logOut_Async: 'function',
                remindPassword_Async: [ 'function', js0.Null, js0.Default(null) ],
                resetPassword_Async: [ 'function', js0.Null, js0.Default(null) ],
            }),
            aliases: js0.Preset({
                account: [ 'string', js0.Default('account') ],
                main: [ 'string', js0.Default('') ],
                logIn: [ 'string', js0.Default('log-in') ],
                remindPassword: [ 'string', js0.Default('remind-password') ],
                resetPassword: [ 'string', js0.Default('reset-password') ],
            }),
            dev: [ js0.Preset({
                email: [ 'string', js0.Default('') ],
                login: [ 'string', js0.Default('') ],
                password: [ 'string', js0.Default('') ],
            }), js0.Default({}), ],
            defaultPageNames: [ js0.ArrayItems('string'), js0.Default([ 'lb.main' ]) ],
            images: js0.Preset({
                logo: [ 'string', js0.Null, js0.Default(null), ],
                logo_Main: [ 'string', js0.Null, js0.Default(null), ],
            }),
            layouts: [ js0.Preset({
                'Account': [ 'function', js0.Default($layouts.Account), ],
                'Body': [ 'function', js0.Default($layouts.Body), ],
                'LogIn': [ 'function', js0.Default($layouts.LogIn), ],
                'LogIn_Form': [ 'function', 
                        js0.Default($layouts.LogIn_Form), ],
                'Main': [ 'function', js0.Default($layouts.Main), ],
                'RemindPassword': [ 'function', 
                        js0.Default($layouts.RemindPassword), ],
                'ResetPassword': [ 'function', 
                        js0.Default($layouts.ResetPassword), ],
                'TopMenu': [ 'function', js0.Default($layouts.TopMenu), ],
                'UserInfo': [ 'function', js0.Default($layouts.UserInfo), ],
            }), js0.Default({}), ],  
            panels: this.panels_Preset,
            shows: [ js0.Preset({
                home: [ 'boolean', js0.Default(true), ],
                userInfo: [ 'boolean', js0.Default(true), ],
            }), js0.Default({}) ],
            textFn: 'function',
            title: [ 'string', js0.Default('LemonBee') ],
            uris: js0.Preset({
                base: [ 'string', js0.Default('') ],
                package: [ 'string', js0.Null, js0.Default(null) ],
                // api: [ 'string' ],
            }),
            
            settings: [ js0.Preset({
                hasRemindPassword: [ js0.Default(true), 'boolean' ],
            }), js0.Default({}) ],
        }));

        this._actions = presets.actions;
        this._aliases = presets.aliases;
        this._dev = presets.dev;
        this._defaultPageNames = presets.defaultPageNames;
        this._images = presets.images;
        this._layouts = presets.layouts;
        this._settings = presets.settings;
        this._shows = presets.shows;
        this._textFn = presets.textFn;
        this._title = presets.title;
        this._uris = presets.uris;

        if (this._images.logo === null)
            this._images.logo = `${this._uris.package}images/logo.png`;
        if (this._images.logo_Main === null)
            this._images.logo_Main = `${this._uris.package}images/logo_main.png`;
        for (let messageType in this._images.messages) {
            if (this._images.messages[messageType] === null) {
                let ext = messageType === 'loading' ? 'gif' : 'png';
                this._images.messages[messageType] = `${this._uris.package}images/messages/${messageType}.${ext}`;
            }
        }

        this._uris.base = this.pager.base + this._uris.base;
        if (this._uris.package === null)
            this._uris.package = this._uris.base + 'dev/node_modules/spk-lemon-bee/';
        this._uris.logOut = this._uris.base;

        this.setPanels(presets.panels);

        // this.msgs = spkMessages;
        
        // this._module_Layout.$holders.msgs.$view = this.msgs;
    }

    setup_Pager()
    {
        this.pager.page('lb.main', this._aliases.main, 
                (page, source, pageArgs) => {
            for (let listener of this._listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();
            this._setBodyModule(new modules.Body(this));
            this._setPanelModule(new modules.Main(this), this._title);

            for (let listener of this._listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        this._uris.main = this.pager.getPageUri('lb.main');

        this.pager.page('lb.logIn', this._aliases.logIn, 
                (page, source, pageArgs) => {
            for (let listener of this._listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();

            if (this._user.loggedIn) {               
                // this.pager.setPage('lb.main');
                this.pager.setPage(this._defaultPageName);
                return;
            }

            this._module_Layout.$holders.content.$view = new modules.LogIn(this);
            document.title = this._title + ' - ' + this.text('Titles_LogIn');

            for (let listener of this._listeners_AfterPage)
                listener(page, source, pageArgs);
        });

        this.pager.page('lb.remindPassword', this._aliases.remindPassword, 
                (page, source, pageArgs) => {
            for (let listener of this._listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();

            if (this._user.loggedIn) {               
                // this.pager.setPage('lb.main');
                this.pager.setPage(this._defaultPageName);
                return;
            }

            this._module_Layout.$holders.content.$view = 
                    new modules.RemindPassword(this);
            document.title = this._title + ' - ' + 
                    this.text('Titles_RemindPassword');

            for (let listener of this._listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        this._uris.remindPassword = this.pager.getPageUri('lb.remindPassword');

        this.pager.page('lb.resetPassword', this._aliases.resetPassword + 
                '/:resetPasswordHash', (page, source, pageArgs) => {
            for (let listener of this._listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();

            if (this._user.loggedIn) {               
                // this.pager.setPage('lb.main');
                this.pager.setPage(this._defaultPageName);
                return;
            }

            this._module_Layout.$holders.content.$view = 
                    new modules.ResetPassword(this);
            document.title = this._title + ' - ' + 
                    this.text('Titles_ResetPassword');

            for (let listener of this._listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        
        this.pager.page('lb.account', this._aliases.account, 
                (page, source, pageArgs) => {
            for (let listener of this._listeners_BeforePage)
                listener(page, source, pageArgs);

            this.clear();
            this._setBodyModule(new modules.Body(this));
            this._setPanelModule(new modules.Account(this), this._title + ' - ' +
                    this.text('Titles_Account'));

            for (let listener of this._listeners_AfterPage)
                listener(page, source, pageArgs);
        });
        this._uris.account = this.pager.getPageUri('lb.account');

        for (let [ panelName, panel ] of this._panels) {
            if (panel.subpanels.size === 0)
                continue;

            this.pager.page(`lb.panels.${panel.name}`, panel.alias, 
                    (page, source, pageArgs) => {

                for (let listener of this._listeners_BeforePage)
                    listener(page, source, pageArgs);

                if (panel.subpanels.size === 0)
                    throw new Error(`No subpanels in panel '${panelName}'.`);

                let defaultSubpanel = panel.subpanels.values().next().value;

                this.clear();
                this.pager.setPage(
                        `lb.subpanels.${panel.name}.${defaultSubpanel.name}`, 
                        {}, {}, false);
                // window.location = `${this._uris.base}${panel.alias}/${defaultSubpanel.alias}`;

                // No AfterPage listeners if redirected.
                // for (let listener of this._listeners_AfterPage)
                //     listener(page, source, pageArgs);
            });

            for (let [ subpanelName, subpanel ] of panel.subpanels) {
                if (subpanel.module === null)
                    continue;

                this.pager.page(`lb.subpanels.${panel.name}.${subpanel.name}`, 
                        `${panel.alias}/${subpanel.alias}`, 
                        (page, source, pageArgs) => {
                    for (let listener of this._listeners_BeforePage)
                        listener(page, source, pageArgs);

                    this.clear();

                    this._setBodyModule(new modules.Body(this));
                    let module = subpanel.moduleFn(this, page, source, pageArgs);
                    if (!js0.type(module, spocky.Module)) {
                        throw new Error(`'moduleFn' of subpanel ` + 
                                `'${panel.name}.${subpanel.name}' does not return spocky.Module`);
                    }

                    this._setPanelModule(module, panel.title + ' - ' +
                            subpanel.title);

                    for (let listener of this._listeners_AfterPage)
                        listener(page, source, pageArgs);
                });
            }
        }

        this._defaultPageName = 'lb.main';
        for (let pageName of this._defaultPageNames) {
            if (this.pager.hasPage(pageName)) {
                this._defaultPageName = pageName;
                break;
            }
        }

        this._uris.default = this.pager.getPageUri(this._defaultPageName);
    }

    init()
    {
        this._initialized = true;
    }

    text(text)
    {
        return this._textFn(text);
    }


    _addPanel(panel)
    {
        let pPanel = {};
        for (let pKey in panel) {
            if (pKey === 'subpanels') {
                pPanel.subpanels = new Map();
                for (let subpanel of panel.subpanels) {
                    let pSubpanel = {};
                    for (let sKey in subpanel)
                        pSubpanel[sKey] = subpanel[sKey];

                    if (panel.shortcut && subpanel.shortcut) {
                        if (pSubpanel.uri === null)
                            pSubpanel.uri = this.pager.parseUri(`${panel.alias}/${subpanel.alias}`);
                    } else
                        pSubpanel.uri = null;

                    pPanel.subpanels.set(subpanel.name, pSubpanel);
                }
            } else if (pKey === 'alias')
                pPanel[pKey] = panel[pKey];
            else
                pPanel[pKey] = panel[pKey];
        }
        pPanel.uri = this.pager.parseUri(panel.alias);

        this._panels.set(panel.name, pPanel);
    }

    _setBodyModule(module)
    {
        this._mBody = module;
    }

    _setPanelModule(module, title = null)
    {
        if (this._mBody === null)
            throw new Error('Body module not set.');

        if (!this._user.loggedIn) {
            this.pager.setPage('lb.logIn', {}, {}, false);
            // window.location = this._uris.base + this._aliases.logIn;
            return;
        }

        this._mBody.setContent(module);

        document.title = title === null ? this._title : title;

        this._module_Layout.$holders.content.$view = this._mBody;
    }

}