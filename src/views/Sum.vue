<template>
    <div>
        <div class="opration-line">
            <el-row justify="space-between">
                <el-col :span="12">
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
                <el-col :span="12">
                    <el-row justify="end">
                        <div class="add-button">
                            <el-button type="success" @click="handleAdd()">新建</el-button>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <el-table :data="filteredSumList" height="calc(100vh - 135px)" stripe>
            <el-table-column prop="projectNumber" label="项目编号" sortable align="center" width="120" />
            <el-table-column prop="projectName" label="项目名称" align="center" width="140" />
            <el-table-column prop="stage" label="当期年月" align="center" width="120">
                <template #default="scope">
                    <div>{{ getDisplayDateFormat(scope.row.stage) }}</div>
                </template>
            </el-table-column>
            <el-table-column v-for="(itemName, itemLabel) in itemMap.dispalyNumItems" :key="itemName" :prop="itemName" :label="itemLabel" align="center" width="120" />
            <el-table-column label="操作" fixed="right" align="center" width="120">
                <template #default="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-if="dialogVisible" v-model="dialogVisible" :title="operation === 'add' ? '新建总表' : '编辑总表'" width="40%">
        <el-form ref="sumForm" :model="sumForm" label-width="120px" :label-position="'right'">
            <el-form-item v-for="(itemName, itemLabel) in itemMap.displayItems" :key="itemName" :label="itemLabel" :prop="itemName">
                <el-input v-if="operation === 'add'" v-model="sumForm[itemName]"></el-input>
                <el-input v-else-if="operation !== 'add' && itemName === 'stage'" :modelValue="getDisplayDateFormat(sumForm[itemName])" disabled></el-input>
                <el-input v-else v-model="sumForm[itemName]" disabled></el-input>
            </el-form-item>
            <el-form-item label="实施机构" prop="agency" :rules="rules.required">
                <el-input v-model="sumForm['agency']"></el-input>
            </el-form-item>
            <el-form-item v-for="(itemName, itemLabel) in itemMap.editItems" :key="itemName" :label="itemLabel" :prop="itemName" :rules="rules.amountRequired">
                <el-input v-model.number="sumForm[itemName]"></el-input>
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
import { httpGetSumList, httpPostSum } from '@/api/sum'
import { copyObjWhenKeyEqual, transformDateFormat, getDisplayDateFormat } from '@/util/utils'

export default {
    name: 'Sum',
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
                    项目编号: 'projectNumber',
                    项目名称: 'projectName',
                    当期年月: 'stage'
                },
                dispalyNumItems: {
                    实施机构: 'agency',
                    累计计划收费: 'cumulateIncome',
                    累计实际收费: 'accumulatedActualCharges',
                    实际收费比例: 'actualChargeProportion',
                    当月计划收费: 'currentPlannedCharge',
                    结转营收比例: 'settlementRevenueProportion',
                    形象进度: 'projectImageProgress',
                    利润偏差: 'profitDeviation',
                    当期两金: 'currentTwoAmount',
                    当月计划两金余额: 'balanceOfCurrentTwoAmount',
                    累计实际付费: 'accumulatedActualPayment',
                    当月计划付款: 'currentPlannedPayment',
                    回款前付款: 'paymentBeforeRemittance',
                    回款后付款: 'paymentAfterRemittance',
                    计划外收费: 'unplannedCharges',
                    计划外付费: 'unplannedPayment'
                },
                editItems: {
                    // 实施机构: 'agency',
                    回款前付款: 'paymentBeforeRemittance',
                    回款后付款: 'paymentAfterRemittance',
                    计划外收费: 'unplannedCharges',
                    计划外付费: 'unplannedPayment',
                    当月计划付款: 'currentPlannedPayment',
                    形象进度: 'projectImageProgress'
                }
            },
            initSumForm: {
                projectNumber: '',
                projectName: '',
                // projectNumber: '',
                stage: '',
                agency: '',
                paymentBeforeRemittance: '',
                paymentAfterRemittance: '',
                unplannedCharges: '',
                unplannedPayment: '',
                currentPlannedPayment: '',
                projectImageProgress: ''
            },
            sumForm: {},
            operation: '',
            rules: {
                required: [{ required: true, message: '请填写实施机构', trigger: 'blur' }],
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

            sumList: [],
            filteredSumList: []
        }
    },
    computed: {},
    watch: {
        searchKeyWord(newVal) {
            this.filteredSumList = this.sumList.filter(item => {
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
                const { data } = await httpGetSumList({
                    projectName: '',
                    stage: '',
                    currPage: 1,
                    pageSize: 999
                })
                if (data && data.code === 200) {
                    this.sumList = data.data.list
                    this.filteredSumList = this.sumList
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
                const { data } = await httpGetSumList({
                    projectName: this.searchKeyWord,
                    stage: this.searchDate ? transformDateFormat(this.searchDate) : '',
                    currPage: 1,
                    pageSize: 999
                })
                if (data && data.code === 200) {
                    this.sumList = data.data.list
                    this.filteredSumList = this.sumList
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },

        handleAdd() {
            this.sumForm = JSON.parse(JSON.stringify(this.initSumForm))
            this.index = -1
            this.operation = 'add'
            this.dialogVisible = true
        },
        handleEdit(index, row) {
            this.sumForm = JSON.parse(JSON.stringify(this.initSumForm))
            copyObjWhenKeyEqual(row, this.sumForm)
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
                    this.sumList.splice(index, 1)
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
                const { data } = await httpPostSum(this.sumForm)
                if (data || data.code === 200) {
                    ElMessage({ type: 'success', message: '提交成功！' })
                    // TODO 临时逻辑
                    if (this.operation === 'add') {
                        this.sumList.push(this.sumForm)
                    } else if (this.operation === 'update') {
                        this.sumList.splice(this.index, 1, this.sumForm)
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
            this.$refs.sumForm.resetFields()
        },
        submitForm() {
            this.$refs.sumForm.validate(valid => {
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
