'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('../$layouts')
;

export default class Main extends spocky.Module 
{

    constructor(system) 
    { super();
        js0.args(arguments, require('../System'));

        this.panels = system.getPanels();

        let l = system.createLayout($layouts.Main);        
        l.$fields.panels = this.panels;

        l.$elems.Buttons_Panel((elem, keys) => {
            elem.addEventListener('click', (evt) => {
                evt.preventDefault();
                system.pager.setUri(this.panels[keys[0]].uri);
            });
        });

        l.$elems.Buttons_Subpanel((elem, keys) => {
            elem.addEventListener('click', (evt) => {
                evt.preventDefault();
                system.pager.setUri(this.panels[keys[0]].subpanels.get(keys[1]).uri);
            });
        });

        system.msgs.hideLoading();

        this.$view = l;
    }

}