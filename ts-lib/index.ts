import LBSystem from "./LBSystem.ts";

export class spkLemonBee_Class {
    get System(): typeof LBSystem {
        return LBSystem;
    }


    constructor() {

    }
}
const spkLemonBee = new spkLemonBee_Class();
export default spkLemonBee;