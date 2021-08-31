<template>
  <el-pagination
    background
    layout="total, prev, pager, next, jumper"
    :page-size="pageSize"
    :total="total"
    @current-change="changePage"
  >
  </el-pagination>
</template>

<script>
export default {
  props: {
    pageSize: {
      type: Number,
      default: 8,
    },
    total: {
      type: Number, //分页中页码仅允许Number类型
      default: 100,
    },
  },
  methods: {
    changePage(val) {
      //子传父  自定义事件
      this.$emit("changeCurrent", val);
    },
  },
};
</script>

<style>
</style>