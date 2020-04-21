// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import VehicleEnum from './VehicleEnum'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Wheel extends cc.Component {

    public static readonly VEHICLE_V: number = 100;

    /**只在两个碰撞体开始接触时被调用一次 */
    private onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {

    }

    /**只在两个碰撞体结束接触时被调用一次 */
    private onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.tag != 0 || selfCollider.tag != VehicleEnum.COLLIDER_TAG.REAR_TAG) {
            return;
        }
        // 后轮与地面碰撞

    }

    /**每次将要处理碰撞体接触逻辑时被调用 */
    private onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {

    }

    /**每次处理完碰撞体接触逻辑时被调用 */
    private onPostSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {

    }

    // update (dt) {}
}
