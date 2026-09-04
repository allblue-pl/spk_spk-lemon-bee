import { ts0, type TS0ValueType } from "@allblue/ts0";
import type { ModuleFn } from "./ts-types.ts";

export type LBSubpanelPreset = {
    name: string,
    moduleFn: ModuleFn|null,
    uri?: string|null,

    permissions: Array<string>,

    alias: string,
    title: string,
    faIcon?: string|null,
    image?: string|null,    

    shortcut: boolean,
}
export type LBSubpanelPreset_Parsed = LBSubpanelPreset & {
    uri: string,

    faIcon: string|null,
    image: string|null,   
}
export const presets_LBSubpanel: TS0ValueType = ts0.TPreset({
    name: 'string',
    moduleFn: [ 'function', ts0.TNull ],
    uri: [ 'string', ts0.TNull, ts0.TDefault(null) ],

    permissions: ts0.TArray("string"),

    alias: 'string',
    title: 'string',
    faIcon: [ "string", ts0.TNull, ts0.TDefault(null) ],
    image: [ "string", ts0.TNull, ts0.TDefault(null) ],    

    shortcut: "boolean",
});
export type LBSubpanel = LBSubpanelPreset_Parsed;

type LBPanel_Base = {
    permissions: Array<string>,

    name: string,
    shortcut: boolean,
    
    menu: {
        shortcut: boolean,
        uri: string|null,
        action: (() => void)|null,
    },

    alias: string,
    title: string,
};
export type LBPanelPreset = LBPanel_Base & {
    faIcon?: string|null,
    image?: string|null,

    subpanels: Array<LBSubpanelPreset>,
}
export type LBPanel = LBPanel_Base & {
    faIcon: string|null,
    image: string|null,

    subpanels: Array<LBSubpanel>,
    
    uri: string,
}
export const presets_LBPanel: TS0ValueType = ts0.TPreset({
    permissions: [ ts0.TDefault([]), Array ],

    name: 'string',
    shortcut: [ 'boolean', ts0.TDefault(true), ],
    
    menu: ts0.TPreset({
        shortcut: [ 'boolean', ts0.TDefault(true), ],
        uri: [ 'string', ts0.TNull, ts0.TDefault(null), ],
        action: [ 'function', ts0.TNull, ts0.TDefault(null), ],
    }),

    alias: 'string',
    title: 'string',
    faIcon: [ 'string', ts0.TNull, ts0.TDefault(null), ],
    image: [ 'string', ts0.TNull, ts0.TDefault(null), ],
    
    subpanels: ts0.TArray(presets_LBSubpanel),

    uri: [ "string", ts0.TDefault("") ],
});