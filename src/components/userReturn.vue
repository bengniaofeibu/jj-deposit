<template>
  <div>
    <el-menu router :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/operation">用户信息</el-menu-item>
      <el-menu-item index="/userReturn">用户退款信息</el-menu-item>
      <el-menu-item index="/">退出登录</el-menu-item>
    </el-menu>
    <el-input style="width: 20%"
      placeholder="请输入订单号"
      v-model="orderNum"
      >
    </el-input>
    <el-button v-model="orderNum" @click="searchByOrderNum" type="primary" size="small">查询</el-button>
    <el-button v-model="orderNum" @click="clearCondition" type="primary" size="small">清除条件</el-button>
    <el-upload
      class="upload"
      ref="upload"
      :action="uploadUrl()"
      name="excelFile"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="uploadFalse"
      :on-success="uploadSuccess"
      :auto-upload="false"
      :before-upload="beforeAvatarUpload">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload()">批量导入</el-button>
      <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
    </el-upload>
    <el-container>
      <el-main>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
          prop="rechargeId"
          label="订单号"
          width="300">
          </el-table-column>
          <el-table-column
            prop="userAccount"
            label="用户账号"
            width="300">
          </el-table-column>
          <el-table-column
          prop="userRefund"
          label="退款账号"
          width="300">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="退款日期"
            width="300">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="500">
            <template slot-scope="scope">
              <el-button @click="advanceRefund(scope.row)" type="text" size="small">提前退款</el-button>
              <el-button @click="applyWxRefund(scope.row)" type="text" size="small">申请微信转账</el-button>
              <el-button type="text" size="small" @click="updateOrderStatus(scope.row)">修改订单状态</el-button>
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
  name: 'userReturn',
  created: function () {
    this.query()
  },
  data () {
    return {
      orderNum: '',
      transfer: '',
      currentPage: 1,
      pageSize: 20,
      pagerCount: 11,
      total: 0,
      tableData: []
    }
  },
  methods: {
    uploadUrl: function () {
      return (
        'http://47.101.202.147:8888/order/upload'
      )
    },
    uploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$message.success('订单批量修改成功')
        this.query()
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error('订单批量修改失败')
      }
    },
    uploadFalse (response, file, fileList) {
      this.$message.error('文件上传失败！')
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message.warning('上传模板只能是 xls、xlsx 格式!')
      }
      if (!isLt2M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      return extension || extension2
    },
    submitUpload () {
      // 触发组件的action
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      if (file.response.code === 200) {
        this.$message.success('订单批量修改成功')
      } else {
        this.$message.error('订单批量修改失败')
      }
    },
    query () {
      this.publicMethods.request({
        data: {
          start: this.currentPage,
          orderNum: this.orderNum
        },
        type: this.baseC.method.get,
        url: '/order/get/orderList',
        conType: this.baseC.conType.json
      }).then(res => {
        console.log(res)
        if (res.code === -1) {
          this.$router.push('/')
        }
        this.total = res.data.totalNum
        this.tableData = res.data.userDelayRefundList
      }, res => {
        this.$message.error('服务异常,请稍后！！！')
      })
    },
    searchOrderNum (val) {
      console.log(val)
    },
    advanceRefund (row) {
      console.log(row)
      this.publicMethods.request({
        data: {
          rechargeId: row.rechargeId
        },
        type: this.baseC.method.post,
        url: '/order/update/orderDate',
        conType: this.baseC.conType.json
      }).then(res => {
        console.log(res)
        if (res.code !== 200) {
          this.$message.error('提前退款修改失败')
        } else {
          this.$message.success('提前退款修改成功')
          this.query()
        }
      }, res => {
        console.log(res)
        this.$message.error('服务异常,请稍后！！！')
      })
    },
    applyWxRefund (row) {
      console.log(row)
      this.publicMethods.request({
        data: {
          rechargeId: row.rechargeId
        },
        type: this.baseC.method.post,
        url: '/order/user/wxRefund',
        conType: this.baseC.conType.json
      }).then(res => {
        console.log(res)
        if (res.code !== 200) {
          this.$message.error(res.message)
          return
        }
        if (res.data.code !== 1105) {
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
    updateOrderStatus (row) {
      console.log(row)
      this.$prompt('请输入退款单号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[0-9a-z]+/,
        inputErrorMessage: '退款单号格式不正确'
      }).then(({ value }) => {
        this.publicMethods.request({
          data: {
            rechargeId: row.rechargeId,
            userRefund: value
          },
          type: this.baseC.method.post,
          url: '/order/update/orderStatus',
          conType: this.baseC.conType.json
        }).then(res => {
          console.log(res)
          if (res.code !== 200) {
            this.$message.error('修改订单状态失败')
          } else {
            this.$message.success('修改订单状态成功')
            this.query()
          }
          this.clearCondition()
        }, res => {
          console.log(res)
          this.$message.error('服务异常,请稍后！！！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.query()
    },

    searchByOrderNum () {
      this.currentPage = 1
      this.query()
    },
    clearCondition () {
      this.currentPage = 1
      this.orderNum = ''
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
