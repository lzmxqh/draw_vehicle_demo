import DrawArea from "./DrawArea";
import Vehicle from "./Vehicle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends cc.Component {

    @property(cc.Node)
    ground: cc.Node = null;

    @property(cc.Node)
    drawArea: cc.Node = null;

    @property(cc.Node)
    vehicle: cc.Node = null;

    protected onDestroy(): void {
        this.node.off(DrawArea.DRAW_VEHICLE, this.onDrawVehicle, this);
    }

    protected onLoad(): void {
        cc.director.getPhysicsManager().enabled = true; // 开启物理引擎需要写在 onLoad 中
    }

    protected start(): void {
        cc.debug.setDisplayStats(false);
        this.openPhysics();

        this.node.on(DrawArea.DRAW_VEHICLE, this.onDrawVehicle, this);
    }

    private openPhysics(): void {
        let manager: cc.PhysicsManager = cc.director.getPhysicsManager();

        manager.enabledAccumulator = true;

        manager.debugDrawFlags = 1;     // 设置调试绘制标志

        cc.PhysicsManager.FIXED_TIME_STEP = 1 / 30;
        cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
        cc.PhysicsManager.POSITION_ITERATIONS = 8;
    }

    /**监听画车 */
    private onDrawVehicle(event: cc.Event.EventCustom): void {
        event.stopPropagation();
        (this.vehicle.getComponent('Vehicle') as Vehicle).updateVehicle(event.getUserData());
    }

    // protected update(): void {

    // }
}
