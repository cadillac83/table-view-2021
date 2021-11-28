<template>
    <div>
        <div class="opration-line">
            <el-row justify="space-between">
                <el-col :span="12">
                    <el-row justify="start">
                        <el-select v-model="targetProject" filterable :filter-method="filterContractNameList" @focus="resetList()" @blur="resetList()" placeholder="请选择要查看的项目">
                            <el-option v-for="item in filteredContractNameList" :key="item.projectNumber" :label="item.projectName" :value="item.projectNumber">
                                <span class="el-option-left">{{ item.projectName }}</span>
                                <span class="el-option-right">{{ item.projectNumber }}</span>
                            </el-option>
                            <template #prefix>
                                <el-icon size="16px"><list /></el-icon>
                            </template>
                        </el-select>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-row justify="end">
                        <div class="add-button">
                            <el-button :type="isModified ? 'primary' : 'info'" :disabled="!isModified" @click="handleUpdate()">更新</el-button>
                            <el-button :type="this.targetProject ? 'success' : 'info'" :disabled="!this.targetProject" @click="handleAdd()">新建</el-button>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <el-table :data="computedCashFlowList" height="calc(100vh - 135px)" stripe>
            <el-table-column prop="stage" label="阶段" sortable align="center" />
            <el-table-column prop="income" label="收费" align="center">
                <template #default="scope">
                    <el-input v-model.number="scope.row.income" @change="changeCashFlowList"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="outcome" label="付费" align="center">
                <template #default="scope">
                    <el-input v-model.number="scope.row.outcome" @change="changeCashFlowList"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="cumulateIncome" label="累计计划收费" align="center" />
            <el-table-column prop="cumulateOutcome" label="累计计划付费" align="center" />
            <el-table-column prop="stageCashFlow" label="当期现金流" align="center" />
            <el-table-column prop="cumulateCashFLow" label="累计现金流" align="center" />
            <el-table-column label="操作" fixed="right" align="center" width="180">
                <template #default="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { ElMessageBox, ElMessage } from 'element-plus'
import contractNameList from '../json/contractListProjectName.json'
import cashflowCashOfContract from '../json/cashflowCashOfContract.json'

export default {
    name: 'CashFlow',
    data() {
        return {
            targetProject: '',
            contractNameList: [],
            cashFlowList: [],
            isModified: false
        }
    },
    computed: {
        computedCashFlowList() {
            const ccfList = []
            let preCCF = {}
            let currentCCF = {}
            for (let index = 0; index < this.cashFlowList.length; index++) {
                currentCCF = this.cashFlowList[index]
                if (index === 0) {
                    currentCCF.cumulateIncome = currentCCF.income
                    currentCCF.cumulateOutcome = currentCCF.outcome
                    currentCCF.stageCashFlow = currentCCF.income - currentCCF.outcome
                    currentCCF.cumulateCashFLow = currentCCF.income - currentCCF.outcome
                } else {
                    preCCF = this.cashFlowList[index - 1]
                    currentCCF.cumulateIncome = currentCCF.income + preCCF.cumulateIncome // 当前月的收费 + 上个月的累计计划收费
                    currentCCF.cumulateOutcome = currentCCF.outcome + preCCF.cumulateOutcome // 当前月的付费 + 上个月的累计计划付费
                    currentCCF.stageCashFlow = currentCCF.income - currentCCF.outcome // 收费-付费
                    currentCCF.cumulateCashFLow = currentCCF.cumulateIncome - currentCCF.cumulateOutcome // 累计收费-累计付费
                }
                ccfList.push(currentCCF)
            }
            return ccfList
        }
    },
    watch: {
        targetProject(val) {
            // TODO http
            this.cashFlowList = cashflowCashOfContract.ContractCashView.cashFlowList.slice().reverse() // 默认是时间降序排序
        }
    },
    created() {
        this.contractNameList = contractNameList.data // TODO http
        this.filteredContractNameList = this.contractNameList
    },
    methods: {
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
        handleAdd() {
            console.log('handleAdd')
        },
        handleUpdate() {
            console.log('handleUpdate')
        },
        handleDelete(index, row) {
            this.index = index
            ElMessageBox.confirm(`确认删除 ${row.stage} 的数据?`, '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            })
                .then(() => {
                    // TODO http
                    this.cashFlowList.splice(index, 1)
                    this.isModified = true
                    ElMessage({
                        type: 'success',
                        message: '删除成功'
                    })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '删除取消'
                    })
                })
        },
        changeCashFlowList(val) {
            console.log('changeCashFlowList', val)
            this.isModified = true
        }
    }
}
</script>
<style scoped>
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
