'use strict';

const
    spocky = require('spocky')
;

export default class LogIn_Form extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["login-info"]},["form",{"_elem":["form"],"method":["post"],"role":["form"],"name":["form"],"id":["form"]},["div",{"class":["form-group"]},["div",{"class":["input-group"]},["div",{"class":["input-group-addon"]},["i",{"class":["fa fa-user fa-lg"]}]],["input",{"_elem":["login"],"placeholder":["$lb.text('logIn_Login_Placeholder')"],"value":["$login"],"type":["text"],"required":[],"class":["form-control"]}]]],["div",{"class":["form-group"]},["div",{"class":["input-group"]},["div",{"class":["input-group-addon"]},["i",{"class":["fa fa-lock fa-lg"]}]],["input",{"_elem":["password"],"placeholder":["$lb.text('logIn_Password_Placeholder')"],"value":["$password"],"type":["password"],"required":[],"class":["form-control"]}]]],["div",{"_show":["error.show"],"class":["alert alert-danger"]},["p",{},"$error.message"]],["div",{"class":["form-group"]},["button",{"type":["submit"],"class":["btn btn-primary mg-full"]},"$lb.text('logIn_LogIn')"]]],["div",{"_holder":["notifications"]}]]];
    }


    constructor()
    {
        super(LogIn_Form.Content);
    }

}
