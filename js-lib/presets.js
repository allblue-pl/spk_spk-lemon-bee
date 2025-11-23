'use strict';

import js0 from "js0";

class presets_Class {
    get logInResult() { return js0.fn(
    js0.Preset_Type, () => {
        return js0.Preset({
            user: [ js0.RawObject, js0.Null, js0.Default(null) ],
            error: [ 'string', js0.Null, js0.Default(null) ],
            reload: [ 'boolean', js0.Default(false) ],
        });
    })}

    get logOutResult() { return js0.fn(
    js0.Preset_Type, () => {
        return js0.Preset({
            error: [ 'string', js0.Null, js0.Default(null) ],
        });
    })}

    get panel() { return js0.fn(
    js0.Preset_Type, () => {
        return js0.Preset({
            permissions: [ js0.Default([]), Array ],

            name: 'string',
            shortcut: [ 'boolean', js0.Default(true), ],
            
            menu: js0.Preset({
                shortcut: [ 'boolean', js0.Default(true), ],
                uri: [ 'boolean', js0.Null, js0.Default(null), ],
                action: [ 'function', js0.Null, js0.Default(null), ],
            }),

            alias: 'string',
            title: 'string',
            faIcon: [ 'string', js0.Null, js0.Default(null), ],
            image: [ 'string', js0.Null, js0.Default(null), ],
            
            subpanels: js0.Iterable(this.subpanel),
        });
    })}

    get subpanel() { return js0.fn(
    js0.Preset_Type, () => {
        return js0.Preset({
            name: 'string',
            moduleFn: [ 'function', js0.Null ],
            uri: [ 'string', js0.Null, js0.Default(null), ],

            permissions: [ js0.Default([]), Array ],

            alias: 'string',
            title: 'string',
            faIcon: [ js0.Default(null), 'string' ],
            image: [ js0.Default(null), 'string' ],    

            shortcut: [ js0.Default(true), 'boolean' ],
        });
    })}

    constructor() { return js0.fn(arguments,
    '', () => {
        
    })}
}
export default presets = new presets_Class();