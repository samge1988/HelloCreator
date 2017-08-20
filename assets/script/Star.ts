const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({default: 0})
    pickRadius = 0;

    game = null;

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
        //let playerPos = this.game.player.getcen
    }

}
