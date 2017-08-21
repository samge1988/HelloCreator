const {ccclass, property} = cc._decorator;

import ScoreFX from "./ScoreFX";

@ccclass
export default class NewClass extends cc.Component {

    scoreFX: ScoreFX = null;
    
    init (scoreFX) {
        this.scoreFX = scoreFX;
    }

    hideFX () {
        this.scoreFX.despawn();
    }
}
