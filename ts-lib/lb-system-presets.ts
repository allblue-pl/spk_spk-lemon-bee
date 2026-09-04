import type { Layout } from "spocky"
import ts0, { type TS0ValueType } from "@allblue/ts0";
import AccountLayout from "../$layouts/AccountLayout.ts";
import BodyLayout from "../$layouts/BodyLayout.ts";
import LogInLayout from "../$layouts/LogInLayout.ts";
import LogIn_FormLayout from "../$layouts/LogIn_FormLayout.ts";
import MainLayout from "../$layouts/MainLayout.ts";
import RemindPasswordLayout from "../$layouts/RemindPasswordLayout.ts";
import ResetPasswordLayout from "../$layouts/ResetPasswordLayout.ts";
import TopMenuLayout from "../$layouts/TopMenuLayout.ts";
import UserInfoLayout from "../$layouts/UserInfoLayout.ts";
import { presets_LBPanel, type LBPanelPreset as LBPanelPreset } from "./lb-panel-presets.ts";
import type { LBActions } from "./lb-actions.ts";
import type { MainFn } from "./ts-types.ts";

export type LBLayouts = {
    Account?: new () => Layout,
    Body?: new () => Layout,
    LogIn?: new () => Layout,
    LogIn_Form?: new () => Layout,
    Main?: new () => Layout,
    RemindPassword?: new () => Layout,
    ResetPassword?: new () => Layout,
    TopMenu?: new () => Layout,
    UserInfo?: new () => Layout,
}
export type LBLayouts_Parsed = {
    Account: new () => Layout,
    Body: new () => Layout,
    LogIn: new () => Layout,
    LogIn_Form: new () => Layout,
    Main: new () => Layout,
    RemindPassword: new () => Layout,
    ResetPassword: new () => Layout,
    TopMenu: new () => Layout,
    UserInfo: new () => Layout,
}

export type LBSystemPresets = {
    actions: LBActions,
    aliases: {
        account: string,
        main: string,
        logIn: string,
        remindPassword: string,
        resetPassword: string,
    },
    dev?: {
        login: string,
        password: string,
    },
    setDefaultPageFn?: (() => void)|null,
    images: {
        logo: string|null,
        logo_Main: string|null,
    },
    layouts?: LBLayouts,
    mainFn: MainFn|null,
    panels: Array<LBPanelPreset>,
    shows?: {
        home?: boolean,
        userInfo?: boolean,
    },
    textFn: (text: string) => string,
    title: string,
    uris?: {
        base?: string,
        package?: string|null,
    },
    
    settings?: {
        hasRemindPassword?: boolean,
    },
};
export type LBSystemPresets_Parsed = LBSystemPresets & {
    dev: {
        login: string,
        password: string,
    },
    setDefaultPageFn: (() => void)|null,
    layouts: LBLayouts_Parsed,
    shows: {
        home: boolean,
        userInfo: boolean,
    },
    uris: {
        account: string,
        base: string,
        package: string|null,
    },
    
    settings: {
        hasRemindPassword: boolean,
    },
};
export const presets_LBSystemPresets: TS0ValueType = ts0.TPreset({
    actions: ts0.TPreset({
        changePassword_Async: 'function',
        logIn_Async: 'function',
        logOut_Async: 'function',
        remindPassword_Async: [ 'function', ts0.TNull, ts0.TDefault(null) ],
        resetPassword_Async: [ 'function', ts0.TNull, ts0.TDefault(null) ],
    }),
    aliases: ts0.TPreset({
        account: [ 'string', ts0.TDefault('account') ],
        main: [ 'string', ts0.TDefault('') ],
        logIn: [ 'string', ts0.TDefault('log-in') ],
        remindPassword: [ 'string', ts0.TDefault('remind-password') ],
        resetPassword: [ 'string', ts0.TDefault('reset-password') ],
    }),
    dev: [ ts0.TPreset({
        email: [ 'string', ts0.TDefault('') ],
        login: [ 'string', ts0.TDefault('') ],
        password: [ 'string', ts0.TDefault('') ],
    }), ts0.TDefault({}), ],
    setDefaultPageFn: [ 'function', ts0.TNull, ts0.TDefault(null) ],
    images: ts0.TPreset({
        logo: [ 'string', ts0.TNull, ts0.TDefault(null), ],
        logo_Main: [ 'string', ts0.TNull, ts0.TDefault(null), ],
    }),
    layouts: [ ts0.TPreset({
        'Account': [ 'function', ts0.TDefault(AccountLayout), ],
        'Body': [ 'function', ts0.TDefault(BodyLayout), ],
        'LogIn': [ 'function', ts0.TDefault(LogInLayout), ],
        'LogIn_Form': [ 'function', 
                ts0.TDefault(LogIn_FormLayout), ],
        'Main': [ 'function', ts0.TDefault(MainLayout), ],
        'RemindPassword': [ 'function', 
                ts0.TDefault(RemindPasswordLayout), ],
        'ResetPassword': [ 'function', 
                ts0.TDefault(ResetPasswordLayout), ],
        'TopMenu': [ 'function', ts0.TDefault(TopMenuLayout), ],
        'UserInfo': [ 'function', ts0.TDefault(UserInfoLayout), ],
    }), ts0.TDefault({}), ],  
    mainFn: [ 'function', ts0.TNull, ts0.TDefault(null) ],
    panels: ts0.TArray(presets_LBPanel),
    shows: [ ts0.TPreset({
        home: [ 'boolean', ts0.TDefault(true), ],
        userInfo: [ 'boolean', ts0.TDefault(true), ],
    }), ts0.TDefault({}) ],
    textFn: 'function',
    title: [ 'string', ts0.TDefault('LemonBee') ],
    uris: [ ts0.TPreset({
        account: [ 'string', ts0.TDefault('#') ],
        base: [ 'string', ts0.TDefault('') ],
        package: [ 'string', ts0.TNull, ts0.TDefault(null) ],
        // api: [ 'string' ],
    }), ts0.TDefault({}) ],
    
    settings: [ ts0.TPreset({
        hasRemindPassword: [ ts0.TDefault(true), 'boolean' ],
    }), ts0.TDefault({}) ],
})

export type LBUris = {
    account: string,
    base: string,
    main: string,
    package: string,
    remindPassword: string,
};

export type LBUser = {
    loggedIn: boolean,
    permissions: Array<string>,
    login: string,
};
export const presets_LBUser = ts0.TPreset({
    loggedIn: "boolean",
    permissions: ts0.TArray("string"),
    login: "string",
});