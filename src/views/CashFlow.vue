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
                                <el-icon size="16px"><i-list /></el-icon>
                            </template>
                        </el-select>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <el-row justify="end">
                        <div class="add-button">
                            <el-button :type="this.targetProject ? 'primary' : 'info'" :disabled="!this.targetProject" @click="isEditMode = !isEditMode">{{ isEditMode ? '切换到浏览模式' : '切换到编辑模式' }}</el-button>
                            <el-button :type="this.targetProject ? 'success' : 'info'" :disabled="!this.targetProject" @click="handleAdd()">新增阶段</el-button>
                            <el-button :type="isModified ? 'warning' : 'info'" :disabled="!isModified" @click="handleUpdate()">提交更新</el-button>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <el-table :data="computedCashFlowList" height="calc(100vh - 135px)" stripe>
            <el-table-column prop="stage" label="阶段" sortable align="center" />
            <el-table-column prop="income" label="收费" align="center">
                <template #default="scope">
                    <div v-if="isEditMode">
                        <el-input v-model.number="scope.row.income" @change="modifiedCashFlowList"></el-input>
                    </div>
                    <div v-else>{{ scope.row.income }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="outcome" label="付费" align="center">
                <template #default="scope">
                    <div v-if="isEditMode">
                        <el-input v-model.number="scope.row.outcome" @change="modifiedCashFlowList"></el-input>
                    </div>
                    <div v-else>{{ scope.row.outcome }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="cumulateIncome" label="累计计划收费" align="center" />
            <el-table-column prop="cumulateOutcome" label="累计计划付费" align="center" />
            <el-table-column prop="stageCashFlow" label="当期现金流" align="center" />
            <el-table-column prop="cumulateCashFLow" label="累计现金流" align="center" />
            <el-table-column label="操作" fixed="right" align="center">
                <template #default="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-if="dialogVisible" v-model="dialogVisible" title="新建现金流" width="40%">
        <el-form ref="cashFlowForm" :model="cashFlowForm" label-width="120px" :label-position="'right'" :rules="rules">
            <el-form-item label="项目名称">
                <el-row justify="start">
                    {{ filteredContractNameList.find(item => item.projectNumber === targetProject).projectName }}
                </el-row>
            </el-form-item>
            <el-form-item label="项目编号">
                <el-row justify="start">
                    {{ filteredContractNameList.find(item => item.projectNumber === targetProject).projectNumber }}
                </el-row>
            </el-form-item>
            <el-form-item label="阶段" prop="stage">
                <el-row justify="start">
                    <el-date-picker style="width: 100%" v-model="cashFlowForm.stage" type="month" placeholder="选择月份" format="YYYY年MM月"> </el-date-picker>
                </el-row>
            </el-form-item>
            <el-form-item label="收费" prop="income">
                <el-input v-model.number="cashFlowForm.income"></el-input>
            </el-form-item>
            <el-form-item label="付费" prop="outcome">
                <el-input v-model.number="cashFlowForm.outcome"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="addToCashFlowList()">添加到现金流表</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { ElMessageBox, ElMessage } from 'element-plus'
import { getContractNameList } from '@/api/contract'
import { getCashOfContractList } from '@/api/cashFlow'

export default {
    name: 'CashFlow',
    data() {
        const validAmount = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('金额不能小于零！'))
            }
            callback()
        }
        const validStage = (rule, value, callback) => {
            const stage = `${value.getFullYear()}年${('0' + (value.getMonth() + 1)).slice(-2)}月`
            if (this.cashFlowList.find(item => item.stage === stage)) {
                callback(new Error('月份已存在，请重新选择！'))
            }
            callback()
        }

        return {
            targetProject: '',
            contractNameList: [],
            filteredContractNameList: [],
            cashFlowList: [],
            isEditMode: false,
            isModified: false,
            dialogVisible: false,
            cashFlowForm: {},
            initCashFlowForm: {
                stage: '',
                income: '',
                outcome: ''
            },
            rules: {
                stage: [
                    { required: true, message: '请选择月份', trigger: 'blur' },
                    { validator: validStage, trigger: 'blur' }
                ],

                income: [
                    { required: true, message: '请填写金额', trigger: 'blur' },
                    { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ],
                outcome: [
                    { required: true, message: '请填写金额', trigger: 'blur' },
                    { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ]
            }
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
        async targetProject(val) {
            const { data } = await getCashOfContractList()
            this.cashFlowList = data.data.cashFlowList.slice().reverse() // 默认是时间降序排序
        }
    },
    async created() {
        const { data } = await getContractNameList()
        this.contractNameList = data.data
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
            this.cashFlowForm = Object.create(this.initCashFlowForm)
            this.dialogVisible = true
        },
        handleUpdate() {
            ElMessage({
                type: 'success',
                message: '提交成功'
            })
            this.isModified = false
            this.isEditMode = false
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
        modifiedCashFlowList(val) {
            this.isModified = true
        },
        cancel() {
            this.dialogVisible = false
        },
        addToCashFlowList() {
            this.$refs.cashFlowForm.validate(valid => {
                if (valid) {
                    this.cashFlowForm.stage = `${this.cashFlowForm.stage.getFullYear()}年${('0' + (this.cashFlowForm.stage.getMonth() + 1)).slice(-2)}月`
                    this.cashFlowList.push(this.cashFlowForm)
                    this.cashFlowList = this.cashFlowList.sort((a, b) => (a.stage > b.stage ? 1 : -1))
                    this.isModified = true
                    this.dialogVisible = false
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
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
