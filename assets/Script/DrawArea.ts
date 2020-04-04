import CalculateUtil from './utils/CalculateUtil'

const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawArea extends cc.Component {

    public static readonly DRAW_VEHICLE: string = "drawVehicle";
    public static readonly DRAW_CIRCLE_R: number = 5;

    @property(cc.Graphics)
    private drawLine: cc.Graphics = null;

    private drawPoints: Array<cc.Vec2> = [];

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected start(): void {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        let goalPos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());

        let widthLimit: number = (this.node.width + DrawArea.DRAW_CIRCLE_R) / 2;
        let heightLimit: number = (this.node.height + DrawArea.DRAW_CIRCLE_R) / 2;

        if (goalPos.x < -widthLimit || goalPos.x > widthLimit) {
            return;
        }
        if (goalPos.y < -heightLimit || goalPos.y > heightLimit) {
            return;
        }
        this.calculateDrawCircle(goalPos);
        this.drawLine.stroke();
        this.drawLine.fill();
    }

    /**计算画线（多个圆组成） */
    private calculateDrawCircle(goalPos: cc.Vec2): void {
        if (this.drawPoints.length <= 0) {
            this.drawCircle(goalPos);
            return;
        }

        let curPos: cc.Vec2 = this.drawPoints[this.drawPoints.length - 1];
        let distance: number = DrawArea.DRAW_CIRCLE_R / 2;      // 两点间距离

        let count: number = CalculateUtil.calculatePointCount(curPos, goalPos, distance);
        if (count <= 0) {
            this.drawCircle(goalPos);
            return;
        }

        let rad: number = CalculateUtil.calculateRad(curPos, goalPos);
        if (isNaN(rad)) {
            this.drawCircle(goalPos);
            return;
        }

        for (let i = 0; i < count; i++) {
            let stepX = Math.cos(rad) * distance;
            let stepY = Math.sin(rad) * distance;

            curPos.x += stepX;
            curPos.y += stepY;

            let drawPos: cc.Vec2 = new cc.Vec2(curPos.x, curPos.y);
            this.drawCircle(drawPos);
        }
        this.drawCircle(goalPos);
    }

    /**画圆 */
    private drawCircle(curPos: cc.Vec2): void {
        this.drawPoints.push(curPos);
        this.drawLine.circle(curPos.x, curPos.y, DrawArea.DRAW_CIRCLE_R);
    }

    private onTouchEnd(event: cc.Event.EventTouch): void {
        if (this.drawPoints.length <= 0) {
            return;
        }
        let customEvent: cc.Event.EventCustom = new cc.Event.EventCustom(DrawArea.DRAW_VEHICLE, true);
        customEvent.setUserData(this.drawPoints);
        this.node.dispatchEvent(customEvent);

        this.drawLine.clear();
        this.drawPoints = [];
    }

    // protected update(): void {

    // }
}
