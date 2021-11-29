<template>
    <div class="main">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="建造合同准则" name="first" class="tab-pane">
                <Contract />
            </el-tab-pane>
            <el-tab-pane label="现金流表" name="second">
                <CashFlow />
            </el-tab-pane>
            <el-tab-pane label="输出总表" name="third">
                <div>输出总表</div>
            </el-tab-pane>
            <el-tab-pane label="实际收付费记录表" name="fourth">
                <div>实际收付费记录表</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Contract from './Contract.vue'
import CashFlow from './CashFlow.vue'

export default {
    name: 'Main',
    components: { Contract, CashFlow },
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
