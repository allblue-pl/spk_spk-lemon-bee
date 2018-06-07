'use strict';

const
    spocky = require('spocky')
;

export default class LogIn extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["mg-fill-screen lb-background-login"]}],["div",{"class":["magda-holder"]},["div",{"class":["col-lg-5 col-sm-6 col-sm-8 lb-login"]},["div",{"class":["lb-login-content"]},["div",{"class":["lb-login-logo col-sm-5 col-sm-5 "]},["img",{"src":["$lb.images.logo"]}],["div",{"class":["mg-clear"]}]],["div",{"class":["lb-login-form col-sm-7 col-sm-7"]},["h3",{},"$lb.text('texts_logInMessage')"],["_",{"_holder":["form"]}]],["div",{"class":["mg-clear"]}]],["div",{"class":["lb-povered-by"]},"Powered by",["a",{"href":["https://allblue.pl"],"class":["text-primary"]},"AllBlue"]]]]];
    }


    constructor()
    {
        super(LogIn.Content);
    }

}
