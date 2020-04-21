import VehicleType from '../VehicleType'
import VehicleUtil from './VehicleUtil'

export default class ComponentUtil {

    /**
     * 添加轮子关节
     * @param obj 传入对象
     * @param param 轮子关节属性
     * @return 返回轮子关节
     */
    public static addWheelJointToObj(obj: cc.Node, param?: VehicleType.WHEEL_JOINT): cc.WheelJoint {
        let wheelJoint: cc.WheelJoint = obj.addComponent(cc.WheelJoint);

        if (!param) {
            return wheelJoint;
        }
        
        wheelJoint.connectedBody = VehicleUtil.getValue(param.connectedNode, param.connectedNode.getComponent(cc.RigidBody), null);
        wheelJoint.anchor = VehicleUtil.getValue(param.anchor, param.anchor, cc.v2(0, 0));
        wheelJoint.maxMotorTorque = VehicleUtil.getValue(param.maxMotorTorque, param.maxMotorTorque, 300);
        wheelJoint.motorSpeed = VehicleUtil.getValue(param.motorSpeed, param.motorSpeed, 300);
        wheelJoint.enableMotor = VehicleUtil.getValue(param.enableMotor, param.enableMotor, true);
        wheelJoint.frequency = VehicleUtil.getValue(param.frequency, param.frequency, 10);
        wheelJoint.dampingRatio = VehicleUtil.getValue(param.dampingRatio, param.dampingRatio, 0);

        return wheelJoint;
    }

}