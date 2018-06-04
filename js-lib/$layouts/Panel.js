'use strict';

const
    spocky = require('spocky')
;

export default class Panel extends spocky.Layout {

    constructor()
    {
        super([["h1",{},"Panel Panel"],["div",{"class":["row mg-spacer-bottom-s"]},["div",{"class":["lb-header col-lg-5"]},["div",{"ab-show":["isUser"],"ab-hide":["isNew"]}],["h2",{},["a",{"ab-elem":["back"],"class":["btn btn-default mg-spacer-right-s"],"href":[]},["i",{"class":["fa fa-chevron-left"]}]],["img",{"ab-show":["image"],"alt":["title"],"src":["$panel.image"]}],"$panel.title"]],["div",{"class":["col-lg-7 lb-buttons-panel mg-spacer-top-s"]},["div",{"ab-holder":["buttons"],"class":["lb-buttons"]},["div",{"ab-holder":["button1"]}],["div",{"ab-holder":["button2"]}],["div",{"ab-holder":["button3"]}],["div",{"ab-holder":["button4"]}]]]],["div",{"class":["mg-clear"]}],["div",{"ab-holder":["content"]}],["div",{"ab-holder":["notifications"]}]]);
    }

}
