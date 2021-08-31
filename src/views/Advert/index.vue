<template>
  <div class="advert">
    <!-- 左侧 -->
    <div class="advert-left">
      <AdvertTree @getTreeData="getTreeData" />
    </div>
    <!-- 右侧 -->
    <div class="advert-content">
      <AdvertContent :treeData="treeData" />
    </div>
  </div>
</template>

<script>
import AdvertTree from "./AdvertTree.vue";
import AdvertContent from "./AdvertContent.vue";
export default {
  components: {
    AdvertTree,
    AdvertContent,
  },
  data() {
    return {
      treeData: { name: "广告" },
    };
  },
  methods: {
    getTreeData(val) {
      console.log("----", val);
      this.treeData = val;
    },
  },
};
</script>

<style lang='scss' scoped>
.advert {
  margin: 20px;
  .advert-left {
    width: 300px;
    float: left;
  }
  .advert-content {
    float: left;
  }
}
</style>