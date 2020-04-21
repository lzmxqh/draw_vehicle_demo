export default class VehileUtil {

    /**
     * 获取属性
     * @param checkValue 检查的值
     * @param a: 存在返回值
     * @param b: 不存在返回值
     * @return 返回 a或b
     */
    public static getValue(checkValue: any, a: any, b: any): any {
        return checkValue != undefined ? a : b;
    }

}