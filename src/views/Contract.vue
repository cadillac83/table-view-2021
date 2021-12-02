<template>
    <div>
        <div class="opration-line">
            <el-row justify="space-between">
                <el-col :span="12">
                    <el-row justify="start">
                        <el-input v-model="searchKeyWord" placeholder="请输入项目名称或项目编号搜索" clearable>
                            <template #prepend>
                                <el-button>
                                    <el-icon><i-search /></el-icon>
                                </el-button>
                            </template>
                        </el-input>
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
        <el-table :data="filteredContractList" height="calc(100vh - 135px)" stripe>
            <el-table-column prop="projectName" label="项目名称" fixed align="center" width="120" />
            <el-table-column prop="projectShorterName" label="项目简称" align="center" width="120" />
            <el-table-column prop="projectNumber" label="项目编号" sortable align="center" width="120" />
            <el-table-column label="主合同金额（单位：万元）" align="center">
                <el-table-column prop="contractAmountTotal" label="总额" sortable align="center" width="120" />
                <el-table-column label="细分" align="center" width="120">
                    <el-table-column prop="contractAmountBuild" label="建安" align="center" width="120" />
                    <el-table-column prop="contractAmountEquip" label="设备采购" align="center" width="120" />
                    <el-table-column prop="contractAmountOther" label="其他" align="center" width="120" />
                </el-table-column>
            </el-table-column>
            <el-table-column label="预计总收入（单位：万元）" align="center">
                <el-table-column prop="incomeAmountTotal" label="总额" align="center" width="120" />
                <el-table-column label="细分" align="center" width="120">
                    <el-table-column prop="incomeAmountBuild" label="建安" align="center" width="120" />
                    <el-table-column prop="incomeAmountEquip" label="设备采购" align="center" width="120" />
                    <el-table-column prop="incomeAmountOther" label="其他" align="center" width="120" />
                </el-table-column>
            </el-table-column>
            <el-table-column label="预计总成本（单位：万元）" align="center">
                <el-table-column prop="costAmountTotal" label="总额" align="center" width="120" />
                <el-table-column label="细分" align="center" width="120">
                    <el-table-column prop="costAmountBuild" label="建安" align="center" width="120" />
                    <el-table-column prop="costAmountEquip" label="设备采购" align="center" width="120" />
                    <el-table-column prop="costAmountOther" label="其他" align="center" width="120" />
                </el-table-column>
            </el-table-column>
            <el-table-column prop="profit" label="利润" align="center" width="120" />
            <el-table-column prop="incomeCostPercentage" label="收入成本占比" align="center" width="120" />
            <el-table-column label="操作" fixed="right" align="center" width="180">
                <template #default="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-if="dialogVisible" v-model="dialogVisible" :title="operation === 'add' ? '新建合同' : '编辑合同'" width="60%">
        <el-form ref="contractForm" :model="contractForm" label-width="120px" :label-position="'right'" :rules="rules">
            <el-form-item v-if="operation === 'update'" label="项目编号" prop="projectNumber">
                <el-input v-model="contractForm.projectNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="contractForm.projectName"></el-input>
            </el-form-item>
            <el-form-item label="项目简称" prop="projectShorterName">
                <el-input v-model="contractForm.projectShorterName"></el-input>
            </el-form-item>
            <el-form-item label="主合同金额总额" prop="contractAmountTotal" :rules="rules.amountTotal">
                <el-input v-model.number="contractForm.contractAmountTotal"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="细分" prop="contractAmountBuild" :rules="rules.amount">
                        <el-input v-model.number="contractForm.contractAmountBuild"> <template #prepend>建安</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="contractAmountEquip" label-width="0" :rules="rules.amount">
                        <el-input v-model.number="contractForm.contractAmountEquip"> <template #prepend>设备采购</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="contractAmountOther" label-width="0" :rules="rules.amount">
                        <el-input v-model.number="contractForm.contractAmountOther"> <template #prepend>其他</template></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="预计总收入" prop="incomeAmountTotal" :rules="rules.amountTotal">
                <el-input v-model.number="contractForm.incomeAmountTotal"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="细分" prop="incomeAmountBuild" :rules="rules.amount">
                        <el-input v-model.number="contractForm.incomeAmountBuild"> <template #prepend>建安</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="incomeAmountEquip" label-width="0" :rules="rules.amount">
                        <el-input v-model.number="contractForm.incomeAmountEquip"> <template #prepend>设备采购</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="incomeAmountOther" label-width="0" :rules="rules.amount">
                        <el-input v-model.number="contractForm.incomeAmountOther"> <template #prepend>其他</template></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="预计总成本" prop="costAmountTotal" :rules="rules.amountTotal">
                <el-input v-model.number="contractForm.costAmountTotal"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="细分" prop="costAmountBuild">
                        <el-input v-model.number="contractForm.costAmountBuild" :rules="rules.amount"> <template #prepend>建安</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="costAmountEquip" label-width="0">
                        <el-input v-model.number="contractForm.costAmountEquip" :rules="rules.amount"> <template #prepend>设备采购</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="costAmountOther" label-width="0">
                        <el-input v-model.number="contractForm.costAmountOther" :rules="rules.amount"> <template #prepend>其他</template></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="利润" prop="profit">
                <el-input v-model="computedProfit" disabled></el-input>
            </el-form-item>
            <el-form-item label="收入成本占比" prop="incomeCostPercentage">
                <el-input v-model="computedIncomeCostPercentage" disabled></el-input>
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
import { httpGetContractList, httpPostContract } from '@/api/contract'

export default {
    name: 'Contract',
    data() {
        const validAmount = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('金额不能小于零！'))
            }
            callback()
        }
        return {
            activeName: 'first',
            dialogVisible: false,
            index: 0,
            searchKeyWord: '',
            initContractForm: {
                projectName: '',
                projectShorterName: '',
                projectNumber: '',
                contractAmountTotal: '',
                contractAmountBuild: '',
                contractAmountEquip: '',
                contractAmountOther: '',
                incomeAmountTotal: '',
                incomeAmountBuild: '',
                incomeAmountEquip: '',
                incomeAmountOther: '',
                costAmountTotal: '',
                costAmountBuild: '',
                costAmountEquip: '',
                costAmountOther: '',
                profit: 0,
                incomeCostPercentage: 0
            },
            contractForm: {
                incomeAmountTotal: 0,
                costAmountTotal: 0
            },
            operation: '',
            rules: {
                projectName: [
                    {
                        required: true,
                        message: '请填写项目名称',
                        trigger: 'blur'
                    }
                ],
                projectShorterName: [
                    {
                        required: true,
                        message: '请填写项目简称',
                        trigger: 'blur'
                    }
                ],
                amountTotal: [
                    { required: true, message: '请填写金额', trigger: 'blur' },
                    { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ],
                amount: [
                    { type: 'number', message: '金额必须为数字' },
                    { validator: validAmount, trigger: 'blur' }
                ]
            },

            contractList: [],
            filteredContractList: []
        }
    },
    computed: {
        computedProfit() {
            return this.contractForm.incomeAmountTotal - this.contractForm.costAmountTotal
        },
        computedIncomeCostPercentage() {
            if (this.contractForm.incomeAmountTotal > 0 && this.contractForm.costAmountTotal > 0) {
                return this.contractForm.incomeAmountTotal / this.contractForm.costAmountTotal
            } else {
                return 0
            }
        }
    },
    watch: {
        searchKeyWord(newVal) {
            this.filteredContractList = this.contractList.filter(item => {
                const a = !newVal
                const b = item.projectName.toLowerCase().includes(newVal.toLowerCase())
                const c = item.projectShorterName.toLowerCase().includes(newVal.toLowerCase())
                const d = item.projectNumber.includes(newVal)
                return a || b || c || d
            })
        }
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            try {
                const { data } = await httpGetContractList()
                if (data && data.code === 200) {
                    this.contractList = data.data.list
                    this.filteredContractList = this.contractList
                }
            } catch (error) {
                ElMessage({ type: 'error', message: error })
            }
        },
        handleClick() {},
        handleAdd() {
            this.contractForm = JSON.parse(JSON.stringify(this.initContractForm))
            this.index = -1
            this.operation = 'add'
            this.dialogVisible = true
        },
        handleEdit(index, row) {
            this.contractForm = row
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
                    this.contractList.splice(index, 1)
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
            this.contractForm.profit = this.computedProfit
            this.contractForm.incomeCostPercentage = this.computedIncomeCostPercentage
            try {
                const { data } = await httpPostContract(this.contractForm)
                if (data || data.code === 200) {
                    ElMessage({ type: 'success', message: '提交成功！' })
                    // TODO 临时逻辑
                    if (this.operation === 'add') {
                        this.contractForm.projectNumber = 'test000001'
                        this.contractList.push(this.contractForm)
                    } else if (this.operation === 'update') {
                        this.contractList.splice(this.index, 1, this.contractForm)
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
            this.$refs.contractForm.resetFields()
        },
        submitForm() {
            this.$refs.contractForm.validate(valid => {
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
