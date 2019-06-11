<template>
  <div>
    <el-menu router :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/operation">用户信息</el-menu-item>
      <el-menu-item index="/userReturn">用户退款信息</el-menu-item>
      <el-menu-item index="/">退出登录</el-menu-item>
    </el-menu>
    <el-input style="width: 20%"
              placeholder="请输入手机号"
              v-model="phone"
    >
    </el-input>
    <el-button v-model="phone" @click="searchByPhone" type="primary" size="small">查询</el-button>
    <el-button v-model="phone" @click="clearCondition" type="primary" size="small">清除条件</el-button>
    <el-container>
      <el-main>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
          prop="phone"
          label="手机号"
          width="300">
          </el-table-column>
          <el-table-column
          prop="deposit"
          label="金额"
          width="300">
         </el-table-column>
          <el-table-column
            prop="userStatus"
            label="用户状态"
            width="300">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="500">
            <template slot-scope="scope">
              <el-button @click="applyRefund(scope.row)" type="text" size="small">加入退款队列</el-button>
              <el-button @click="directlyApplyRefund(scope.row)" type="text" size="small">直接退款</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="pagerCount"
          layout="prev, pager, next,jumper"
          :total="total">
        </el-pagination>
      </el-main>
    </el-container>
</div>
</template>

<script>
export default {
  name: 'operation',
  created: function () {
    this.query()
  },
  data () {
    return {
      phone: '',
      activeIndex: '1',
      transfer: '',
      currentPage: 1,
      pageSize: 20,
      pagerCount: 11,
      total: 0,
      tableData: []
    }
  },
  methods: {
    query () {
      this.publicMethods.request({
        data: {
          start: this.currentPage,
          phone: this.phone
        },
        type: this.baseC.method.get,
        url: '/user/get/userList',
        conType: this.baseC.conType.json
      }).then(res => {
        console.log(res)
        if (res.code === -1) {
          this.$router.push('/')
        }
        this.total = res.data.totalNum
        this.tableData = res.data.jiuJiuUserResVOList
      }, res => {
        this.$message.error('服务异常,请稍后！！！')
      })
    },
    applyRefund (row) {
      console.log(row)
      this.publicMethods.request({
        data: {
          phone: row.phone
        },
        type: this.baseC.method.post,
        url: '/order/user/refund',
        conType: this.baseC.conType.json
      }).then(res => {
        console.log(res)
        if (res.code !== 200) {
          this.$message.error(res.message)
          return
        }
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
        } else {
          this.$message.success(res.data.msg)
          this.query()
        }
      }, res => {
        console.log(res)
        this.$message.error('服务异常,请稍后！！！')
      })
    },
    directlyApplyRefund (row) {
      console.log(row)
      this.publicMethods.request({
        data: {
          phone: row.phone
        },
        type: this.baseC.method.post,
        url: '/order/user/directlyRefund',
        conType: this.baseC.conType.json
      }).then(res => {
        console.log(res)
        if (res.code !== 200) {
          this.$message.error(res.message)
          return
        }
        if (res.data.code !== 200) {
          this.$message.warning(res.data.msg)
        } else {
          this.$message.success(res.data.msg)
          this.query()
        }
      }, res => {
        console.log(res)
        this.$message.error('服务异常,请稍后！！！')
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.query()
    },
    searchByPhone () {
      this.currentPage = 1
      this.query()
    },
    clearCondition () {
      this.phone = ''
      this.query()
    }
  }
}
</script>

<style scoped lang="scss">

  .el-header{
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .head {
    text-align: right;
  }
</style>
