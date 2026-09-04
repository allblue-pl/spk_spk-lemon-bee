import spocky, { Layout, Module } from "spocky";
import webABApi from "web-ab-api";
import type LBSystem from "../LBSystem.ts";
import { ts0Assert } from "@allblue/ts0";

export default class BodyModule extends spocky.Module {
    #lMenu: Layout;
    #lUserInfo: Layout;
    #lb: LBSystem;


    get lMenu(): Layout {
        return this.#lMenu;
    }

    get lUserInfo(): Layout {
        return this.#lUserInfo;
    }


    constructor(system: LBSystem) { 
        super();

        this.#lb = system;

        let l = this.#lb.createLayout(this.#lb.layouts.Body);

        this.#lMenu = this.#getMenuLayout();
        this.#lUserInfo = this.#getUserInfoLayout();

        l.$elems.backToTop.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "fast");
        });

        this.#lUserInfo.$elems.logOut.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            system.logOut();
        });

        l.$holders.topMenu.$view = this.#lMenu;
        l.$holders.userInfo.$view = this.#lUserInfo;

        this.layout = l;

        this.$view = l;
    }

    setContent(content: Layout|Module): void {
        this.layout.$holders.content.$view = content;
    }


    #getMenuLayout(): Layout {
        let l = this.#lb.createLayout(this.#lb.layouts.TopMenu);

        l.$fields.hasBackButton = false;

        let panels = this.#lb.getPanels();

        l.$elems.menuItem_Home.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            if (this.#lb.isLocked)
                return;
            this.#lb.pager.setPage('lb.main');
        });
        l.$elems.menuItems_Panel((elem: Element, keys: Array<any>) => {
            elem.addEventListener('click', (evt) => {
                evt.preventDefault();

                let panel = panels[keys[0]];
                ts0Assert(panel !== undefined, `Panel '${keys[0]}' does not exist.`);

                if (panel.menu.action !== null) {
                    $(l.$elems.Menu).collapse('hide');
                    panel.menu.action();
                } else {
                    if (this.#lb.isLocked)
                        return;
                    this.#lb.pager.setUri(l.$fields.menuItems(keys[0]).uri);
                }
            });
        });
        l.$elems.BackButton.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            this.#lb.call_OnBack();
        });

        let items = new Map();
        for (let panelIndex = 0; panelIndex < panels.length; panelIndex++) {
            let panel = panels[panelIndex];

            if (!panel.menu.shortcut)
                continue;

            items.set(panelIndex, {
                uri: panel.menu.uri === null ?
                        `${this.#lb.uris.base}${panel.alias}/` :
                        panel.menu.uri,
                title: panel.title,
                faIcon: panel.faIcon,
                image: panel.image,
            });
        }
        l.$fields.menuItems = items;

        /* User Info */
        l.$elems.LogOut.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            this.#lb.logOut();
        });

        return l;
    }

    #getUserInfoLayout(): Layout {
        let l = this.#lb.createLayout(this.#lb.layouts.UserInfo);

        l.$fields.lb = this.#lb.getFields();

        return l;
    }
}