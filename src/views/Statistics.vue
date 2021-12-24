<template>
    <div class="opration-line">
        <el-row justify="space-between">
            <el-col :span="12">
                <el-row justify="start">
                    <el-select v-model="targetProjectNumber" filterable :filter-method="filterContractNameList" @focus="resetList()" @blur="resetList()" placeholder="请选择要查看的项目">
                        <el-option v-for="item in filteredContractNameList" :key="item.projectNumber" :label="item.projectName" :value="item.projectNumber">
                            <span class="el-option-left">{{ item.projectName }}</span>
                            <span class="el-option-right">{{ item.projectNumber }}</span>
                        </el-option>
                        <template #prefix>
                            <el-icon size="16px"><i-list /></el-icon>
                        </template>
                    </el-select>
                </el-row>
            </el-col>
        </el-row>
    </div>
    <div id="statChart" ref="statChart"></div>
</template>
<script>
import { ElMessage } from 'element-plus'
import { httpGetContractNameList } from '@/api/contract'
import { httpStatisticsOfContract } from '@/api/statistics'
import * as echarts from 'echarts'
export default {
    name: 'Statistics',
    data() {
        return {
            targetProjectNumber: '',
            filteredContractNameList: [],
            mockData: {
                msg: 'success',
                code: 200,
                data: [
                    {
                        stage: '2021-03',
                        cumulateIncome: 0.0,
                        cumulateOutcome: 398.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-04',
                        cumulateIncome: 16323.0,
                        cumulateOutcome: 9961.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-05',
                        cumulateIncome: 16323.0,
                        cumulateOutcome: 29180.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-06',
                        cumulateIncome: 16323.0,
                        cumulateOutcome: 32970.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-07',
                        cumulateIncome: 40807.0,
                        cumulateOutcome: 52914.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-08',
                        cumulateIncome: 134470.0,
                        cumulateOutcome: 118550.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-09',
                        cumulateIncome: 220036.0,
                        cumulateOutcome: 208235.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-10',
                        cumulateIncome: 363036.0,
                        cumulateOutcome: 334229.0,
                        accumulatedActualCharges: 0.0,
                        accumulatedActualPayment: 0.0
                    },
                    {
                        stage: '2021-11',
                        cumulateIncome: 469469.0,
                        cumulateOutcome: 381614.0,
                        accumulatedActualCharges: 95379.0,
                        accumulatedActualPayment: 92992.0
                    }
                ]
            },
            stageList: [],
            cumulateIncomeList: [],
            cumulateOutcomeList: [],
            accumulatedActualChargesList: [],
            accumulatedActualPaymentList: []
        }
    },
    watch: {
        async targetProjectNumber(newVal) {
            try {
                const { data } = await httpStatisticsOfContract({
                    projectNumbers: newVal
                })
                if (data || data.code === 200) {
                    this.statisticsData = data.data.sort((a, b) => (a.stage > b.stage ? 1 : -1))
                    this.initChart()
                } else {
                    ElMessage({ type: 'error', message: data.msg })
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
                // mock data
                // this.statisticsData = this.mockData.data.sort((a, b) => (a.stage > b.stage ? 1 : -1))
                // console.log('this.statisticsData', this.statisticsData)
                this.initChart()
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            try {
                const { data } = await httpGetContractNameList()
                this.contractNameList = data.data
                this.filteredContractNameList = this.contractNameList
                if (this.filteredContractNameList.length > 0) {
                    this.targetProjectNumber = this.filteredContractNameList[0].projectNumber
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },
        filterContractNameList(val) {
            if (val) {
                this.filteredContractNameList = this.contractNameList.filter(item => {
                    const a = item.projectName.includes(val)
                    const b = item.projectNumber.includes(val)
                    return a || b
                })
            } else {
                this.filteredContractNameList = this.contractNameList
            }
        },
        resetList() {
            this.filteredContractNameList = this.contractNameList
        },
        initChart() {
            const myChart = echarts.init(this.$refs.statChart)
            const option = this.getOption(this.statisticsData)
            console.log('statisticsData: ', this.statisticsData)
            this.getStage()
            this.getCumulateIncome()
            this.getCumulateOutcome()
            this.getaccumulatedActualCharges()
            this.getaccumulatedActualPayment()
            console.log('打印实例查看 myChart ==>', myChart)
            myChart.setOption(option)
        },
        getStage() {
            this.stageList.length = 0
            for (let i = 0; i < this.statisticsData.length; i++) {
                this.stageList.push(this.statisticsData[i].stage)
            }
        },
        getCumulateIncome() {
            this.cumulateIncomeList.length = 0
            for (let i = 0; i < this.statisticsData.length; i++) {
                this.cumulateIncomeList.push(this.statisticsData[i].cumulateIncome)
            }
        },
        getCumulateOutcome() {
            this.cumulateOutcomeList.length = 0
            for (let i = 0; i < this.statisticsData.length; i++) {
                this.cumulateOutcomeList.push(this.statisticsData[i].cumulateOutcome)
            }
        },
        getaccumulatedActualCharges() {
            this.accumulatedActualChargesList.length = 0
            for (let i = 0; i < this.statisticsData.length; i++) {
                this.accumulatedActualChargesList.push(this.statisticsData[i].accumulatedActualCharges)
            }
        },
        getaccumulatedActualPayment() {
            this.accumulatedActualPaymentList.length = 0
            for (let i = 0; i < this.statisticsData.length; i++) {
                this.accumulatedActualPaymentList.push(this.statisticsData[i].accumulatedActualPayment)
            }
        },
        getOption(data) {
            return {
                title: {
                    text: '工程计划&实际收付费金额曲线'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['计划收', '计划付', '实际收', '实际付']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.stageList
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '计划收',
                        type: 'line',
                        data: this.cumulateIncomeList
                    },
                    {
                        name: '计划付',
                        type: 'line',
                        data: this.cumulateOutcomeList
                    },
                    {
                        name: '实际收',
                        type: 'line',
                        data: this.accumulatedActualChargesList
                    },
                    {
                        name: '实际付',
                        type: 'line',
                        data: this.accumulatedActualPaymentList
                    }
                ]
            }
        }
    }
}
</script>
<style scoped>
#statChart {
    width: calc(100vw - 100px);
    height: calc(100vh - 130px);
}
.opration-line {
    margin-bottom: 5px;
}
.el-select {
    width: 100%;
}
.el-option-left {
    float: left;
}
.el-option-right {
    float: right;
    color: var(--el-text-color-secondary);
    font-size: 13px;
}
</style>
