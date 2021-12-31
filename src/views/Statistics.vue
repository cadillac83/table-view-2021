<template>
    <div class="opration-line">
        <el-row justify="space-between">
            <el-col :span="12">
                <el-row justify="start">
                    <el-select v-model="targetProjectNumberList" :multiple="true" filterable collapse-tags :filter-method="filterContractNameList" @change="changeSelect" @remove-tag="removeTag" placeholder="请选择要查看的项目">
                        <el-option v-for="item in filteredContractNameList" :key="item.projectNumber" :label="item.projectName" :value="item.projectNumber">
                            <span class="el-option-left">{{ item.projectName }}</span>
                            <span class="el-option-right">{{ item.projectNumber }}</span>
                        </el-option>
                        <template #prefix>
                            <el-icon size="14px"><i-list /></el-icon>
                        </template>
                    </el-select>
                </el-row>
            </el-col>
            <el-col :span="4">
                <el-row justify="start">
                    <div class="add-button">
                        <el-button type="success" @click="handleSearch()">查询</el-button>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="4">
                <el-row justify="start">
                    <el-input type="text" placeholder="请设置基线(kb)" v-model="inputVal" value=""> </el-input>
                </el-row>
            </el-col>
            <el-col :span="4">
                <el-row justify="start">
                    <div class="add-button">
                        <el-button type="success" @click="handleBaseLine()">设置</el-button>
                    </div>
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
            targetProjectNumbers: '',
            targetProjectNumberList: [],
            targetProjectNameList: [],
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
                    }
                ]
            },
            inputVal: '',
            stageList: [],
            cumulateIncomeList: [],
            cumulateOutcomeList: [],
            accumulatedActualChargesList: [],
            accumulatedActualPaymentList: []
        }
    },
    // watch: {
    //     async targetProjectNumber(newVal) {
    //         try {
    //             const { data } = await httpStatisticsOfContract({
    //                 projectNumbers: newVal
    //             })
    //             if (data || data.code === 200) {
    //                 this.statisticsData = data.data.sort((a, b) => (a.stage > b.stage ? 1 : -1))
    //                 this.initChart()
    //             } else {
    //                 ElMessage({ type: 'error', message: data.msg })
    //             }
    //         } catch (error) {
    //             ElMessage({ type: 'error', message: error })
    //             // mock data
    //             // this.statisticsData = this.mockData.data.sort((a, b) => (a.stage > b.stage ? 1 : -1))
    //             // console.log('this.statisticsData', this.statisticsData)
    //             this.initChart()
    //         }
    //     }
    // },
    // watch: {
    //     searchKeyWord(newVal) {
    //         console.log('targetProjectNumberList:', this.targetProjectNumberList)
    //         this.targetProjectNumbers = this.targetProjectNumberList
    //         return this.targetProjectNumbers
    //     }
    // },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            try {
                const { data } = await httpGetContractNameList()
                this.contractNameList = data.data
                this.filteredContractNameList = this.contractNameList
                // if (this.filteredContractNameList.length > 0) {
                //     this.targetProjectNumbers = this.filteredContractNameList[0].projectNumber
                // }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },
        async handleSearch() {
            try {
                const { data } = await httpStatisticsOfContract(this.targetProjectNumberList)
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
                this.initChart()
            }
        },
        // selectAll() {
        //     if (this.targetProjectNumberList.length < this.filteredContractNameList.length) {
        //         this.targetProjectNumberList = []
        //         this.filteredContractNameList.map(item => {
        //             this.targetProjectNumberList.push(item.projectNumber)
        //         })
        //         this.targetProjectNumberList.unshift('全选')
        //     } else {
        //         this.targetProjectNumberList = []
        //     }
        //     // eslint-disable-next-line no-unused-vars
        //     console.log('选择的:', this.targetProjectNumbers)
        // },
        // changeSelect(val) {
        //     if (!val.includes('全选') && val.length === this.options.length) {
        //         this.targetProjectNumberList.unshift('全选')
        //     } else if (val.includes('全选') && val.length - 1 < this.dataArray.length) {
        //         this.targetProjectNumberList = this.targetProjectNumberList.filter(item => {
        //             return item !== '全选'
        //         })
        //     }
        // },
        // removeTag(val) {
        //     if (val === '全选') {
        //         this.targetProjectNumberList = []
        //     }
        // },
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
            this.getStage()
            this.getCumulateIncome()
            this.getCumulateOutcome()
            this.getaccumulatedActualCharges()
            this.getaccumulatedActualPayment()
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
                        data: this.cumulateIncomeList,
                        smooth: true
                    },
                    {
                        name: '计划付',
                        type: 'line',
                        data: this.cumulateOutcomeList,
                        smooth: true
                    },
                    {
                        name: '实际收',
                        type: 'line',
                        data: this.accumulatedActualChargesList,
                        smooth: true
                    },
                    {
                        name: '实际付',
                        type: 'line',
                        data: this.accumulatedActualPaymentList,
                        smooth: true
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
