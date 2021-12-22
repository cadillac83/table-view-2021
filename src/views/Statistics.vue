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
            }
        }
    },
    watch: {
        async targetProjectNumber(newVal) {
            try {
                const { data } = await httpStatisticsOfContract({
                    projectNumber: newVal
                })
                if (data || data.code === 200) {
                    this.statisticsData = data.data.sort((a, b) => (a.stage > b.stage ? 1 : -1))
                } else {
                    ElMessage({ type: 'error', message: data.msg })
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
                // mock data
                this.statisticsData = this.mockData.data.sort((a, b) => (a.stage > b.stage ? 1 : -1))
                console.log('this.statisticsData', this.statisticsData)
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
            console.log('打印实例查看 myChart ==>', myChart)
            myChart.setOption(option)
        },
        getOption(data) {
            return {
                title: {
                    text: 'Stacked Line'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Email', 'Union Ads', 'Video Ads', 'Direct']
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
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Email',
                        type: 'line',
                        stack: 'Total',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: 'Union Ads',
                        type: 'line',
                        stack: 'Total',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: 'Video Ads',
                        type: 'line',
                        stack: 'Total',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: 'Direct',
                        type: 'line',
                        stack: 'Total',
                        data: [320, 332, 301, 334, 390, 330, 320]
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
