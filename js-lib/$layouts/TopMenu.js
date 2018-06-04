'use strict';

const
    spocky = require('spocky')
;

export default class TopMenu extends spocky.Layout {

    constructor()
    {
        super([["ul",{"class":[]},["li",{},["a",{"href":["/"]},["i",{"class":["fa fa-home"],"aria-hidden":["true"]}]]],["li",{"_repeat":["menuItems:item"],"class":["$item.activeClass"]},["a",{"href":["$item.uri"]},"Here: ","$item.title"]]],["div",{"class":["mg-clear"]}]]);
    }

}
