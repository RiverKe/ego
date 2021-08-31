<template>
  <div>
    <el-dialog
      title="商品类目选择参数配置"
      :visible.sync="dialogVisible"
      width="64%"
      :before-close="handleClose"
    >
        <div v-if="dialogVisible">
            <GoodsTree @getTreeData="getTreeData" />
        </div>

        <!-- 内弹框 -->
        <el-dialog width="55%" :title="title" 
        :visible.sync="innerVisible" append-to-body
        :before-close="clearForm"
        >
            <p id="text">当前选中的商品类目：
                <span>{{ productInfo.name ? productInfo.name :ruleForm.specsName }}</span>
            </p>
            <el-button @click="addDomain" type="primary">新增规格列表</el-button>
            <hr>
            <el-form
                :model="dynamicForm"
                ref="dynamicForm"
                label-width="100px"
                class="demo-dynamic"
            >
            
            <!-- 第一层遍历数据结构  -->
                <el-form-item
                    v-for="(item, index) in dynamicForm.groups"
                    :label="item.title"
                    :key="index"
                >
                    <div class="list">
                        <el-input v-model="item.title"></el-input>
                        <el-button @click.prevent="addChildDomain(index)"
                            >添加子组</el-button
                        >
                        <el-button @click.prevent="removeDomain(index)">删除组</el-button>
                    </div>
                    <!-- 第二层子组遍历 -->
                    <el-form-item
                        v-for="(ele, n) in item.children"
                        :label="ele.title"
                        :key="n"
                    >
                        <div class="list">
                            <el-input v-model="ele.title"></el-input>
                            <el-button @click.prevent="removeCurrentDomain(index, n)"
                            >删除</el-button
                            >
                        </div>
                    </el-form-item>
                </el-form-item>
            </el-form>

            <!-- 内弹框 提交 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDynamicForm">提 交</el-button>
                <el-button @click="clearForm">重 置</el-button>
            </span>
        </el-dialog>
        <!-- 外弹框提交 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消
            </el-button>
            <el-button type="primary"
            :disabled="isShow"
            @click="innerVisible = true"
            >确定并添加分组
            </el-button>
        </span>
    </el-dialog>    
  </div>
</template>

<script>
import GoodsTree from '../Goods/GoodsTree.vue'
export default {
    components: {
        GoodsTree,
    },
    props: {
        title: {
            type: String,
            default: "添加规格参数",
        },
        rowData: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    watch: {
        rowData(val) {
            //延迟加载  this.$nextTick()
            this.$nextTick(() => {
                console.log("监听数据params====", val);
                this.ruleForm = val;
                // 监听规格参数修改 解析paramData数据 页面回显内弹框groups表单
                this.dynamicForm.groups = JSON.parse(val.paramData); 
            });
        },
    },
    data(){
        return {           
            dialogVisible: false,
            isShow: true, // 禁止 外弹框 tree 提交
            innerVisible: false,
            productInfo: {}, // 点击tree数据
            ruleForm: {
                id: '',
                itemCatId: "", // 对于类目选择的cid
                paramData: "",
                specsName: ""
            },
            dynamicForm: { // 动态表单数据
                groups: [
                    // {
                    //   value: '规格的值',
                    //   title: '规格名称',
                    //   children: [
                    //     { value: '', title: '' },
                    //     { value: '', title: '' },
                    //   ]
                    // },
                    // {
                    //   value: '主体',
                    //   title: '基本信息',
                    //   children: [
                    //     { value: '', title: '' },
                    //     { value: '', title: '' },
                    //   ]
                    // },
                ],
            } ,
        };
    },
    methods: {        
        // 关闭按钮
        handleClose() {
            this.dialogVisible = false;
        },
        /**
         * 点击tree 传递tree数据
         */
        getTreeData(val) {
            console.log("======", val);
            //按钮可以点击
            this.isShow = false;
            this.productInfo = val;
        },
        /**
         * 动态表单事件
         * ----------------------------------------------- 
         * */
        // 增加外层大组件列表
        addDomain() {
            this.dynamicForm.groups.push({
                value: "",
                title: "",
                children: [],
            });
        },
        // 删除外层 表单组件
        removeDomain(index) { // 外层遍历
            // 当前 groups 的下标为 index 的表单删除
            this.dynamicForm.groups.splice(index,1); 
        },

        // 增加子组件
        addChildDomain(index) {
            // groups 的内层 children 添加子组
            this.dynamicForm.groups[index].children.push({
                value: '', title: '',
            });
        },
        // 删除当前子组件
        removeCurrentDomain(index, n) {
            // 当前 groups 下的 children 中选中的下标为 n 的表单删除
            this.dynamicForm.groups[index].children.splice(n, 1)
        },
        /**
         * 提交事件---itemCatId,content,specsName
         */
        submitDynamicForm() {            
            console.log("规格数据", this.dynamicForm.groups.length);
            let { id, itemCatId, specsName } = this.ruleForm;

            if(this.title === '添加规格参数'){
                //最好判断规格参数有数据 否则没有添加的必要
                this.$api.addRulesParams({
                    specsName: this.productInfo.name,
                    itemCatId: this.productInfo.cid,
                    content: JSON.stringify(this.dynamicForm.groups),
                }).then(res => {
                    console.log('-------', res);
                    if (res.status === 200) {
                        this.$message({
                            message: "恭喜你，成功添加规格参数！",
                            type: "success",
                        });
                        //清空表单
                        clearForm();
                        //更新视图
                        this.$parent.http(1);
                    } else {
                        this.$message.error("错了哦，规格参数添加失败！");
                    }
                })
            } else {                
                console.log("编辑规格参数 -- 类目选择",id,itemCatId);
                console.log('!!!', this.ruleForm.specsName);
                this.$api.updateParams({
                    id,
                    cid: itemCatId,
                    specsName,
                    content: JSON.stringify(this.dynamicForm.groups),
                }).then(res => {
                    if (res.status === 200) {
                    // this.dynamicForm.groups = JSON.parse(this.ruleForm.paramData);
                    this.$message({
                        message: "恭喜你，成功修改parameter！",
                        type: "success",
                    });
                    // 清空内弹框表单
                    // this.dynamicForm.groups = [];
                    // //
                    // this.innerVisible=false;
                    // this.dialogVisible=false;
                    this.clearForm();
                    // 刷新params列表--操作父元素里面方法
                    this.$parent.http(this.$parent.currentPage);
                    } else {
                    this.$message.error("错了哦，修改parameter失败！");
                    }
                })
            }
        },
        clearForm() {
            this.innerVisible = false;
            this.dialogVisible = false;
            this.dynamicForm.groups = [];
            //按钮禁止
            this.isShow = true;
        },        
    },
};
</script>

<style lang='scss' scoped>
#text{
    display: inline-block;
    margin-right: 20px;
    span{
        color: dodgerblue;
    }
}
.list {
  display: flex;
  button {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .el-input{
      margin-bottom: 10px;
  }
}
</style>