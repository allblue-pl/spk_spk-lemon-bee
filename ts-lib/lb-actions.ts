import { ts0, type TS0ValueType } from "@allblue/ts0";

export type LBActions = {
    changePassword_Async: LBActions_ChangePassword,
    logIn_Async: (login: string, password: string) => Promise<LBActions_LogInResult>,
    logOut_Async: LBActions_LogOut,
    remindPassword_Async: LBActions_RemindPassword,
    resetPassword_Async: LBActions_ResetPassword,
};

export type LBActions_ChangePassword = 
        (password: string, newPassword: string) => 
        Promise<LBActions_ChangePasswordResult>;
export type LBActions_LogIn = 
        (login: string, password: string) => 
        Promise<LBActions_LogInResult>;
export type LBActions_LogOut = 
        () => Promise<LBActions_LogOutResult>;
export type LBActions_RemindPassword = 
        ((login: string) => 
        Promise<LBActions_RemindPasswordResult>)|null;
export type LBActions_ResetPassword = 
        ((resetPasswordHash: string, newPassword: string) => 
        Promise<LBActions_ResetPasswordResult>)|null;


export type LBActions_ChangePasswordResult = {
    success: boolean,
    message: string,
}

export type LBActions_LogInResult_User = {
    loggedIn: boolean,
    login: string,
    permissions: Array<string>,
}

export type LBActions_LogInResult = {
    user: LBActions_LogInResult_User,
    error: string|null,
    reload: boolean,
};
export const presets_LBActions_LogInResult: TS0ValueType = ts0.TPreset({
    user: [ ts0.TPreset({
        loggedIn: 'boolean',
        login: 'string',
        permissions: ts0.TArray('string'),
    }), ts0.TNull ],
    error: [ 'string', ts0.TNull ],
    reload: [ 'boolean' ],
});

export type LBActions_LogOutResult = {
    error: string|null,
};
export const presets_LBActions_LogOutResult: TS0ValueType = ts0.TPreset({
    error: [ 'string', ts0.TNull ],
});

export type LBActions_RemindPasswordResult = {
    success: boolean,
    message: string,
};

export type LBActions_ResetPasswordResult = {
    success: boolean,
    message: string,
};