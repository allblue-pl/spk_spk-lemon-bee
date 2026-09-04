import spocky, { Module } from "spocky";
import type LBSystem from "../LBSystem.ts";
import MainLayout from "../../$layouts/MainLayout.ts";
import { ts0Assert } from "@allblue/ts0";

export default class MainModule extends Module {
    constructor(lb: LBSystem)  { super();
        let l = lb.createLayout(MainLayout);        
        l.$fields.panels = lb.panels;

        l.$elems.Buttons_Panel((elem: Element, keys: Array<any>) => {
            elem.addEventListener('click', (evt) => {
                evt.preventDefault();
                
                let panel = lb.panels[keys[0]];
                ts0Assert(panel !== undefined);

                lb.pager.setUri(panel.uri);
            });
        });

        l.$elems.Buttons_Subpanel((elem: Element, keys: Array<any>) => {
            elem.addEventListener('click', (evt) => {
                evt.preventDefault();
                
                let panel = lb.panels[keys[0]];
                ts0Assert(panel !== undefined);

                let subpanel = panel.subpanels[keys[1]];
                ts0Assert(subpanel !== undefined);
                
                lb.pager.setUri(subpanel.uri);
            });
        });

        lb.msgs.hideLoading();

        if (lb.mainFn !== null)
            lb.mainFn(this);

        this.$view = l;
    }

}