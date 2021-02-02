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
          <span>选择商品分类</span>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',

  data() {
    return {
      catelist: []
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
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 20px 0;
}
</style>
