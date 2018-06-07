'use strict';

const
    spocky = require('spocky')
;

export default class TopMenu extends spocky.Layout {

    static get Content() {
        return [["ul",{"class":[]},["li",{},["a",{"href":["/"]},["i",{"class":["fa fa-home"],"aria-hidden":["true"]}]]],["li",{"_repeat":["menuItems:item"],"class":["$item.activeClass"]},["a",{"href":["$item.uri"]},"$item.title"]]],["div",{"class":["mg-clear"]}]];
    }


    constructor()
    {
        super(TopMenu.Content);
    }

}
