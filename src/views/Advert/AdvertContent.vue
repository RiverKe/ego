<template>
  <div class="content">
    <!-- 广告标题 -->
    <div class="title">
      <el-button @click="showDialog">{{ treeData.name }}</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="pid" label="PID" width="180"> </el-table-column>
      <el-table-column prop="name" label="样式名称" width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="访问地址"
        min-width="240"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="image"
        label="图片地址"
        min-width="240"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加广告内容 弹框 -->
    <div class="dialog">
      <el-dialog
        :title="treeData.name"
        :visible.sync="dialogVisible"
        width="45%"
        :before-close="clearForm"
      >
        <!-- <p>当前处于的广告位置：{{ advertInfo.name }}</p> -->
        <!-- PID : <el-input type="text" v-model="contentPID" /> <br> -->
        样式名称 : <el-input type="text" v-model="contentName" /> <br />
        访问地址 : <el-input type="text" v-model="contentUrl" /> <br />
        图片地址 : <el-input type="text" v-model="image" />

        <span slot="footer" class="dialog-footer">
          <el-button @click="clearForm">取 消</el-button>
          <el-button type="primary" @click="submitAdvert">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Object,
      default: function () {
        return { name: "标题" };
      },
    },
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false, //弹框状态关闭
      // contentPID: "", // pid
      contentName: "", // 广告名称
      contentUrl: "", // 访问地址
      image: "", // 图片地址
    };
  },
  watch: {
    treeData: function (val) {
      //清空数据
      console.log("val--", val);
      this.tableData = [];
      this.$api
        .searchAdvert({
          pid: val.pid,
        })
        .then((res) => {
          console.log("监听修改--", res);
          if (res.status === 200) {
            this.tableData = res.result;
          } else {
            //没有数据
          }
        });
    },
  },
  methods: {
    // 删除 当前行
    handleDelete(index, row) {
      console.log("删除事件", index, row);
      this.$api
        .deleteTbContent({
          id: row.id,
        })
        .then((res) => {
          console.log("deleteAD", res);
          if (res.status === 200) {
            this.$message({
              message: "删除广告分类成功！",
              type: "success",
            });
            //更新table视图
            this.http();
          } else {
            this.$message.error("错了哦，删除失败！");
          }
        });
    },
    //增加广告内容 -- 弹框出现
    showDialog() {
      this.dialogVisible = true;
    },
    http() {
      this.$api
        .searchAdvert({
          pid: this.treeData.pid,
        })
        .then((res) => {
          console.log("监听修改--", res);
          if (res.status === 200) {
            this.tableData = res.result;
          } else {
            //没有数据
          }
        });
    },
    // 提交广告 -- 添加进表格
    submitAdvert() {
      // pid  name  contentUrl  image
      console.log("this.treeData-----", this.treeData);
      this.$api
        .insertTbContent({
          pid: this.treeData.pid,
          name: this.contentName,
          url: this.contentUrl,
          image: this.image,
        })
        .then((res) => {
          // console.log("添加表格内容", res);
          if (res.status === 200) {
            this.$message({
              message: "添加表格内容成功！",
              type: "success",
            });
            //隐藏弹框--清空数据
            this.dialogVisible = false;
            this.contentName = "";
            this.contentUrl = "";
            this.image = "";
            //更新table视图
            this.http();
          } else {
            this.$message.error("错了哦，添加表格内容失败！");
          }
        });
    },
    clearForm() {
      //隐藏弹框--清空数据
      this.dialogVisible = false;
      this.contentName = "";
      this.contentUrl = "";
      // this.image = "";
    },
  },
};
</script>

<style scoped lang='scss'>
.content {
  text-align: center;
  .title button {
    margin-bottom: 20px;
    border: none;
    outline: none;
    font-weight: 600;
    font-size: 20px;
  }
  .dialog .el-input {
    margin-bottom: 24px;
    width: 70%;
    margin-left: 20px;
  }
  // .dialog /deep/ .el-input:last-child{
  //   margin-bottom: 0;
  // }
}
</style>