'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('../$layouts')
;

export default class Body extends spocky.Module
{

    constructor(system)
    { super();
        js0.args(arguments, require('../System'));

        this.system = system;

        let l = system.createLayout($layouts.Body);

        l.$holders.topMenu.$view = this._getMenuLayout();
        l.$holders.userInfo.$view = this._getUserInfoLayout();

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
        l.$fields.login = 'Test';

        return l;
    }

}