'use strict';

const
    spocky = require('spocky')
;

export default class UserInfo extends spocky.Layout {

    constructor()
    {
        super([["div",{"class":["lb-user-info"]},["i",{"class":["fa fa-user"],"aria-hidden":["true"]}],["a",{"href":["$lb.uris.userInfo"],"class":["mg-spacer-right"]},"$login"],"|",["a",{"class":["mg-spacer-left"],"href":["$lb.uris.logOut"]},"$lb.text('userInfo_LogOut')"]]]);
    }

}
