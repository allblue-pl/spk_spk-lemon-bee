'use strict';

const
    spocky = require('spocky')
;

export default class LogIn_Form extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["login-info"]},["form",{"_elem":["form"],"method":["post"],"role":["form"],"name":["form"],"id":["form"]},["div",{"class":["input-group mb-2"]},["div",{"class":["input-group-prepend"]},["div",{"class":["input-group-text"]},["i",{"class":["fa fa-user"]}]]],["input",{"_elem":["login"],"placeholder":["$lb.text('logIn_Login_Placeholder')"],"value":["$password"],"type":["text"],"required":[],"class":["form-control"]}]],["div",{"class":["input-group mb-2"]},["div",{"class":["input-group-prepend"]},["div",{"class":["input-group-text"]},["i",{"class":["fa fa-lock fa-lg"]}]]],["input",{"_elem":["password"],"placeholder":["$lb.text('logIn_Password_Placeholder')"],"value":["$password"],"type":["password"],"required":[],"class":["form-control"]}]],["div",{"_show":["error.show"],"class":["alert alert-danger"]},["p",{},"$error.message"]],["button",{"type":["submit"],"class":["btn btn-primary mg-full"]},"$lb.text('logIn_LogIn')"]],["div",{"_holder":["notifications"]}]]];
    }


    constructor()
    {
        super(LogIn_Form.Content);
    }

}
