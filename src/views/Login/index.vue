<template>
  <div id="login">
    <!-- <el-row>
      <el-col :span="10" :offset="8"></el-col>
    </el-row> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录" name="login">
        <el-form
          id="form"
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：" prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')"
              >登录</el-button
            >
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form
          id="form"
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：" prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')"
              >注册</el-button
            >
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import jwt from "jwt-decode";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      activeName: "login",
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入您的账号", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("loginModule", ["setUser"]),
    handleClick(tab, event) {
      console.log(tab, event);
      // 重置表单
      this.$refs.loginForm.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //登录提交事件
          console.log(this.loginForm);
          if (this.activeName === "login") {
            console.log("登录事件");
            let { username, password } = this.loginForm;
            this.$api
              .getLogin({
                username,
                password,
              })
              .then((res) => {
                console.log(res);
                if (res.status === 200) {
                  //解析token字段
                  console.log(jwt(res.data));
                  let obj = {
                    user: jwt(res.data).username,
                    token: res.data,
                  };
                  //存储vuex
                  this.setUser(obj);
                  //存储本地
                  localStorage.setItem("userinfo", JSON.stringify(obj));
                  //跳转首页
                  this.$router.push("/");
                  this.$message({
                    message: "恭喜你，登录成功！",
                    type: "success",
                  });
                  console.log("登录成功！");
                } else {
                  console.log("登录失败！");
                  this.$message.error("错了哦，账号或者密码错误");
                }
              });
          } else {
            console.log("注册事件");
            let { username, password } = this.loginForm;
            this.$api
              .getRegister({
                username,
                password,
              })
              .then((res) => {
                console.log(res);
                if (res.status === 200) {
                  this.$message({
                    message: "恭喜你，注册成功！",
                    type: "success",
                  });
                } else {
                  console.log("注册失败！");
                  this.$message.error("错了哦，注册失败！");
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
#login {
  width: 500px;
  height: 300px;
  border: 2px solid #aaa;
  border-radius: 20px;
  margin: 80px auto;
  padding: 30px 50px;
  font-size: 20px;
  .el-tabs__nav-warp
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item
    .is-acctive {
    color: cornflowerblue;
  }
  background: #f1f5ff;
  #form {
    margin-top: 20px;
    margin-left: -20px;
    .el-form-item {
      // .el-form-item__label{
      //   font-size: 20px;
      // }
      .el-input {
        width: 350px;
      }
    }
  }
}
</style>