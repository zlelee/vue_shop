<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert show-icon :closable="false" title="注意: 只允许为第三级分类设置相关参数" type="warning"> </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader v-model="selectedCateKeys" :options="catelist" :props="cateListProps" @change="parentCateChanged"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabChangeClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="addParamsDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editParamsClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',

  data() {
    return {
      catelist: [],
      cateListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editParamsDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.catelist = res.data
    },
    parentCateChanged() {
      this.getParamsDate()
    },
    tabChangeClick() {
      this.getParamsDate()
    },
    //获取参数的数据
    async getParamsDate() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : item.attr_vals
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addParamsClose() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入正确的参数')
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')
        this.getParamsDate()
        this.addParamsDialogVisible = false
      })
    },
    editParamsClose() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
      this.editForm = res.data
      this.editParamsDialogVisible = true
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入合法的参数信息')
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.editForm.attr_vals
        })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改参数成功')
        this.getParamsDate()
        this.editParamsDialogVisible = false
      })
    },
    async deleteParams(attr_id) {
      const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (result === 'cancle') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
      this.getParamsDate()
    }
  },
  computed: {
    isDisabled() {
      return this.selectedCateKeys.length !== 3
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
    },
    titleText() {
      const title = this.activeName === 'many' ? '动态参数' : '静态属性'
      return title
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 20px 0;
  span {
    margin-right: 20px;
  }
}
.el-table {
  margin: 20px 0;
}
.el-tag {
  margin: 15px;
}
</style>
