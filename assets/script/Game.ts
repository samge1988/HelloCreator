const {ccclass, property} = cc._decorator;

import Player from "./Player";
import ScoreFX from "./ScoreFX";
import Star from "./Star";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    scoreFXPrefab: cc.Prefab = null;

    @property({default: 0})
    maxStarDuration: number = 0;

    @property({default: 0})
    minStarDuration: number = 0;

    @property(cc.Node)
    ground: cc.Node = null;

    @property(Player)
    player: Player = null;

    @property(cc.Label)
    scoreDisplay: cc.Label = null;

    @property({
        default: '',
        url: cc.AudioClip
    })
    scoreAudio = '';

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Node)
    gameOverNode: cc.Node = null;

    @property(cc.Label)
    controlHintLabel: cc.Label = null;

    groundY: number = 0;

    currentStar = null;
    currentStarX = 0;
    timer = 0;
    starDuration = 0;
    isRunning = false;

    score = 0

    starPool = new cc.NodePool('Star');
    scorePool = new cc.NodePool('ScoreFX');

    onLoad ()
    {
        this.groundY = this.ground.y + this.ground.height;

        let hintText = cc.sys.isMobile ? '触摸使小怪兽移动' : '使用左右键或AD键操作';
        this.controlHintLabel.string = hintText;
    }

    onStartGame ()
    {
        this.resetScore();
        this.isRunning = true;
        this.btnNode.setPositionX(3000);
        this.gameOverNode.active = false;
        this.player.startMoveAt(cc.p(0, this.groundY));

        this.spawnNewStar();
    }

    spawnNewStar ()
    {
        let newStar = null;
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this);
        } else {
            newStar = cc.instantiate(this.starPrefab);
        }

        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent(Star).init(this);
        
        this.startTimer();
        this.currentStar = newStar;
    }

    despawnStar (star)
    {
        this.starPool.put(star);
        this.spawnNewStar();
    }

    startTimer ()
    {
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition ()
    {
        if (!this.currentStar) {
            this.currentStarX = cc.random0To1() * this.node.width / 2;
        }

        let ranX = 0;
        let ranY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        
        let maxX = this.node.width / 2;
        if (this.currentStarX >= 0) {
            ranX = -cc.random0To1() * maxX;
        } else {
            ranX = -cc.random0To1() * maxX;
        }

        this.currentStarX = ranX;

        return cc.p(ranX, ranY);
    }

    gainScore (pos)
    {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();

        let fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();

        cc.audioEngine.play(this.scoreAudio, false, 1);
    }

    resetScore ()
    {
        this.score = 0;
        this.scoreDisplay.string = 'Score: 0';
    }

    spawnScoreFX ()
    {
        let fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent(ScoreFX);
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent(ScoreFX);
            fx.init(this);
            return fx;
        }
    }

    despawnScoreFX (scoreFX)
    {
        this.scorePool.put(scoreFX);
    }

    update (dt)
    {
        if (!this.isRunning) {
            return;
        }

        if (this.timer > this.maxStarDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    gameOver ()
    {
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        this.isRunning = false;
        this.btnNode.setPositionX(0);
    }
    

    

    

    
}
