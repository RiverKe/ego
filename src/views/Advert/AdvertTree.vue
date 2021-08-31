<template>
  <div>
    <el-tree
      :data="data"
      :expand-on-click-node="false"
      :render-content="renderContent"
      :props="props"
      lazy
      :load="loadNode"
      node-key="pid"
      :default-expanded-keys="[1001]"
      @node-click="handleNodeClick"
    >
    </el-tree>

    <!-- 弹框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
      <p id="adPosi">当前节点的广告标题 ：<span>{{ advertInfo.name }}</span></p>
      <el-input type="text" v-model="advertName"/>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdvert">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      dialogVisible: false, //弹框状态关闭
      title: "添加广告",
      advertName: "", //广告名字
      advertInfo: {}, //点击广告节点内容
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
      data: [],
    };
  },
  methods: {
      //点击tree节点---发送数据
    handleNodeClick(data) {
      console.log(data);
      this.$emit('getTreeData',data)
    },
    http(){
        this.$api.getAdvertList().then((res) => {
          console.log("广告分类", res);
          this.data=res.result;
        });
    },
    //进入组件懒加载数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        //第一次请求
        this.$api.getAdvertList().then((res) => {
          console.log("广告分类", res);
          return resolve(res.result);
        });
      }
      if (node.level >= 1) {
        this.$api
          .getAdvertList({
            id: node.data.pid,
          })
          .then((res) => {
            console.log("广告分类---22---", res);
            if (res.status === 200) {
              return resolve(res.result);
            } else {
              return resolve([]);
            }
          });
      }
    },
    //render-content ------------------------------------------
    /**
     * 添加 ---- 点击添加 弹框出现  点击弹框提交按钮 添加tree子节点
     *  */
    append(data) {
      console.log(data);
      //显示弹框
      this.dialogVisible = true;
      this.title = "添加广告";
      //获取点击的节点内容
      this.advertInfo = data;
    },
    /**
     * 删除 ---- 删除tree子节点
     *  */
    remove(node, data) {
      console.log(node);
      this.$confirm("此操作将永久删除该节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          // 删除tree子节点功能
          this.$api.deleteAdvertChild({
            pid: node.data.pid,
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              //更新视图
              this.http();
              this.$message({
                message: "删除tree节点成功！",
                type: "success",
              });
            } else {
              this.$message.error("错了哦，删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 修改 ---- 点击修改 弹框出现   弹框点击提交 修改tree子节点
     *  */
    update(data) {
      //显示弹框
      this.dialogVisible = true;
      this.title = "修改广告名称";
      //获取点击的节点内容
      this.advertInfo = data;
      this.advertName = data.name;
    },
    /**
     * 点击提交确定按钮 -------- 添加tree子节点 || 修改子节点    
     */
    submitAdvert() {
      if (this.title == "添加广告") {
        console.log("添加事件");
        this.$api
          .addAdvertChild({
            pid: this.advertInfo.pid,
            name: this.advertName,
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              //添加成功
              this.$message({
                message: "恭喜你，添加tree成功！",
                type: "success",
              });
              //隐藏弹框--清空数据
              this.dialogVisible = false;
              this.advertName = "";
              //更新tree
              this.http()
              
            } else {
              //错误信息提示
              this.$message.error("错了哦，添加tree失败！");
            }
          });
      } else {
        console.log('修改事件', this.advertInfo);
        this.$api.updateAdvertChild({
          pid: this.advertInfo.pid,
          name: this.advertName,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            //添加成功
            this.$message({
              message: "恭喜你，修改子导航成功！",
              type: "success",
            });
            //隐藏弹框--清空数据
            this.dialogVisible = false;
            this.advertName = "";
            //更新tree
            this.http()            
          } else {
            //错误信息提示
            this.$message.error("错了哦，修改子导航失败！");
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-rightBtn">
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data, "add")}
            >
              增加
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.update(data, "update")}
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </div>
      );
    },
  },
};
</script>

<style lang="scss" scoped>
#adPosi{
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
  span{
    color: dodgerblue;
  }
}
// .custom-tree-node{
//   width: 360px;
//   position: absolute;
//   .node-rightBtn{
//     position: relative;
//     right: 10px;
//     top: 5px;
//   }
// }
</style>