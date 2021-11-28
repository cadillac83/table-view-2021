<template>
    <div class="main">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="建造合同准则" name="first" class="tab-pane">
                <Contract />
            </el-tab-pane>
            <el-tab-pane label="输出总表" name="second"> 输出总表 </el-tab-pane>
            <el-tab-pane label="现金流表" name="third"> 现金流表 </el-tab-pane>
            <el-tab-pane label="实际收付费记录表" name="fourth"> 实际收付费记录表 </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Contract from './Contract.vue'

export default {
    name: 'Main',
    components: { Contract },
    data() {
        return {
            activeName: 'first'
        }
    }
}
</script>

<style scoped>
.main {
    width: calc(100vw - 20px);
    height: calc(100vh - 20px);
}
.tab-pane {
    height: calc(100vh - 90px);
    overflow: auto;
}
</style>
