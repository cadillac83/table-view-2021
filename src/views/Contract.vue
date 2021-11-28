<template>
    <div class="main">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
            <el-tab-pane label="建造合同准则" name="first" class="tab-pane">
                <div class="opration-line">
                    <el-row justify="space-between">
                        <el-col :span="4">
                            <el-row justify="start"><el-button type="success" @click="handleAdd()">新建</el-button></el-row>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="searchKeyWord" placeholder="请输入项目名称搜索" clearable>
                                <template #prepend>
                                    <el-button>
                                        <el-icon><search /></el-icon>
                                    </el-button>
                                </template>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <el-table :data="filteredContractLlist" height="calc(100vh - 135px)" stripe>
                    <el-table-column prop="projectName" label="项目名称" fixed align="center" width="120" />
                    <el-table-column prop="projectShorterName" label="项目简称" align="center" width="120" />
                    <el-table-column prop="projectNumber" label="项目编号" sortable align="center" width="120" />
                    <el-table-column label="主合同金额" align="center">
                        <el-table-column prop="contractAmountTotal" label="总额" sortable align="center" width="120" />
                        <el-table-column label="细分" align="center" width="120">
                            <el-table-column prop="contractAmountBuild" label="建安" align="center" width="120" />
                            <el-table-column prop="contractAmountEquip" label="设备采购" align="center" width="120" />
                            <el-table-column prop="contractAmountOther" label="其他" align="center" width="120" />
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预计总收入" align="center">
                        <el-table-column prop="incomeAmountTotal" label="总额" align="center" width="120" />
                        <el-table-column label="细分" align="center" width="120">
                            <el-table-column prop="incomeAmountBuild" label="建安" align="center" width="120" />
                            <el-table-column prop="incomeAmountEquip" label="设备采购" align="center" width="120" />
                            <el-table-column prop="incomeAmountOther" label="其他" align="center" width="120" />
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预计总成本" align="center">
                        <el-table-column prop="costAmountTotal" label="总额" align="center" width="120" />
                        <el-table-column label="细分" align="center" width="120">
                            <el-table-column prop="costAmountBuild" label="建安" align="center" width="120" />
                            <el-table-column prop="costAmountEquip" label="设备采购" align="center" width="120" />
                            <el-table-column prop="costAmountOther" label="其他" align="center" width="120" />
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="profit" label="利润" align="center" width="120" />
                    <el-table-column label="操作" fixed="right" align="center" width="180">
                        <template #default="scope">
                            <el-button round size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button round size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="输出总表" name="second"> 输出总表 </el-tab-pane>
            <el-tab-pane label="现金流表" name="third"> 现金流表 </el-tab-pane>
            <el-tab-pane label="实际收付费记录表" name="fourth"> 实际收付费记录表 </el-tab-pane>
        </el-tabs>

        <el-dialog v-if="editDialogVisible" v-model="editDialogVisible" :title="operation === 'add' ? '新建合同' : '编辑合同'" width="60%">
            <el-form ref="contractForm" :model="form" label-width="120px" :label-position="'right'" :rules="rules">
                <el-form-item v-if="operation === 'update'" label="项目编号" prop="projectNumber">
                    <el-input v-model="form.projectNumber" disabled></el-input>
                </el-form-item>
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="form.projectName"></el-input>
                </el-form-item>
                <el-form-item label="项目简称" prop="projectShorterName">
                    <el-input v-model="form.projectShorterName"></el-input>
                </el-form-item>
                <el-form-item label="主合同金额总额" prop="contractAmountTotal" :rules="rules.amountTotal">
                    <el-input v-model.number="form.contractAmountTotal"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="细分" prop="contractAmountBuild" :rules="rules.amount">
                            <el-input v-model.number="form.contractAmountBuild"> <template #prepend>建安</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="contractAmountEquip" label-width="0" :rules="rules.amount">
                            <el-input v-model.number="form.contractAmountEquip"> <template #prepend>设备采购</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="contractAmountOther" label-width="0" :rules="rules.amount">
                            <el-input v-model.number="form.contractAmountOther"> <template #prepend>其他</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="预计总收入" prop="incomeAmountTotal" :rules="rules.amountTotal">
                    <el-input v-model.number="form.incomeAmountTotal"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="细分" prop="incomeAmountBuild" :rules="rules.amount">
                            <el-input v-model.number="form.incomeAmountBuild"> <template #prepend>建安</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="incomeAmountEquip" label-width="0" :rules="rules.amount">
                            <el-input v-model.number="form.incomeAmountEquip"> <template #prepend>设备采购</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="incomeAmountOther" label-width="0" :rules="rules.amount">
                            <el-input v-model.number="form.incomeAmountOther"> <template #prepend>其他</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="预计总成本" prop="costAmountTotal" :rules="rules.amountTotal">
                    <el-input v-model.number="form.costAmountTotal"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="细分" prop="costAmountBuild">
                            <el-input v-model.number="form.costAmountBuild" :rules="rules.amount"> <template #prepend>建安</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="costAmountEquip" label-width="0">
                            <el-input v-model.number="form.costAmountEquip" :rules="rules.amount"> <template #prepend>设备采购</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="costAmountOther" label-width="0">
                            <el-input v-model.number="form.costAmountOther" :rules="rules.amount"> <template #prepend>其他</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="利润" prop="profit">
                    <el-input v-model="computedProfit" disabled></el-input>
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
    </div>
</template>

<script>
import contractLlist from '../json/contractLlist.json'
import { ElMessageBox, ElMessage } from 'element-plus'

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
            height: window.innerHeight - 150,
            activeName: 'first',
            editDialogVisible: false,
            index: 0,
            searchKeyWord: '',
            initForm: {
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
                profit: 0
            },
            form: {
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

            contractLlist: [],
            filteredContractLlist: []
        }
    },
    computed: {
        computedProfit() {
            return this.form.incomeAmountTotal - this.form.costAmountTotal
        }
    },
    watch: {
        searchKeyWord(newVal) {
            // eslint-disable-next-line prettier/prettier
            this.filteredContractLlist = this.contractLlist.filter(
                item => !newVal ||
                item.projectName.toLowerCase().includes(newVal.toLowerCase()) ||
                item.projectShorterName.toLowerCase().includes(newVal.toLowerCase()))
        }
    },
    created() {
        this.contractLlist = contractLlist.page.list
        this.filteredContractLlist = this.contractLlist
    },
    methods: {
        handleClick() {},
        handleAdd() {
            this.form = Object.create(this.initForm)
            this.index = -1
            this.operation = 'add'
            this.editDialogVisible = true
        },
        handleEdit(index, row) {
            this.form = row
            this.index = index
            this.operation = 'update'
            this.editDialogVisible = true
        },
        save() {
            this.form.profit = this.computedProfit
            // TODO http
            if (this.operation === 'add') {
                this.form.projectNumber = 'add-new-test'
                this.contractLlist.push(this.form)
            } else if (this.operation === 'update') {
                this.contractLlist.splice(this.index, 1, this.form)
            }
        },
        handleDelete(index, row) {
            this.index = index
            ElMessageBox.confirm(`确认删除合同《 ${row.projectName}》,编号${row.projectNumber}?`, '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            })
                .then(() => {
                    // TODO http
                    this.contractLlist.splice(index, 1)
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
        cancel() {
            this.editDialogVisible = false
        },
        resetForm() {
            this.$refs.contractForm.resetFields()
        },
        submitForm() {
            this.$refs.contractForm.validate(valid => {
                if (valid) {
                    this.save()
                    this.editDialogVisible = false
                } else {
                    return false
                }
            })
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
.opration-line {
    margin-bottom: 5px;
}
</style>
