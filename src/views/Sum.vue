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
                        <el-button type="success" @click="handleAdd()">新建</el-button>
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
            <el-form-item label="项目编号" prop="projectNumber">
                <el-select v-if="operation === 'add'" v-model="sumForm['projectNumber']" filterable :filter-method="filterContractNameList" @change="targetProjectNumber" @focus="getProjectNameList()" @blur="resetList()" placeholder="请选择要新增的项目" style="width: 100%">
                    <el-option v-for="item in filteredContractNameList" :key="item.projectNumber" :label="item.projectName" :value="item.projectNumber">
                        <span class="el-option-left">{{ item.projectName }}</span>
                        <span class="el-option-right">{{ item.projectNumber }}</span>
                    </el-option>
                    <template #prefix>
                        <el-icon size="16px"><i-list /></el-icon>
                    </template>
                </el-select>
                <el-input v-else v-model="sumForm['projectNumber']" disabled> </el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-if="operation === 'add'" v-model="sumForm['projectName']"></el-input>
                <el-input v-else v-model="sumForm['projectName']" disabled></el-input>
            </el-form-item>
            <el-form-item label="当期年月" prop="stage">
                <el-input v-if="operation === 'add'" v-model="sumForm['stage']"></el-input>
                <el-input v-else v-model="sumForm['stage']" disabled></el-input>
            </el-form-item>
            <el-form-item label="实施机构" prop="agency" :rules="rules.required">
                <el-input v-model="sumForm['agency']"></el-input>
            </el-form-item>
            <el-form-item v-for="(itemName, itemLabel) in itemMap.editItems" :key="itemName" :label="itemLabel" :prop="itemName" :rules="rules.amountRequired">
                <el-input v-model="sumForm[itemName]"></el-input>
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
import { httpGetContractNameList, httpGetDetailOfContractList } from '@/api/contract'
import { copyObjWhenKeyEqual, transformDateFormat, getDisplayDateFormat } from '@/util/utils'

export default {
    name: 'Sum',
    data() {
        const validAmount = (rule, value, callback) => {
            const valueNumber = parseFloat(value)
            if (!valueNumber && valueNumber !== 0) {
                callback(new Error('金额必须为数字类型！'))
            }
            callback()
        }
        return {
            searchKeyWord: '',
            searchDate: '',
            // targetProjectNumber: '',
            filteredContractNameList: [],
            contractNameList: [],
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
            targetContract: {
                projectName: '',
                projectNumber: ''
            },
            operation: '',
            rules: {
                required: [{ required: true, message: '请填写实施机构', trigger: 'blur' }],
                amountRequired: [
                    { required: true, message: '请填写金额', trigger: 'blur' },
                    // { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ],
                amount: [
                    // { type: 'number', message: '金额必须为数字' },
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
        // async targetProjectNumber(newVal) {
        //     try {
        //         const { data } = await httpGetDetailOfContractList({
        //             projectNumber: newVal
        //         })
        //         if (data || data.code === 200) {
        //             this.targetContract = data.data
        //         } else {
        //             ElMessage({ type: 'error', message: data.msg })
        //         }
        //     } catch (error) {
        //         ElMessage({ type: 'error', message: error })
        //     }
        // }
    },
    created() {
        this.getDisplayDateFormat = getDisplayDateFormat
        this.getData()
        // this.getProjectNameList()
    },
    methods: {
        async targetProjectNumber() {
            try {
                console.log('changed')
                const { data } = await httpGetDetailOfContractList({
                    projectNumber: this.sumForm.projectNumber
                })
                if (data || data.code === 200) {
                    this.targetContract = data.data
                    this.sumForm.projectNumber = this.targetContract.projectNumber
                    this.sumForm.projectName = this.targetContract.projectName
                } else {
                    ElMessage({ type: 'error', message: data.msg })
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },
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
        async getProjectNameList() {
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
            console.log('sumForm', this.sumForm)
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
                // this.sumForm['projectNumber'] = this.targetContract['projectNumber']
                // this.sumForm['projectName'] = this.targetContract['projectName']
                // console.log('projectNumber', this.targetContract['projectNumber'])
                // this.sumForm.projectNumber = this.targetContract.projectNumber
                // console.log('sumForm', this.sumForm)
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
.el-option-left {
    float: left;
}
.el-option-right {
    float: right;
    color: var(--el-text-color-secondary);
    font-size: 13px;
}
</style>
