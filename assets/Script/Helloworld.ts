const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Sprite)
    ground: cc.Sprite = null;

    @property(cc.Sprite)
    drawArea: cc.Sprite = null;

    @property(cc.Sprite)
    player: cc.Sprite = null;

    protected onDestroy(): void {

    }

    protected start(): void {

    }
}
