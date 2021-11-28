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

        <el-dialog v-model="editDialogVisible" :title="index === -1 ? '新建合同' : '编辑合同'" width="50%">
            <el-form ref="form" :model="form" label-align="center" width="120px" :rules="rules">
                <el-form-item label="项目编号" prop="projectNumber">
                    <el-input v-model="form.projectNumber"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="form.projectName"></el-input>
                </el-form-item>
                <el-form-item label="项目简称">
                    <el-input v-model="form.projectShorterName"></el-input>
                </el-form-item>
                <el-form-item label="主合同金额" prop="contractAmountTotal">
                    <el-row>
                        <el-input v-model="form.contractAmountTotal"> <template #prepend>总额</template></el-input>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="form.contractAmountBuild"> <template #prepend>建安</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.contractAmountEquip">
                                <template #prepend>设备采购</template>
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.contractAmountOther">
                                <template #prepend>其他</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="预计总收入" prop="incomeAmountTotal">
                    <el-row>
                        <el-input v-model="form.incomeAmountTotal">
                            <template #prepend>总额</template>
                        </el-input>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="form.incomeAmountBuild"> <template #prepend>建安</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.incomeAmountEquip"><template #prepend>设备采购</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.incomeAmountOther">
                                <template #prepend>其他</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="预计总成本" prop="costAmountTotal">
                    <el-row>
                        <el-input v-model="form.costAmountTotal">
                            <template #prepend>总额</template>
                        </el-input>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="form.costAmountBuild"> <template #prepend>建安</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.costAmountEquip">
                                <template #prepend>设备采购</template>
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.costAmountOther">
                                <template #prepend>其他</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="利润" prop="profit">
                    <el-input v-model="form.profit" disabled></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addOrEdit(index, form)">确认</el-button>
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
        return {
            height: window.innerHeight - 150,
            activeName: 'first',
            editDialogVisible: false,
            index: 0,
            searchKeyWord: '',
            form: {},
            rules: {},

            contractLlist: [],
            filteredContractLlist: []
        }
    },
    computed: {},
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
        this.rules = {
            projectName: [
                {
                    required: true,
                    message: '请填写项目名称',
                    trigger: 'blur'
                }
            ],
            mcaTotal: [
                {
                    required: true,
                    message: '请填写主合同金额-总额',
                    trigger: 'blur'
                }
            ]
        }
    },
    methods: {
        handleClick() {},
        handleAdd() {
            this.form = {
                projectName: '',
                projectShorterName: '',
                projectNumber: '',
                contractAmountTotal: 0,
                contractAmountBuild: 0,
                contractAmountEquip: 0,
                contractAmountOther: 0,
                incomeAmountTotal: 0,
                incomeAmountBuild: 0,
                incomeAmountEquip: 0,
                incomeAmountOther: 0,
                costAmountTotal: 0,
                costAmountBuild: 0,
                costAmountEquip: 0,
                costAmountOther: 0,
                profile: 0
            }
            this.index = -1
            this.editDialogVisible = true
        },
        addOrEdit(index, form) {
            if (index === -1) {
                this.contractLlist.push(form)
            } else {
                this.contractLlist.splice(index, 1, form)
            }
            this.editDialogVisible = false
        },
        handleEdit(index, row) {
            this.form = row
            this.index = index
            this.editDialogVisible = true
        },
        handleDelete(index, row) {
            this.index = index
            ElMessageBox.confirm(`确认删除合同《 ${row.projectName}》,编号${row.projectNumber}?`, '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            })
                .then(() => {
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
