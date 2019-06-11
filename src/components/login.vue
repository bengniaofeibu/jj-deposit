<template>
  <div class="login">
    <div class="be-content pren">

      <div class="ioc_text">
        <span>请登录您的用户</span>
      </div>

      <div>
        <form action="">
          <div class="br-content">

            <div class="input-group mb-4 bootint">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-user"></i></span>
              </div>
              <input type="text" class="form-control" v-model="username" placeholder="用户名">
            </div>

            <div class="input-group mb-4 bootint">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-unlock-alt"></i></span>
              </div>
              <input type="password" class="form-control" v-model="password" placeholder="密码">
            </div>

            <div class="br-text">
              <!--<p>-->
                <!--<span>忘记密码?</span>-->
                <!--<a href="">找回</a>-->
              <!--</p>-->
            </div>
            <div style="padding-top: 10px">
              <!--<input type="button" class="btn" value="登录">-->
              <el-button type="primary" :plain="true" class="btn" @click="do_login">登录</el-button>
            </div>
            <div class="be-con">
              <!--<span>Copyright © 2018 - 2019 <a href="">系统登陆</a></span>-->
            </div>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    do_login: function () {
      let that = this
      console.log(that.username)
      if (that.username === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (that.password === '') {
        that.$message.error('密码不能为空')
        return
      }
      that.publicMethods.request({
        data: {
          userName: that.username,
          passWord: that.password
        },
        url: '/user/doLogin',
        conType: that.baseC.conType.json
      }).then(function (data) {
        console.log(data)
        if (data.code === -1) {
          that.$message(data.message)
          return
        }
        that.$router.push('/operation')
      }, function (data) {
        that.$message.error('服务异常,请稍后！！！')
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/login.css";
@import "../assets/css/bootstrap.css";
@import url("https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css");
</style>
