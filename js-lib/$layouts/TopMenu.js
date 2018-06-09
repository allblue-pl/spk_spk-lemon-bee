'use strict';

const
    spocky = require('spocky')
;

export default class TopMenu extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["lb-menu-top"]},["nav",{"class":["navbar navbar-expand-md navbar-light"]},["button",{"class":["navbar-toggler"],"type":["button"],"data-toggle":["collapse"],"data-target":["#collapsibleNavbar"]},["span",{"class":["navbar-toggler-icon"]}]],["div",{"class":["collapse navbar-collapse"],"id":["collapsibleNavbar"]},["ul",{"class":["navbar-nav"]},["li",{"class":["nav-item"]},["a",{"class":["nav-link"],"href":["/"]},["i",{"class":["fa fa-home"],"aria-hidden":["true"]}]]],["li",{"_repeat":["menuItems:item"],"class":["nav-item ","$item.activeClass"]},["a",{"class":["nav-link"],"href":["$item.uri"]},"$item.title"]]]]]]];
    }


    constructor()
    {
        super(TopMenu.Content);
    }

}
