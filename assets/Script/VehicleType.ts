namespace VehicleType {
    export type WHEEL_JOINT = {
        connectedNode?: cc.Node,
        anchor?: cc.Vec2,
        maxMotorTorque?: number,
        motorSpeed?: number,
        enableMotor?: boolean,
        frequency?: number,
        dampingRatio?: number
    }
}

export default VehicleType;