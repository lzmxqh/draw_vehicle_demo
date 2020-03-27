import DrawArea from './DrawArea'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Graphics)
    private vehicle: cc.Graphics = null;

    @property(cc.Sprite)
    private wheel_rear: cc.Sprite = null;

    @property(cc.Sprite)
    private wheel_front: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    protected onDestroy(): void {

    }

    protected onLoad(): void {

    }

    protected start(): void {
        this.node.active = false;
    }

    /**画车 */
    public drawVehicle(drawPoint: Array<cc.Vec2>): void {
        if (drawPoint.length <= 0) {
            return;
        }
        this.vehicle.clear();
        drawPoint.forEach((point: cc.Vec2) => {
            this.vehicle.circle(point.x, point.y, DrawArea.DRAW_CIRCLE_R);
        });
        this.vehicle.stroke();
        this.vehicle.fill();

        this.drawWheel(drawPoint);

        this.node.active = true;
    }

    /**画轮子 */
    private drawWheel(drawPoint: Array<cc.Vec2>): void {
        let rearPos: cc.Vec2 = drawPoint[0];
        let frontPos: cc.Vec2 = drawPoint[drawPoint.length - 1];

        this.wheel_rear.node.setPosition(rearPos);
        this.wheel_front.node.setPosition(frontPos);
    }

    // update (dt) {}
}
