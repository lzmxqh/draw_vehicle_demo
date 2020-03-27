import DrawArea from "./DrawArea";
import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends cc.Component {

    @property(cc.Node)
    ground: cc.Node = null;

    @property(cc.Node)
    drawArea: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    protected onDestroy(): void {
        this.node.off(DrawArea.DRAW_VEHICLE, this.drawVehicle, this);
    }

    protected start(): void {
        this.node.on(DrawArea.DRAW_VEHICLE, this.drawVehicle, this);

        // cc.debug.setDisplayStats(false);
    }

    private drawVehicle(event: cc.Event.EventCustom): void {
        event.stopPropagation();
        (this.player.getComponent('Player') as Player).drawVehicle(event.getUserData());
    }

    // protected update(): void {

    // }
}
