<template>
    <div class="main">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="建造合同准则" name="first" class="tab-pane">
                <Contract />
            </el-tab-pane>
            <el-tab-pane label="项目计划现金流" name="second">
                <CashFlow />
            </el-tab-pane>
            <el-tab-pane label="项目实际收付费" name="third">
                <ActualAcceptPayment />
            </el-tab-pane>
            <el-tab-pane label="当月计划收付费策划" name="fouth">
                <Sum />
            </el-tab-pane>
            <el-tab-pane label="计划与实际现金流曲线图" name="fifth">
                <Statistics />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Contract from './Contract.vue'
import CashFlow from './CashFlow.vue'
import Sum from './Sum.vue'
import ActualAcceptPayment from './ActualAcceptPayment.vue'
import Statistics from './Statistics.vue'

export default {
    name: 'Main',
    components: { Contract, CashFlow, Sum, ActualAcceptPayment, Statistics },
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
