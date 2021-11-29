import * as ElIconModules from '@element-plus/icons'
import { transElIconName } from '@/util/utils'

const registeIcons = (app:any) => {
    // 注册el-icon图标
    for(let iconName in ElIconModules){
        app.component(transElIconName(iconName),ElIconModules[iconName])
    }
}

export default registeIcons