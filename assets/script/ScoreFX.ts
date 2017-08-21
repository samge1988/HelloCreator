const {ccclass, property} = cc._decorator;

import Game from "./Game";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    game: Game = null;

    init (game)
    {
        this.game = game;
        this.anim.getComponent('ScoreAnim').init(this);
    }

    despawn ()
    {
        this.game.despawnScoreFX(this.node);
    }

    play ()
    {
        this.anim.play('score');
    }
}
