'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),
    webABApi = require('web-ab-api'),

    $layouts = require('../$layouts')
;

export default class Body extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.system = system;

        this._listeners_OnBack = null;

        let l = system.createLayout($layouts.Body);
        this.lMenu = this._getMenuLayout();
        this.lUserInfo = this._getUserInfoLayout();

        l.$elems.backToTop.addEventListener('click', (evt) => {
            evt.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "fast");
        });

        this.lUserInfo.$elems.logOut.addEventListener('click', (evt) => {
            evt.preventDefault();
            system.logOut();
        });

        l.$holders.topMenu.$view = this.lMenu;
        l.$holders.userInfo.$view = this.lUserInfo;

        this.layout = l;

        this.$view = l;
    }

    call_OnBack()
    {
        if (this._listeners_OnBack === null)
            return false;

        this._listeners_OnBack();
        return true;
    }

    setContent(content)
    {
        js0.args(arguments, [ spocky.Layout, spocky.Module ]);

        this.layout.$holders.content.$view = content;
    }

    setListener_OnBack(listener)
    {
        js0.args(arguments, 'function');

        this._listeners_OnBack = listener;
    }


    _getMenuLayout()
    {
        let l = this.system.createLayout($layouts.TopMenu);

        l.$fields.hasBackButton = false;

        let panels = this.system.getPanels();

        l.$elems.menuItem_Home.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.system.pager.setPage('lb.main');
        });
        l.$elems.menuItems_Panel((elem, keys) => {
            elem.addEventListener('click', (evt) => {
                evt.preventDefault();

                let panel = panels[keys[0]];
                if (panel.menu.action !== null) {
                    $(l.$elems.Menu).collapse('hide');
                    panel.menu.action();
                } else
                    this.system.pager.setUri(l.$fields.menuItems(keys[0]).uri);
            });
        });
        l.$elems.BackButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            if (this._listeners_OnBack === null)
                return;

            this._listeners_OnBack();
        });

        let items = new Map();
        for (let i = 0; i < panels.length; i++) {
            let panel = panels[i];
            if (!panel.menu.shortcut)
                continue;

            items.set(i, {
                uri: panel.menu.uri === null ?
                        `${this.system.uris.base}${panel.alias}/` :
                        panel.menu.uri,
                title: panel.title,
                faIcon: panel.faIcon,
            });
        }
        l.$fields.menuItems = items;

        /* User Info */
        l.$elems.LogOut.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.system.logOut();
        });

        return l;
    }

    _getUserInfoLayout()
    {
        let l = this.system.createLayout($layouts.UserInfo);

        l.$fields.lb = this.system.getFields();

        return l;
    }

}