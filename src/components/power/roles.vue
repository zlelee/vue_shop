<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '']">
              <el-col :span="5">
                <el-tag closable @close="removeRolesById(scope.row, item1.id)"> {{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRolesById(scope.row, item2.id)"> {{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRolesById(scope.row, item3.id)"> {{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="setRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="closeRightDialog">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="50%" @close="closeAddForm">
      <!-- 添加角色表单 -->
      <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolseDialogVisible" width="50%" @close="closeEditDialog">
      <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="editRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      addRolesDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      editRolseDialogVisible: false,
      editRolesForm: {},
      editRolesFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色数据列表失败')
      this.rolesList = res.data
    },
    async removeRolesById(role, itemId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult === 'cancle') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${itemId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
    },
    async setRights(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    closeRightDialog() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join()
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 重新渲染整个角色列表
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    //展示添加角色
    showAddRoles() {
      this.addRolesDialogVisible = true
    },
    //添加角色
    async addRoles() {
      const { data: res } = await this.$http.post('roles', {
        roleName: this.addRolesForm.roleName,
        roleDesc: this.addRolesForm.roleDesc
      })
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功')
      this.addRolesDialogVisible = false
      this.getRolesList()
    },
    //监听关闭添加表单事件
    closeAddForm() {
      this.$refs.addRolesFormRef.resetFields()
    },
    //点击编辑
    async showEditRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.editRolesForm = res.data
      this.roleId = id
      this.editRolseDialogVisible = true
    },
    editRoles() {
      this.$refs.editRolesFormRef.validate(async (config) => {
        if (!config) return this.$message.error('请输入合法的信息')
        const { data: res } = await this.$http.put('roles/' + this.roleId, this.editRolesForm)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
        this.$message.success('编辑成功!')
        this.getRolesList()
        this.editRolseDialogVisible = false
      })
    },
    //监听编辑对话框关闭事件
    closeEditDialog() {
      this.$refs.editRolesFormRef.resetFields()
    },
    async deleteRoles(id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (result === 'cancel') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-col {
  text-align: left;
}
.el-table {
  margin: 20px 0;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 15px 0;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
