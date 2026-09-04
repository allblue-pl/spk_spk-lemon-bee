
let r = new RegExp("^Error in (.+?):(\\d+):(\\d+) (.*)$");

let str = `
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\LBSystem.ts:545:4 Class 'LBSystem' function '#setBodyModule' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\LBSystem.ts:549:4 Class 'LBSystem' function '#setPanelModule' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\node_modules\\@allblue\\ts0\\ts-lib\\index.ts:96:4 Class 'ts0_Class' function 'args' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\node_modules\\@allblue\\ts0\\ts-lib\\index.ts:517:4 Class 'ts0_Class' function 'fn' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\node_modules\\@allblue\\ts0\\ts-lib\\index.ts:541:4 Class 'ts0_Class' function 'fnAsync' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\AccountModule.ts:77:4 Class 'AccountModule' function 'changePassword' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\AccountModule.ts:104:4 Class 'AccountModule' function 'message_Clear' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\AccountModule.ts:109:4 Class 'AccountModule' function 'message_SetError' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\AccountModule.ts:114:4 Class 'AccountModule' function 'message_SetSuccess' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\BodyModule.ts:44:4 Class 'BodyModule' function 'setContent' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\BodyModule.ts:49:4 Class 'BodyModule' function '_getMenuLayout' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\BodyModule.ts:108:4 Class 'BodyModule' function '_getUserInfoLayout' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\LogInModule.ts:40:4 Class 'LogInModule' function 'clearError' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\LogInModule.ts:47:4 Class 'LogInModule' function 'logIn' does not have return type declaration.
Error in C:\\SfTd\\AllBlue\\Development\\SPK_LemonBee\\git\\spk_spk-lemon-bee\\ts-lib\\modules\\RemindPasswordModule.ts:25:4 Class 'RemindPasswordModule' function 'clearError' does not have return type declaration.
`;

let str_Arr = str.split("\n");
console.log(str_Arr);

for (let l of str_Arr) {
    console.log(l.match(r));
}