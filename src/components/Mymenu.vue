<template>
  <div class="menu">
    <el-menu
      :default-active="$route.path"
      router
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409eff"
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
    >
      <el-menu-item >
        <span slot="title">{{$t("home.title") }}</span>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">{{$t("home.product") }}</span>
      </el-menu-item>
      <el-menu-item index="/params">
        <i class="el-icon-document"></i>
        <span slot="title">{{$t("home.parameters") }}</span>
      </el-menu-item>
      <el-menu-item index="/advert">
        <i class="el-icon-s-tools"></i>
        <span slot="title">{{$t("home.advert") }}</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-s-custom"></i>
        <span slot="title">{{$t("home.user") }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang='scss' scoped>
// .menu {
//   height: 100%;
//   background: #304156;
//   .el-menu {
//     border-right: 0;
    .is-active {
      //选中的el-menu-item
      background: #333 !important;
    }
    .el-menu{
      border-right: none;
    }
    .el-menu-item:hover,
    .el-menu-item:focus {
      background: #1f2d3d !important;
      color: #409eff;
    }
//   }
//   .el-menu-vertical-demo:not(.el-menu--collapse) {
//     width: 200px;
//   }
// }
</style>