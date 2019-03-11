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


    constructor(pager)
    {
        js0.args(arguments, abPager.Pager)

        this._initialized = false;

        /* Presets */
        this._aliases = {
            main: '',
            logIn: 'log-in',
        };
        this._images = {};
        this._texts = {};
        this._uris = {
            base: '/',
        };
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
        this.msgs = null;
    }

    clear()
    {
        this.msgs.hide();
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
            images: this._images,
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

    setup(presets)
    {
        js0.args(arguments, js0.Preset({
            aliases: js0.Preset({
                account: 'string',
                main: 'string',
                logIn: 'string',
            }),
            images: js0.Preset({
                logo: [ 'string', js0.Default(null), ],
                logo_Main: [ 'string', js0.Default(null), ],
                messages: js0.Preset({
                    loading: [ 'string', js0.Default(null), ],
                    success: [ 'string', js0.Default(null), ],
                    failure: [ 'string', js0.Default(null), ],
                }),
            }),
            panels: js0.Iterable(js0.Preset({
                permissions: [ js0.Default([]), Array ],
    
                name: 'string',
                shortcut: [ 'boolean', js0.Default(true), ],
                
                menu: js0.Preset({
                    shortcut: [ 'boolean', js0.Default(true), ],
                    uri: [ 'boolean', js0.Null, js0.Default(null), ],
                }),

                alias: 'string',
                title: 'string',
                faIcon: [ 'string', js0.Default(null), ],
                image: [ 'string', js0.Default(null), ],
                
                subpanels: js0.Iterable(js0.Preset({
                    name: 'string',
                    module: [ 'function', js0.Null ],
                    uri: [ 'string', js0.Null, js0.Default(null), ],

                    permissions: [ js0.Default([]), Array ],
    
                    alias: 'string',
                    title: 'string',
                    faIcon: [ js0.Default(null), 'string' ],
                    image: [ js0.Default(null), 'string' ],    

                    shortcut: [ js0.Default(true), 'boolean' ],
                })),
            })),
            texts: 'object',
            uris: js0.Preset({
                base: [ 'string', js0.Default('/') ],
                package: [ 'string', js0.Default('/dev/node_modules/spk-lemon-bee/') ],
                api: [ 'string' ],
            }),
            user: js0.Preset({
                loggedIn: 'boolean',                
                login: 'string',
                permissions: Array,
            }),
        }));

        this._aliases = presets.aliases;
        this._images = presets.images;
        this._texts = presets.texts;
        this._uris = presets.uris;
        this._user = presets.user;

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

        for (let panel of presets.panels)
            this._addPanel(panel);

        this.msgs = new spkMessages.Messages(this._images.messages);
        
        this._module_Layout.$holders.msgs.$view = this.msgs;
    }

    init()
    {
        this.pager.page('lb.main', this._aliases.main, () => {
            this.clear();
            this._setPanelModule(new modules.Main(this, this._panels));
        });
        this._uris.main = this.pager.getPageUri('lb.main');

        this.pager.page('lb.logIn', this._aliases.logIn, () => {
            if (this._user.loggedIn) {               
                this.clear();
                this.pager.setPage('lb.main');
                return;
            }

            this._module_Layout.$holders.content.$view = new modules.LogIn(this);
        });
        
        this.pager.page('lb.account', this._aliases.account, () => {
            this.clear();
            this._setPanelModule(new modules.Account(this, this._panels));
        });
        this._uris.account = this.pager.getPageUri('lb.account');


        for (let [ panelName, panel ] of this._panels) {
            this.pager.page(`lb.panels.${panel.name}`, panel.alias, () => {
                if (panel.subpanels.size === 0)
                    throw new Error(`No subpanels in panel '${panelName}'.`);

                let defaultSubpanel = panel.subpanels.values().next().value;

                this.clear();
                this.pager.setPage(`lb.subpanels.${panel.name}.${defaultSubpanel.name}`, {}, false);
                // window.location = `${this._uris.base}${panel.alias}/${defaultSubpanel.alias}`;
            });

            for (let [ subpanelName, subpanel ] of panel.subpanels) {
                if (subpanel.module === null)
                    continue;

                this.pager.page(`lb.subpanels.${panel.name}.${subpanel.name}`, 
                        `${panel.alias}/${subpanel.alias}`, () => {
                    this.clear();
                    this._setPanelModule(new subpanel.module(this));
                });
            }
        }

        this._initialized = true;
    }

    text(text)
    {
        if (text in this._texts)
            return this._texts[text];

        return `#${text}#`;
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
                pPanel[pKey] = encodeURIComponent(panel[pKey]);
            else
                pPanel[pKey] = panel[pKey];
        }
        pPanel.uri = this.pager.parseUri(panel.alias);

        this._panels.set(panel.name, pPanel);
    }

    _setPanelModule(module)
    {
        if (!this._user.loggedIn) {
            this.pager.setPage('lb.logIn', {}, false);
            window.location = this._uris.base + this._aliases.logIn;
            return;
        }

        let body = new modules.Body(this);
        body.setContent(module);

        this._module_Layout.$holders.content.$view = body;
    }

}