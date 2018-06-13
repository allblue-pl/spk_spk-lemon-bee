'use strict';

const
    spocky = require('spocky')
;

export default class UserInfo extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["lb-user-info"]},["i",{"class":["fa fa-user i-left"],"aria-hidden":["true"]}],["a",{"href":["$lb.uris.userInfo"],"class":["mg-spacer-right"]},"$login"],"|",["a",{"class":["mg-spacer-left"],"href":["$lb.uris.logOut"]},"$lb.text('Sys:userInfo_LogOut')"]]];
    }


    constructor()
    {
        super(UserInfo.Content);
    }

}
