<template>
    <div class="main">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
            <el-tab-pane label="建造合同准则" name="first" class="tab-pane">
                <div class="opration-line"><el-button type="success" @click="handleAdd()">新建</el-button></div>
                <el-table :data="mcaList" height="calc(100vh - 135px)" stripe>
                    <!-- <el-table-column prop="id" label="序号" fixed align="center" width="150" /> -->
                    <el-table-column prop="name" label="项目名称" fixed align="center" width="120" />
                    <el-table-column prop="referredName" label="项目简称" align="center" width="120" />
                    <el-table-column prop="number" label="项目编号" align="center" />
                    <el-table-column label="主合同金额" align="center">
                        <el-table-column prop="mainContractAmount.total" label="总额" align="center" width="120" />
                        <el-table-column label="细分" align="center" width="120">
                            <el-table-column prop="mainContractAmount.constructionSafety" label="建安" align="center" width="120" />
                            <el-table-column prop="mainContractAmount.equipmentProcurement" label="设备采购" align="center" width="120" />
                            <el-table-column prop="mainContractAmount.other" label="其他" align="center" width="120" />
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预计总收入" align="center">
                        <el-table-column prop="estimatedtotalRevenue.total" label="总额" align="center" width="120" />
                        <el-table-column label="细分" align="center" width="120">
                            <el-table-column prop="estimatedtotalRevenue.constructionSafety" label="建安" align="center" width="120" />
                            <el-table-column prop="estimatedtotalRevenue.equipmentProcurement" label="设备采购" align="center" width="120" />
                            <el-table-column prop="estimatedtotalRevenue.other" label="其他" align="center" width="120" />
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预计总成本" align="center">
                        <el-table-column prop="estimatedTotalCost.total" label="总额" align="center" width="120" />
                        <el-table-column label="细分" align="center" width="120">
                            <el-table-column prop="estimatedTotalCost.constructionSafety" label="建安" align="center" width="120" />
                            <el-table-column prop="estimatedTotalCost.equipmentProcurement" label="设备采购" align="center" width="120" />
                            <el-table-column prop="estimatedTotalCost.other" label="其他" align="center" width="120" />
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

        <el-dialog v-model="editDialogVisible" :title="index === -1 ? '新建合同' : '编辑合同'" align="center" width="50%">
            <el-form ref="form" :model="form" label-align="center" width="120px" :rules="rules">
                <el-form-item label="项目编号" prop="number">
                    <el-input v-model="form.number"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="项目简称">
                    <el-input v-model="form.referredName"></el-input>
                </el-form-item>
                <el-form-item label="主合同金额" prop="mainContractAmount">
                    <el-row>
                        <el-input v-model="form.mainContractAmount.total"> <template #prepend>总额</template></el-input>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="form.mainContractAmount.constructionSafety"> <template #prepend>建安</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.mainContractAmount.equipmentProcurement">
                                <template #prepend>设备采购</template>
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.mainContractAmount.other">
                                <template #prepend>其他</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="预计总收入" prop="estimatedtotalRevenue">
                    <el-row>
                        <el-input v-model="form.estimatedtotalRevenue.total">
                            <template #prepend>总额</template>
                        </el-input>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="form.estimatedtotalRevenue.constructionSafety"> <template #prepend>建安</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.estimatedtotalRevenue.equipmentProcurement"><template #prepend>设备采购</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.estimatedtotalRevenue.other">
                                <template #prepend>其他</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="预计总成本" prop="estimatedTotalCost">
                    <el-row>
                        <el-input v-model="form.estimatedTotalCost.total">
                            <template #prepend>总额</template>
                        </el-input>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-input v-model="form.estimatedTotalCost.constructionSafety"> <template #prepend>建安</template></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.estimatedTotalCost.equipmentProcurement">
                                <template #prepend>设备采购</template>
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.estimatedTotalCost.other">
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
                    <el-button type="primary" @click="addOrEdit(index, form)"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import mcaList from '../json/mcaList.json'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
    name: 'TableView',
    data() {
        return {
            height: window.innerHeight - 150,
            activeName: 'first',
            editDialogVisible: false,
            index: 0,
            form: {},
            rules: {},
            mcaList: []
        }
    },
    created() {
        this.mcaList = mcaList
        this.rules = {
            name: [
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
                id: '',
                name: '',
                referredName: '',
                number: '',
                mainContractAmount: {
                    total: 0,
                    constructionSafety: 0,
                    equipmentProcurement: 0,
                    other: 0
                },
                estimatedtotalRevenue: {
                    total: 0,
                    constructionSafety: 0,
                    equipmentProcurement: 0,
                    other: 0
                },
                estimatedTotalCost: {
                    total: 0,
                    constructionSafety: 0,
                    equipmentProcurement: 0,
                    other: 0
                },
                profile: 0
            }
            this.index = -1
            this.editDialogVisible = true
        },
        addOrEdit(index, form) {
            if (index === -1) {
                this.mcaList.push(form)
            } else {
                this.mcaList.splice(index, 1, form)
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
            ElMessageBox.confirm(`确认删除合同《 ${row.name}》,编号${row.number}?`, '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            })
                .then(() => {
                    this.mcaList.splice(index, 1)
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
