<template>
    <div>
        <div class="opration-line">
            <el-row justify="space-between">
                <el-col :span="16">
                    <el-row justify="start">
                        <el-col :span="12">
                            <el-input v-model="searchKeyWord" placeholder="请输入项目名称或项目编号" clearable>
                                <template #prepend>
                                    <el-button>
                                        <el-icon><i-search /></el-icon>
                                    </el-button>
                                </template>
                            </el-input>
                        </el-col>
                        <el-date-picker v-model="searchDate" type="month" placeholder="请选择年月" format="YYYY年MM月"> </el-date-picker>
                        <el-button type="success" @click="handleSearch()">查询</el-button>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <el-table :data="filteredActAccPmtList" height="calc(100vh - 135px)" stripe>
            <el-table-column prop="projectName" label="项目名称" fixed align="center" width="140" />
            <el-table-column prop="projectNumber" label="项目编号" sortable align="center" width="120" />
            <el-table-column prop="contractAmountTotal" label="主合同总金额" sortable align="center" width="130" />
            <el-table-column prop="incomeAmountTotal" label="预计总收入" align="center" width="120" />
            <el-table-column prop="stage" label="当期年月" align="center" width="120">
                <template #default="scope">
                    <div>{{ getDisplayDateFormat(scope.row.stage) }}</div>
                </template>
            </el-table-column>
            <el-table-column v-for="(itemName, itemLabel) in itemMap.editItems" :key="itemName" :prop="itemName" :label="itemLabel" align="center" width="120" />
            <el-table-column label="操作" fixed="right" align="center" width="120">
                <template #default="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-if="dialogVisible" v-model="dialogVisible" :title="operation === 'add' ? '新建实际收付费记录' : '编辑实际收付费记录'" width="40%">
        <el-form ref="actAccPmtForm" :model="actAccPmtForm" label-width="120px" :label-position="'right'">
            <el-form-item v-for="(itemName, itemLabel) in itemMap.displayItems" :key="itemName" :label="itemLabel" :prop="itemName">
                <el-input v-if="itemName === 'stage'" :modelValue="getDisplayDateFormat(actAccPmtForm[itemName])" disabled></el-input>
                <el-input v-else v-model="actAccPmtForm[itemName]" disabled></el-input>
            </el-form-item>
            <el-form-item v-for="(itemName, itemLabel) in itemMap.editItems" :key="itemName" :label="itemLabel" :prop="itemName" :rules="rules.amountRequired">
                <el-input v-model.number="actAccPmtForm[itemName]"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel()">取消</el-button>
                <el-button @click="resetForm()">重置</el-button>
                <el-button type="primary" @click="submitForm()">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { ElMessageBox, ElMessage } from 'element-plus'
import { httpGetActAccPmtList, httpPostActAccPmt } from '@/api/actualAcceptPayment'
import { transformDateFormat, getDisplayDateFormat } from '@/util/utils'

export default {
    name: 'ActualAcceptPayment',
    data() {
        const validAmount = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('金额不能小于零！'))
            }
            callback()
        }
        return {
            searchKeyWord: '',
            searchDate: '',
            dialogVisible: false,
            index: 0,
            itemMap: {
                displayItems: {
                    项目名称: 'projectName',
                    项目编号: 'projectNumber',
                    主合同金额总额: 'contractAmountTotal',
                    预计总收入: 'incomeAmountTotal',
                    当期年月: 'stage'
                },
                editItems: {
                    累计营收: 'accumulatedRevenue',
                    当期两金: 'currentTwoAmount',
                    未完施工: 'unfinishedConstructionFee',
                    应收账款: 'accountsReceivable',
                    累计实际收费: 'accumulatedActualCharges',
                    当期收费: 'currentCharge',
                    累计实际付费: 'accumulatedActualPayment',
                    当期付费: 'currentPayment',
                    利润偏差: 'profitDeviation',
                    结转营收比例: 'settlementRevenueProportion',
                    实际收费比例: 'actualChargeProportion',
                    实际付费比例: 'actualPaymentProportion'
                }
            },
            initActAccPmtForm: {
                projectName: '',
                projectNumber: '',
                contractAmountTotal: '',
                incomeAmountTotal: '',
                stage: '',
                accumulatedRevenue: '',
                currentTwoAmount: '',
                unfinishedConstructionFee: '',
                accountsReceivable: '',
                accumulatedActualCharges: '',
                currentCharge: '',
                accumulatedActualPayment: '',
                currentPayment: '',
                profitDeviation: '',
                settlementRevenueProportion: '',
                actualChargeProportion: '',
                actualPaymentProportion: ''
            },
            actAccPmtForm: {},
            operation: '',
            rules: {
                amountRequired: [
                    { required: true, message: '请填写金额', trigger: 'blur' },
                    { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ],
                amount: [
                    { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ]
            },

            actAccPmtList: [],
            filteredActAccPmtList: []
        }
    },
    computed: {},
    watch: {
        searchKeyWord(newVal) {
            this.filteredActAccPmtList = this.actAccPmtList.filter(item => {
                const a = !newVal
                const b = item.projectName.toLowerCase().includes(newVal.toLowerCase())
                const c = item.projectNumber.includes(newVal)
                return a || b || c
            })
        }
    },
    created() {
        this.getDisplayDateFormat = getDisplayDateFormat
        this.getData()
    },
    methods: {
        async getData() {
            try {
                const { data } = await httpGetActAccPmtList()
                if (data && data.code === 200) {
                    this.actAccPmtList = data.data.list
                    this.filteredActAccPmtList = this.actAccPmtList
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },
        async handleSearch() {
            // if (!this.searchKeyWord || !this.searchDate) {
            //     ElMessage({ type: 'warning', message: '请同时输入项目名称和年月进行查询！' })
            //     return
            // }
            try {
                const { data } = await httpGetActAccPmtList({
                    projectName: this.searchKeyWord,
                    stage: this.searchDate ? transformDateFormat(this.searchDate) : ''
                })
                if (data && data.code === 200) {
                    this.actAccPmtList = data.data.list
                    this.filteredActAccPmtList = this.actAccPmtList
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },

        handleAdd() {
            this.actAccPmtForm = JSON.parse(JSON.stringify(this.initActAccPmtForm))
            this.index = -1
            this.operation = 'add'
            this.dialogVisible = true
        },
        handleEdit(index, row) {
            this.actAccPmtForm = row
            this.index = index
            this.operation = 'update'
            this.dialogVisible = true
        },
        handleDelete(index, row) {
            this.index = index
            ElMessageBox.confirm(`确认删除合同《${row.projectName}》,编号${row.projectNumber}?`, '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            })
                .then(() => {
                    // TODO http
                    this.actAccPmtList.splice(index, 1)
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
        async save() {
            try {
                const { data } = await httpPostActAccPmt(this.actAccPmtForm)
                if (data || data.code === 200) {
                    ElMessage({ type: 'success', message: '提交成功！' })
                    // TODO 临时逻辑
                    if (this.operation === 'add') {
                        this.actAccPmtList.push(this.actAccPmtForm)
                    } else if (this.operation === 'update') {
                        this.actAccPmtList.splice(this.index, 1, this.actAccPmtForm)
                    }
                } else {
                    ElMessage({ type: 'error', message: data.msg })
                }
                this.dialogVisible = false
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },
        cancel() {
            this.dialogVisible = false
        },
        resetForm() {
            this.$refs.actAccPmtForm.resetFields()
        },
        submitForm() {
            this.$refs.actAccPmtForm.validate(valid => {
                if (valid) {
                    this.save()
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style scoped>
.opration-line {
    margin-bottom: 5px;
}
.add-button {
    padding-right: 25px;
}
</style>
