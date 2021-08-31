<template>
  <div>
    <!-- 1. 搜索框 -->
    <div class="header">
      <el-input v-model="search" placeholder="请输入内容" @change='goSearch'></el-input>
      <el-button type='primary'>查询</el-button>
      <!-- <el-button type='primary'>添加</el-button> -->
      <el-button type='primary' @click="showDialog">添加</el-button>
    </div>

    <!-- 2. 表格数据 -->
    <el-table :data="tableData" ref="multipleTable" 
    @selection-change="handleSelectionChange" style="textAlign: center">
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="id" label="商品ID" width="80"> </el-table-column>
      <el-table-column
        prop="title"
        label="商品名称"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="price" label="商品价格" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="num" label="商品数量" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="category" label="规格类目" width="100" show-overflow-tooltip >         
      </el-table-column>
      <el-table-column prop="image" label="商品图片" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sellPoint" label="商品卖点" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="descs" label="商品描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <p class="goodsDesc" v-html="scope.row.descs"></p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
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
    <!--  表格数据 批量删除操作 -->
    <div class="batchDelete">
      <el-button @click="batchDelete">批量删除</el-button>
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>

    <!-- 3. 分页 ———— 表格数据 -->
    <div class="pagination">
      <Pagination
        :pageSize="pageSize"
        :total="total"
        @changeCurrent="changeCurrent"
      />
    </div>
    
    <!-- 4. 弹框 -->
    <GoodsDialog ref='dialog' :title="title" :rowData="rowData" />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination.vue";
import GoodsDialog from './GoodsDialog.vue'
export default {
  components: {
    Pagination,  // 分页
    GoodsDialog, // 弹框
  },
  data() {
    return {
      tableData: [], //表格数据 {name,xxx,}
      pageSize: 8, // 每页条数
      currentPage: 1, // 当前页码
      total: 100, // 总页数
      search: '', // 输入框搜索内容
      title: '添加商品',
      rowData: {}, // 编辑表格数据传值
      multipleSelection: [], // 批量选择 选中标签
      idArr: [],
    };
  },
  methods: {
    /**
     *  编辑按钮 
     * */
    handleEdit(index, row) {
      console.log(index, row);
      // 点击编辑 显现外弹框
      this.$refs.dialog.dialogVisible = true;
      this.title = '编辑商品';
      // 对象的检测更新 新地址：1. {...}  2. Object.assgin({},row)  3. vue内置方法$set
      this.rowData = { ...row }; // row = {}
      console.log(this.rowData,'====');
    },
    /**
     *  删除按钮 
     * */
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
            .deleteProduct({
              id: row.id,
            })
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                //更新视图
                this.http(this.currentPage);
                this.$message({
                  message: "删除商品成功！",
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
     *  批量删除 
     * */
    batchDelete(){
      console.log('multipleSelection-----', this.multipleSelection);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          
          this.$api
            .batchDelete({
              idArr: this.idArr,
            }) //multipleSelection.id
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "批量删除成功!",
                });
                //更新视图
                this.http(this.currentPage);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消批量删除",
          });
        });
    },
    /**
     *  切换第二、第三行的选中状态  批量删除 -- 取消选择 
     * */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 返回选中row对应的id 数组
      this.multipleSelection.forEach((ele)=>{
        this.idArr.push(ele.id);
      })
      console.log('批量选中row的idArr：',this.idArr);
      // console.log('multipleSelection-----',val);
    },
    // 获取点击页码
    changeCurrent(val) {
      console.log('curr---',val);
      this.currentPage = val;
      this.http(val);
    },
    // 商品列表网络请求封装
    http(page) {
      // 网络请求
      this.$api
        .getProductList({
          page,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.tableData = res.data;
            // 显示每页条数
            this.pageSize = res.pageSize;
            this.total = res.total;
          }
        });
    },
    /**
     * 搜索框事件
     */
    goSearch(){
      // console.log('搜索数据：', this.search);
      if(this.search){
        this.$api.getSearch({
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
     * 点击显示添加弹框
     */
    showDialog(){
      console.log('显示弹框');
      this.$refs.dialog.dialogVisible = true;
      this.title = '添加商品'
    },
  },
  created() {
    this.http(1);
  },
};
</script>

<style lang='scss' scoped>
.header{
  display: flex;
  margin: 20px;
  button{
    margin-left: 20px;
  }
}
.batchDelete{
  margin-top: 10px;
}
.pagination {
  text-align: center;
  margin: 20px;
  // margin-left: 300px;
  // margin: 20px auto;
}
</style>