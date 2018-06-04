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
        js0.args(arguments, require('../System'), Map);

        let l = system.createLayout($layouts.Main);        
        l.$fields.panels = system.getPanels();

        this.$view = l;
    }

}