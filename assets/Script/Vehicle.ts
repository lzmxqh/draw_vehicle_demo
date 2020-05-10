import DrawArea from './DrawArea'
import Wheel from './Wheel'
import VehicleEnum from './VehicleEnum'
import ComponentUtil from './utils/ComponentUtil'
import VehicleType from './VehicleType'

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

    private colliderTags: { [tag: number]: boolean } = {};

    // LIFE-CYCLE CALLBACKS:

    protected onDestroy(): void {

    }

    protected onLoad(): void {
        this.node.active = false;
    }

    protected start(): void {

    }

    /**刷新车 */
    public updateVehicle(drawPoints: Array<cc.Vec2>): void {
        if (drawPoints.length <= 0) {
            return;
        }
        let _self = this;

        // 重置车位置
        _self.node.x = 0;
        _self.node.y = 200;

        // 重置车
        _self.resetVehicle();
        // 画车身
        _self.drawVehicleBody(drawPoints);
        // 画轮子
        _self.drawWheel(drawPoints);

        // 激活车节点
        if (!_self.node.active) {
            _self.node.active = true;
        }
    }

    /**重置车 */
    private resetVehicle(): void {
        let _self = this;
        let vehicleNode: cc.Node = _self.vehicle.node;   // 获取车节点

        vehicleNode.removeAllChildren();
        _self.vehicleBodys = [];

        _self.wheelRear = null;
        _self.wheelFront = null;
    }

    /**画车身 */
    private drawVehicleBody(drawPoints: Array<cc.Vec2>): void {
        let _self = this;
        let vehicleNode: cc.Node = _self.vehicle.node;   // 获取车节点

        let beforePos: cc.Vec2 = drawPoints[0];
        for (let i = 1; i < drawPoints.length; i++) {
            let curPos: cc.Vec2 = drawPoints[i];
            let subVec: cc.Vec2 = curPos.sub(beforePos);
            let distance: number = subVec.mag() + 5;    // 防止线段间出现空隙，所以+5长度

            // 给定方向向量
            let tempVec: cc.Vec2 = cc.v2(0, 10);

            // 求两点的方向角度
            let rotateVec: number = subVec.signAngle(tempVec) / Math.PI * 180 - 90;

            // 创建车刚体小部件
            let lineItem: cc.Node = cc.instantiate(_self.linePrefab);
            lineItem.angle = -rotateVec;
            lineItem.setPosition(beforePos);
            lineItem.setParent(vehicleNode);

            // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
            lineItem.width = distance;

            // 设置刚体属性
            lineItem.getComponent(cc.PhysicsBoxCollider).offset.x = lineItem.width / 2;
            lineItem.getComponent(cc.PhysicsBoxCollider).size.width = lineItem.width;
            lineItem.getComponent(cc.PhysicsBoxCollider).sensor = true;
            lineItem.getComponent(cc.PhysicsBoxCollider).restitution = 100;
            lineItem.getComponent(cc.PhysicsBoxCollider).apply();

            // 首刚体不需要创建刚体焊接组件
            if (_self.vehicleBodys.length > 0) {
                let beforeLine: cc.Node = _self.vehicleBodys[_self.vehicleBodys.length - 1];

                // 焊接车刚体小部件
                let weldJoint: cc.WeldJoint = lineItem.addComponent(cc.WeldJoint);
                weldJoint.referenceAngle = -rotateVec - beforeLine.angle;

                weldJoint.connectedBody = beforeLine.getComponent(cc.RigidBody);
                weldJoint.connectedAnchor = cc.v2(beforeLine.width - 5, 0);
            }
            _self.vehicleBodys.push(lineItem);

            beforePos = cc.v2(curPos.x, curPos.y);
        }
    }

    /**画轮子 */
    private drawWheel(drawPoints: Array<cc.Vec2>): void {
        let _self = this;

        let vehicleNode: cc.Node = _self.vehicle.node;
        // 首尾车身刚体
        let lineRear: cc.Node = _self.vehicleBodys[0];
        let lineFront: cc.Node = _self.vehicleBodys[_self.vehicleBodys.length - 1];

        let wheelSF: cc.SpriteFrame = new cc.SpriteFrame("HelloWorld");     // 轮胎精灵帧
        // 首尾触摸点
        let rearPos: cc.Vec2 = drawPoints[0];
        let frontPos: cc.Vec2 = drawPoints[drawPoints.length - 1];

        // 通过预制节点，创建后轮
        let wheelRear: cc.Node = cc.instantiate(_self.wheelPrefab);
        wheelRear.getComponent(cc.Sprite).spriteFrame = wheelSF;
        wheelRear.setPosition(rearPos);
        vehicleNode.addChild(wheelRear);

        // 通过预制节点，创建前轮
        let wheelFront: cc.Node = cc.instantiate(_self.wheelPrefab);
        wheelRear.getComponent(cc.Sprite).spriteFrame = wheelSF;
        wheelFront.setPosition(frontPos);
        vehicleNode.addChild(wheelFront);

        // 添加轮子刚体标识
        wheelRear.getComponent(cc.PhysicsCircleCollider).tag = VehicleEnum.COLLIDER_TAG.REAR_TAG;       // 后轮
        wheelFront.getComponent(cc.PhysicsCircleCollider).tag = VehicleEnum.COLLIDER_TAG.FRONT_TAG;      // 前轮

        wheelRear.getComponent(cc.PhysicsCircleCollider).apply();
        wheelFront.getComponent(cc.PhysicsCircleCollider).apply();

        // 加入轮子关节
        // 后轮
        let wheelJointRear: cc.WheelJoint = ComponentUtil.addWheelJointToObj(lineRear, {
            connectedNode: wheelRear,
            anchor: cc.v2(0, 0)
        });

        // 前轮
        let wheelJointFront: cc.WheelJoint = ComponentUtil.addWheelJointToObj(lineFront, {
            connectedNode: wheelFront,
            anchor: cc.v2(lineFront.width - 5, 0)
        });

        // 添加距离关节，约束两个轮子
        let distanceJoint: cc.DistanceJoint = wheelRear.addComponent(cc.DistanceJoint);
        distanceJoint.connectedBody = wheelFront.getComponent(cc.RigidBody);
        distanceJoint.distance = frontPos.sub(rearPos).mag();

        _self.wheelRear = wheelRear;
        _self.wheelFront = wheelFront;
    }

    // update (dt) {}
}
