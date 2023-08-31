'use strict';

const
    spocky = require('spocky')
;

export default class Panel extends spocky.Module
{

    constructor(system, panel)
    { super();
        js0.args(arguments, require('../System'), 'object');

        let l = system.createLayout(system.layouts.Panel);
        l.$fields.panel = panel;

        this.$view = l;
    }

}