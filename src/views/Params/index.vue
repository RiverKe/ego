<template>
  <div>
    <!-- 1. 搜索内容 -->
    <div class="header">
      <el-input v-model="search" placeholder="请输入内容" @change='goSearch'/>
      <el-button type="primary">查询</el-button>
      <el-button type="primary" @click="showDialog">添加</el-button>
    </div>

    <!-- 2. 表格列表 -->
    <el-table :data="tableData">
      <el-table-column prop="itemCatId" label="规格参数ID" width="110">
      </el-table-column>
      <el-table-column prop="id" label="类目ID" width="110"> </el-table-column>
      <el-table-column prop="specsName" label="规格名称" width="140">
      </el-table-column>
      <el-table-column prop="paramData" label="规格参数" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 3. 分页功能 -->    
    <div class="pagination">
      <Pagination
        :pageSize="pageSize"
        :total="total"
        @changeCurrent="changeCurrent"
      />
    </div>

    <!-- 4. 弹框 -->
    <ParamsDialog ref="myDialog" :title='title' :rowData='rowData' />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination.vue";
import ParamsDialog from "./ParamsDialog.vue";
export default {
  components: {
    Pagination,
    ParamsDialog,
  },
  data() {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1, // 当前页码
      total: 100,
      search: "",
      title:'添加规格参数',
      rowData:{},
    };
  },
  methods: {
    /**
     * 搜索框事件
     */
    goSearch(){
      // console.log('搜索数据：', this.search);
      if(this.search){
        this.$api.searchParams({
          search: this.search
        }).then(res=>{
          console.log(res.data);
          if(res.data.status === 200){
            this.tableData = res.data.result;
            this.pageSize = 8;
            this.total = res.data.result.length;
          }else{
            console.log('查无数据');           
            this.tableData = [];
            this.pageSize = 1;
            this.total = 0;
          }
        })
      }else{
          this.http(1);
      }
    },
    /**
     * 点击"添加"按钮 显示弹框
     */
    showDialog() {
      this.$refs.myDialog.dialogVisible = true;
      this.title='添加规格参数';
    },
    // 编辑
    handleEdit(index, row) {
      console.log("编辑 rules--params ", index, row);
      this.$refs.myDialog.dialogVisible = true;
      this.title='编辑规格参数';
      this.$nextTick(() => {     
        this.$refs.myDialog.innerVisible = true;   
        //新地址：1. {...}  2. Object.assgin({},row) 
        this.rowData = { ...row };//row={}
      })

    },
    // 删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除功能
          this.$api
            .deleteRulesParams({
              id: row.id,
            })
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                //更新视图
                this.http(this.currentPage);
                this.$message({
                  message: "恭喜你，规格参数删除成功！",
                  type: "success",
                });
              } else {
                this.$message.error("错了哦，删除规格参数失败");
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
     * 分页点击
     */
    changeCurrent(val) {
      this.http(val);
      this.currentPage = val;
    },
    // 网络请求
    http(page) {
      this.$api
        .getParams({
          page,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            //表格数据
            this.tableData = res.data;
            //分页器
            this.total = res.total;
            this.pageSize = res.pageSize;
          }
        });
    },
  },
  created() {
    this.http(1);
  }
};
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  margin: 20px;
  button {
    margin-left: 20px;
  }
}
.pagination {
  text-align: center;
  margin: 20px;
}
</style>