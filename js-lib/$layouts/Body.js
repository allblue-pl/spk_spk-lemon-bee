'use strict';

const
    spocky = require('spocky')
;

export default class Body extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["lb-content ","$panelClass"," container-fluid"]},["div",{"class":["lb-topbar row"]},["div",{"class":["col-xl-2 col-md-3"]},["div",{"class":["lb-logo"]},["a",{"href":["$lb.uris.base"]},["img",{"src":["$lb.images.logo"],"alt":["logo"]}]]]],["div",{"class":["col-xl-10 col-md-9 "]},["_",{"_holder":["userInfo"]}]],["div",{"class":["mg-clear"]}]],["div",{"class":["row"]},["div",{"class":["col-xl-2 col-md-3 mg-no-padding-horizontal lb-bg-gray-light"]},["_",{"_holder":["topMenu"]}]],["div",{"class":["col-xl-10 col-md-9 lb-bg-gray-lightest"],"style":["min-height: 800px;"]},["_",{"_holder":["content"]}],["div",{"class":["backToTop mg-spacer-top mg-spacer-bottom"]},["hr",{}],["a",{"id":["backToTop"],"class":["spScrollToTop btn btn-outline-secondary"],"href":[]},"$lb.text('backToTop')"," ",["i",{"class":["fa fa-chevron-up"]}]]]]],["div",{"class":["mg-clear"]}]],["div",{"class":["lb-povered-by pull-right"]},"Powered by ",["a",{"href":["http://allblue.pl"]},"AllBlue"]]];
    }


    constructor()
    {
        super(Body.Content);
    }

}
