const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({default: 0})
    jumpHeight = 0;

    @property({default: 0})
    jumpDuration = 0;

    @property({default: 0})
    squashDuration = 0;

    @property({default: 0})
    maxMoveSpeed = 0;

    @property({default: 0})
    accel = 0;

    @property({
        default: '',
        url: cc.AudioClip
    })
    jumpAudio = '';

    accLeft = false;
    accRight = false;

    xSpeed = 0;

    minPosX = 0;
    maxPosX = 0;

    jumpAction = null;

    onLoad()
    {
        //this.enabled = false;
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;

        this.jumpAction = this.setJumpAction();

        this.setInputControl();
    }

    setInputControl()
    {
        let self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                    default:
                        break;
                }
            },
            onKeyReleased: function(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accRight = false;
                    default:
                        break;
                }
            }
        }, this.node);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                var touchLoc = touch.getLocation();
                if (touchLoc.x >= cc.winSize.width/2) {
                    self.accLeft = false;
                    self.accRight = true;
                } else {
                    self.accLeft = true;
                    self.accRight = false;
                }
                return true;
            },
            onTouchEnded: function(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    }

    setJumpAction() 
    {
        let jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        let jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        let squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        let stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        let scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
        let callback = cc.callFunc(this.playJumpSound, this);

        return cc.repeatForever(cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback));
    }

    playJumpSound()
    {
        cc.audioEngine.play(this.jumpAudio, false, 1);
    }

    getCenterPos()
    {
        let centerPos = cc.p(this.node.x, this.node.y + this.node.height / 2);
        return centerPos;
    }

    startMoveAt(pos)
    {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.setJumpAction());
    }

    stopMove()
    {
        this.node.stopAllActions();
    }

    update(dt)
    {
        if (this.accLeft == true) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight == true) {
            this.xSpeed += this.accel * dt;
        }

        if (Math.abs(this.xSpeed) > this.maxMoveSpeed)
        {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        this.node.x += this.xSpeed * dt;

        if (this.node.x > this.maxPosX) {
            this.node.x = this.maxPosX;
            this.xSpeed = 0;
        } else if (this.node.x < this.minPosX) {
            this.node.x = this.minPosX;
            this.xSpeed = 0;
        }
    }
}
