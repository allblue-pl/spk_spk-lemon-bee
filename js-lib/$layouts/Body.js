'use strict';

const
    spocky = require('spocky')
;

export default class Body extends spocky.Layout {

    constructor()
    {
        super([["h1",{},"Body"],["div",{"class":["lb-content ","$panelClass"]},["div",{"class":["col-lg-2 col-sm-3 mg-absolute lb-bg-white"],"style":["top:0;bottom:0;left:0;right:0;"]}],["div",{"class":["mg-relative lb-topbar"]},["div",{"class":["col-lg-2 col-sm-3 mg-bg-white"]},["div",{"class":["lb-logo"]},["a",{"href":["$lb.uris.base"]},["img",{"src":["$lb.images.logo"],"alt":["logo"]}]]]],["div",{"class":["col-lg-10 col-sm-9 bg-primary"]},["_",{"_holder":["userInfo"]}]],["div",{"class":["mg-clear"]}]],["div",{"class":["col-lg-2 col-sm-3 mg-no-padding-horizontal"]},["_",{"_holder":["topMenu"]}]],["div",{"class":["col-lg-10 col-sm-9 lb-bg-gray-lightest"],"style":["min-height: 800px;"]},["_",{"_holder":["content"]}],["div",{"class":["backToTop mg-spacer-top"]},["hr",{}],["a",{"id":["backToTop"],"class":["spScrollToTop lb-back-to-top btn btn-default"],"href":[]},"$lb.text('backToTop')",["i",{"class":["fa fa-chevron-up"]}]]]],["div",{"class":["mg-clear"]}],["div",{"class":["lb-povered-by pull-right bg-primary"]},"Powered by",["a",{"href":["http://allblue.pl"]},"AllBlue"]]]]);
    }

}
