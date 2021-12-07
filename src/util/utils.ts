// 将el-icon的组件名称AbbbCddd转化为i-abbb-cddd形式
// 此前用switch做组件名时因关键字重复报错，所以格式统一加了前缀
// 例：Switch转换为i-switch，ArrowDownBold转换为i-arrow-down-bold
export const transElIconName = (iconName: string): string => {
    return 'i' + iconName.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
}

export const copyObjWhenKeyEqual = (copyFrom: any, copyTo: any): any => {
    const keysTo = Object.keys(copyTo)
    for (const key of keysTo) {
        if (copyFrom[key] !== undefined) {
            copyTo[key] = copyFrom[key]
        }
    }
    return copyTo
}

export const transformDateFormat = (date: Date): string => {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`
}

export const getDisplayDateFormat = (stage: string): string => {
    return `${stage.slice(0, 4)}年${stage.slice(5, 7)}月`
}
