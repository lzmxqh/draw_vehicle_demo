import CalculateUtil from './utils/CalculateUtil'

const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawArea extends cc.Component {

    public static readonly DRAW_VEHICLE: string = "draw_vehicle";
    public static readonly DRAW_CIRCLE_R: number = 5;

    @property(cc.Graphics)
    private drawLine: cc.Graphics = null;

    private drawPoints: Array<cc.Vec2> = [];

    private currentPos: cc.Vec2;
    private recordPos: cc.Vec2;

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected start(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: cc.Event.EventTouch): void {
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());

        this.drawLine.moveTo(pos.x, pos.y);
        this.recordPos = cc.v2(pos.x, pos.y);
        this.drawPoints.push(cc.v2(pos.x, pos.y));
    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        let pos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());

        let widthLimit: number = (this.node.width + DrawArea.DRAW_CIRCLE_R) / 2;
        let heightLimit: number = (this.node.height + DrawArea.DRAW_CIRCLE_R) / 2;

        if (pos.x < -widthLimit || pos.x > widthLimit) {
            return;
        }
        if (pos.y < -heightLimit || pos.y > heightLimit) {
            return;
        }
        this.drawLine.lineTo(pos.x, pos.y);
        this.drawLine.stroke();
        this.drawLine.moveTo(pos.x, pos.y);

        // 记录当前手移动到的点
        this.currentPos = cc.v2(pos.x, pos.y);
        //求两点之间的距离
        let subVec: cc.Vec2 = this.currentPos.sub(this.recordPos);
        let distance: number = subVec.mag() + 5;

        // 如果距离大于一定值，这里的25是预制体的width
        if (distance >= 25) {
            // 将此时的触摸点设为记录点
            this.recordPos = cc.v2(pos.x, pos.y);

            this.drawPoints.push(cc.v2(pos.x, pos.y));
        }
    }

    private onTouchEnd(event: cc.Event.EventTouch): void {
        if (this.drawPoints.length <= 1) {
            this.drawPoints = [];
            return;
        }
        let customEvent: cc.Event.EventCustom = new cc.Event.EventCustom(DrawArea.DRAW_VEHICLE, true);
        customEvent.setUserData(this.drawPoints);
        this.node.dispatchEvent(customEvent);

        this.drawLine.clear();
        this.drawPoints = [];
    }

}
