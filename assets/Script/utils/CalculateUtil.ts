export default class CalculateUtil {

    /**计算中间点的数量 */
    public static calculatePointCount(curPos: cc.Vec2, goalPos: cc.Vec2, distance: number): number {
        let offsetX: number = goalPos.x - curPos.x;
        let offsetY: number = goalPos.y - curPos.y;

        let r: number = CalculateUtil.getLength(offsetX, offsetY);

        return Math.floor(r / distance);
    }

    /**计算弧度 */
    public static calculateRad(curPos: cc.Vec2, goalPos: cc.Vec2): number {
        let offsetX: number = goalPos.x - curPos.x;
        let offsetY: number = goalPos.y - curPos.y;

        let r: number = CalculateUtil.getLength(offsetX, offsetY);

        let rad: number = Math.acos(offsetX / r);
        if (offsetY < 0) {
            rad = -rad;
        }
        return rad;
    }

    public static getLength(offsetX: number, offsetY: number): number {
        return Math.sqrt(CalculateUtil.getLengthPow(offsetX, offsetY));
    }

    public static getLengthPow(offsetX: number, offsetY: number): number {
        return offsetX * offsetX + offsetY * offsetY;
    }

}