import DrawArea from './DrawArea'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Vehicle extends cc.Component {

    @property(cc.Graphics)
    private vehicle: cc.Graphics = null;

    @property(cc.Prefab)
    private wheelPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private linePrefab: cc.Prefab = null;

    private vehicleBodys: Array<cc.Node> = [];
    private wheelRear: cc.Node = null;
    private wheelFront: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    protected onDestroy(): void {

    }

    protected onLoad(): void {
        this.node.active = false;
    }

    protected start(): void {

    }

    /**画车身 */
    public drawVehicle(drawPoints: Array<cc.Vec2>): void {
        if (drawPoints.length <= 0) {
            return;
        }
        this.node.x = 0;
        this.node.y = 200;

        this.vehicle.clear();
        this.vehicle.moveTo(drawPoints[0].x, drawPoints[1].y);
        drawPoints.forEach((point: cc.Vec2) => {
            this.vehicle.lineTo(point.x, point.y);
            this.vehicle.stroke();
            this.vehicle.moveTo(point.x, point.y);
        });

        this.resetVehicleBody();
        this.updateVehicle(drawPoints);
        this.drawWheel(drawPoints);

        if (!this.node.active) {
            this.node.active = true;
        }
    }

    /**重置车身刚体 */
    private resetVehicleBody(): void {
        let vehicleNode: cc.Node = this.vehicle.node;   // 获取车节点

        // 清空车身刚体小部件
        let weldJoints: Array<cc.WeldJoint> = vehicleNode.getComponents(cc.WeldJoint);
        for (let i = weldJoints.length - 1; i >= 0; i--) {
            let weld: cc.WeldJoint = weldJoints[i];
            weld.destroy();
        }

        // 清空轮子
        let wheelJoints: Array<cc.WheelJoint> = vehicleNode.getComponents(cc.WheelJoint);
        for (let i = wheelJoints.length - 1; i >= 0; i--) {
            let wheel: cc.WheelJoint = wheelJoints[i];
            wheel.destroy();
        }

        // 重置线性速度
        vehicleNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);

        vehicleNode.removeAllChildren();
        this.vehicleBodys = [];

        this.wheelRear = null;
        this.wheelFront = null;
    }

    /**刷新车身刚体 */
    private updateVehicle(drawPoints: Array<cc.Vec2>): void {
        let vehicleNode: cc.Node = this.vehicle.node;   // 获取车节点

        let recordPos: cc.Vec2 = drawPoints[0];
        for (let i = 1; i < drawPoints.length; i++) {
            let curPos: cc.Vec2 = drawPoints[i];
            let subVec: cc.Vec2 = curPos.sub(recordPos);
            let distance: number = subVec.mag() + 5;

            // 给定方向向量
            let tempVec: cc.Vec2 = cc.v2(0, 10);

            // 求两点的方向角度
            let rotateVec: number = subVec.signAngle(tempVec) / Math.PI * 180 - 90;

            // 创建车刚体小部件
            let lineItem: cc.Node = cc.instantiate(this.linePrefab);
            lineItem.rotation = rotateVec;
            lineItem.position = curPos;
            lineItem.setParent(vehicleNode);

            // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
            lineItem.width = distance;

            lineItem.getComponent(cc.PhysicsBoxCollider).offset.x = -lineItem.width / 2;
            lineItem.getComponent(cc.PhysicsBoxCollider).size.width = lineItem.width;
            lineItem.getComponent(cc.PhysicsBoxCollider).apply();

            // 焊接车刚体小部件
            let weldJoint: cc.WeldJoint = vehicleNode.addComponent(cc.WeldJoint);
            weldJoint.connectedBody = lineItem.getComponent(cc.RigidBody);
            weldJoint.anchor = curPos;
            weldJoint.referenceAngle = rotateVec;

            this.vehicleBodys.push(lineItem);

            recordPos = cc.v2(curPos.x, curPos.y);
        }
    }

    /**画轮子 */
    private drawWheel(drawPoints: Array<cc.Vec2>): void {
        let rearPos: cc.Vec2 = drawPoints[0];
        let frontPos: cc.Vec2 = drawPoints[drawPoints.length - 1];

        let vehicleNode: cc.Node = this.vehicle.node;

        let wheelRear: cc.Node = cc.instantiate(this.wheelPrefab);
        vehicleNode.addChild(wheelRear);
        wheelRear.position = rearPos;

        let wheelFront: cc.Node = cc.instantiate(this.wheelPrefab);
        vehicleNode.addChild(wheelFront);
        wheelFront.position = frontPos;

        wheelRear.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        wheelFront.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);

        wheelRear.getComponent(cc.PhysicsCircleCollider).apply();
        wheelFront.getComponent(cc.PhysicsCircleCollider).apply();

        // 加入轮子关节
        // 后轮
        let wheelJointRear: cc.WheelJoint = vehicleNode.addComponent(cc.WheelJoint);
        wheelJointRear.connectedBody = wheelRear.getComponent(cc.RigidBody);
        wheelJointRear.anchor = rearPos;
        // wheelJointRear.maxMotorTorque = 1000;
        // wheelJointRear.motorSpeed = 1000;
        wheelJointRear.enableMotor = true;
        wheelJointRear.frequency = 5;

        // 前轮
        let wheelJointFront: cc.WheelJoint = vehicleNode.addComponent(cc.WheelJoint);
        wheelJointFront.connectedBody = wheelFront.getComponent(cc.RigidBody);
        wheelJointFront.anchor = frontPos;
        // wheelJointFront.maxMotorTorque = 1000;
        // wheelJointFront.motorSpeed = 1000;
        // wheelJointFront.enableMotor = true;
        wheelJointFront.frequency = 5;

        this.wheelRear = wheelRear;
        this.wheelFront = wheelFront;
    }

    // update (dt) {}
}
