<template>
  <div class="layout">
    <!-- 左侧导航 -->
    <Mymenu :isCollapse="isCollapse" class="slideNav" />
    <!-- 右侧内容  顶部导航 -->
    <div class="header">
      <div class="top-header">
        <div class="left">
          <!-- <i class="iconfont" :class="{ 'icon-right-indent':!isCollapse, 'icon-left-indent':isCollapse }" @click="isCollapse=!isCollapse"></i> -->
          <i
            class="iconfont"
            :class="isCollapse ? 'icon-left-indent' : 'icon-right-indent'"
            @click="isCollapse = !isCollapse"
          ></i>
        </div>
        <div class="userinfo">
          <!-- 切换语言 -->
          <el-dropdown
            style="margin-right: 10px"
            @command="handleCommand"
            trigger="click"
          >
            <span class="el-dropdown-link" style="color: #fff">
              切换语言 <i class="iconfont icon-pulldown01"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 登录退出 -->
          <span v-if="!userinfo.user">hello 请登录！</span>
          <span v-else>hello {{ userinfo.user }}</span>
          <span v-if="!userinfo.user">
            <router-link to="/login">
              <i class="iconfont login icon-gerenzhongxin-denglu"></i>
            </router-link>
          </span>
          <span v-else>
            <i class="iconfont icon-hkquit" @click="loginout"></i>
          </span>
        </div>
      </div>
    </div>
    <!-- 路由出口 -->
    <div class="main-content" :class="{ content: isCollapse }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Mymenu from "../../components/Mymenu.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Mymenu,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    ...mapMutations("loginModule", ["clearUser"]),
    loginout() {
      /**
       * 退出登录
       * 1. 清空vuex  2. 清空存储数据 3.返回登录界面
       */
      localStorage.removeItem("userinfo");
      this.clearUser();
      this.$router.push("/login");
      //刷新：window.localtion.reload()
    },
    /**
     * 切换语法
     */
    handleCommand(command) {
      // console.log("切换语言", command);
      // console.log(this.$i18n.locale)
      if (command == "zh") {
        this.$i18n.locale = "zh";
        localStorage.setItem("lang", "zh");
      } else if (command == "en") {
        this.$i18n.locale = "en";
        localStorage.setItem("lang", "en");
      }

      // this.$i18n.locale = command;
    },
  },
};
</script>

<style lang='scss' scoped>
.layout {
//   height: 100%;
//   display: flex;

  height: 100%;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-menu {
    border-right: 0;
  }
  .slideNav {
    height: 100%;
    // width: 200px;
    background: #304156;
    float: left;
  }
  .header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    .top-header {
      background: cornflowerblue;
      height: 50px;
      line-height: 50px;
      color: #fff;

      .left {
        float: left;
        padding-left: 10px;
        .iconfont {
          font-size: 24px;
          color: #f5f5f5;
          margin-bottom: 10px;
        }
      }
      .userinfo {
        float: right;
        color: #fff;
        vertical-align: middle;
        padding-right: 10px;
        span {
          padding-right: 20px;
          i {
            font-size: 22px;
            color: #fff;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .main-content{
    margin-left: 200px;
  }
  .content{
    margin-left: 72px;
  }

  /* .main-content {
    flex: 1;
    .top-header {
      background: cornflowerblue;
      height: 50px;
      line-height: 50px;
      color: #fff;

      .left {
        float: left;
        padding-left: 10px;
        .iconfont {
          font-size: 24px;
          color: #f5f5f5;
          margin-bottom: 10px;
        }
      }
      .userinfo {
        float: right;
        color: #fff;
        vertical-align: middle;
        padding-right: 10px;
        span {
          padding-right: 20px;
          i {
            font-size: 22px;
            color: #fff;
            vertical-align: middle;
          }
        }
      }
    }
  } */
}
</style>