const {ccclass, property} = cc._decorator;

import Player from "./Player";
import Game from "./Game";

@ccclass
export default class NewClass extends cc.Component {

    @property({default: 0})
    pickRadius = 0;

    game: Game = null;

    onLoad() {
        this.enabled = false;
    }

    init (game)
    {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    }

    reuse (game)
    {
        this.init(game);
    }

    getPlayerDistance ()
    {
        let playerPos = (this.game.player as Player).getCenterPos();
        let dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    }

    onPicked ()
    {
        cc.log("onPicked");
        let pos = this.node.position;
        this.game.gainScore(pos);
        this.game.despawnStar(this.node);
    }

    update (dt)
    {
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }

        let opacityRatio = 1 - this.game.timer / this.game.starDuration;
        let minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

}
