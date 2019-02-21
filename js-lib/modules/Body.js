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

        let l = system.createLayout($layouts.Body);
        let lMenu = this._getMenuLayout();
        let lUserInfo = this._getUserInfoLayout();

        l.$elems.backToTop.addEventListener('click', (evt) => {
            evt.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "fast");
        });

        lUserInfo.$elems.logOut.addEventListener('click', (evt) => {
            evt.preventDefault();
            system.msgs.showLoading();
            webABApi.json(system.uris.api + 'log-out', {}, (result) => {
                window.location = system.uris.base;
            });
        });

        l.$holders.topMenu.$view = lMenu;
        l.$holders.userInfo.$view = lUserInfo;

        this.layout = l;

        this.$view = l;
    }

    setContent(content)
    {
        js0.args(arguments, [ spocky.Layout, spocky.Module ]);

        this.layout.$holders.content.$view = content;
    }


    _getMenuLayout()
    {
        let l = this.system.createLayout($layouts.TopMenu);

        let items = [];
        let panels = this.system.getPanels();
        for (let panel of panels) {
            if (!panel.shortcut)
                continue;

            items.push({
                uri: `${this.system.uris.base}${panel.alias}/`,
                title: panel.title,
            });
        }
        l.$fields.menuItems = items;

        return l;
    }

    _getUserInfoLayout()
    {
        let l = this.system.createLayout($layouts.UserInfo);

        l.$fields.lb = this.system.getFields();

        return l;
    }

}