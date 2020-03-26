// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    protected onDestroy(): void {

    }

    protected onLoad(): void {
        let jumpAction: cc.ActionInterval = this.setJumpAction();
        this.node.runAction(jumpAction);
    }

    protected start(): void {

    }

    private setJumpAction(): cc.ActionInterval {
        let jumpUp = cc.moveBy(200, cc.v2(0, 200)).easing(cc.easeCircleActionOut);
        let jumpDown = cc.moveBy(200, cc.v2(0, -200)).easing(cc.easeCircleActionIn);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
    }

    // update (dt) {}
}
