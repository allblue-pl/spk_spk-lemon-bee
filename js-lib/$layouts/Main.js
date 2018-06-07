'use strict';

const
    spocky = require('spocky')
;

export default class Main extends spocky.Layout {

    static get Content() {
        return [["h1",{},"Main"],["div",{"class":["lb-header"]},["h2",{},["img",{"ab-show":["image"],"alt":["title"],"src":["{{image}}"]}],["i",{"ab-hide":["image"],"class":["fa {{faIcon}}"]}],"$lb.test('title')",": ","$title",["br",{}],["span",{"_show":["show"]},"SHOW"]]],["div",{"class":["lb-menu-main mg-spacer-top-s row"]},["div",{"_repeat":["panels:panel"],"class":["col-lg-3 col-sm-6 mg-spacer-bottom-s ","$class"]},["h1",{},"Main title: ","$title",["span",{"_show":["panel.show"]},"Show"],["a",{"class":["btn btn-default mg-full"],"href":["$lb.uris.base","$panel.alias","/"]},["img",{"_show":["panel.image"],"src":["$panel.image"],"alt":["$panel.title"]}],"$panel.title"]],["div",{"_repeat":["panel.subpanels:subpanel"],"class":["lb-menu-item ","$subpanel.class"]},["a",{"href":["$lb.uris.base","$panel.alias","/","$subpanel.alias","/"],"class":["btn btn-default mg-full"]},["i",{"class":["fa ","$subpanel.faIcon"]}],["br",{}],"$subpanel.title"]]]],["div",{"class":["mg-clear"]}]];
    }


    constructor()
    {
        super(Main.Content);
    }

}
