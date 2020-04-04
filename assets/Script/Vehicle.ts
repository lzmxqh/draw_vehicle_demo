import DrawArea from './DrawArea'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Vehicle extends cc.Component {

    @property(cc.Graphics)
    private vehicle: cc.Graphics = null;

    @property(cc.Node)
    private wheel_rear: cc.Node = null;

    @property(cc.Node)
    private wheel_front: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    protected onDestroy(): void {

    }

    protected onLoad(): void {
        this.node.active = false;
    }

    protected start(): void {

    }

    /**画车 */
    public drawVehicle(drawPoints: Array<cc.Vec2>): void {
        if (drawPoints.length <= 0) {
            return;
        }
        this.node.y += 100;
        this.vehicle.clear();
        drawPoints.forEach((point: cc.Vec2) => {
            this.vehicle.circle(point.x, point.y, DrawArea.DRAW_CIRCLE_R);
        });
        this.vehicle.stroke();
        this.vehicle.fill();

        let pickPoints: Array<cc.Vec2> = this.pickPoint(drawPoints);
        this.vehicle.node.getComponent(cc.PhysicsChainCollider).points = pickPoints;

        this.drawWheel(drawPoints);

        if (!this.node.active) {
            this.node.active = true;
        }
    }

    /**选点 */
    private pickPoint(drawPoints: Array<cc.Vec2>): Array<cc.Vec2> {
        let pickPoints: Array<cc.Vec2> = [];

        let length: number = drawPoints.length;         // 总点数
        let ratio: number = Math.ceil(length / 50);     // 挑选比例，向上取值
        for (let i = 0; i < drawPoints.length; i += ratio) {
            pickPoints.push(drawPoints[i]);
        }
        if (pickPoints.length < 99) {
            pickPoints.push(drawPoints[length - 1]);    // 最后一个点
        }
        return pickPoints;
    }

    /**画轮子 */
    private drawWheel(drawPoints: Array<cc.Vec2>): void {
        let rearPos: cc.Vec2 = drawPoints[0];
        let frontPos: cc.Vec2 = drawPoints[drawPoints.length - 1];

        this.wheel_rear.position = rearPos;
        this.wheel_front.position = frontPos;

        let rearWheel: cc.WheelJoint = this.vehicle.node.getComponents(cc.WheelJoint)[0];
        let frontWheel: cc.WheelJoint = this.vehicle.node.getComponents(cc.WheelJoint)[1];

        rearWheel.anchor = rearPos;
        frontWheel.anchor = frontPos;

        console.log(rearWheel);
    }

    // update (dt) {}
}
