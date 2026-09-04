import ts0, { type TS0ValueType } from "@allblue/ts0";
import type LBSystem from "./LBSystem.ts";
import type { Layout, Module } from "spocky";
import type { Page, PageInfo, PagerArgs } from "ab-pager";
import type MainModule from "./modules/MainModule.ts";

/* Listeners */
export type AfterPageListener = (page: PageInfo, source: Page|null, 
        pageArgs: PagerArgs) => void;
export type BeforePageListener = (page: PageInfo, source: Page|null, 
        pageArgs: PagerArgs) => void;
export type OnBackListener = () => void;
/* / Listeners */

export type MainFn = (main: MainModule) => void;

export type ModuleFn = (lb: LBSystem, page: PageInfo, source: Page|null, 
        pageArgs: {[argName: string]: string}) => Module;