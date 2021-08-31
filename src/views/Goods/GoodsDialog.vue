<template>
  <div>
    <!-- 外层弹框 表单数据框架 -->
    <el-dialog :title="title" width="72%" :visible.sync="dialogVisible" 
    :before-close="clearForm">
    <!-- :before-close -- 点'X'置空弹框表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="类目选择">
          <el-button type="primary" @click="showInnerVisible"
            >{{ ruleForm.category }} </el-button
          >
        </el-form-item>
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="num">
          <el-input v-model="ruleForm.num"></el-input>
        </el-form-item>
        <el-form-item label="商品卖点" prop="sellPoint">
          <el-input v-model="ruleForm.sellPoint"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-button type="primary" @click="uploadImage">上传图片</el-button>
          <img
            :src="ruleForm.image"
            style="width: 150px; vertical-align: middle; margin-left: 30px"
          />
        </el-form-item>
        <!-- 富文本编辑框 -->
        <el-form-item label="商品描述" prop="desc">
          <WangEditor ref="wangEditor" @getWangData="getWangData" />
        </el-form-item>

        <!-- params 类目规格参数 -->
        <!-- <template v-if="ruleShow"> -->
          <el-form-item label="规格参数配置" v-show="ruleShow">            
            <el-form ref="dynamicForm" label-width="100px">
            <!-- 第一层遍历 -->
              <el-form-item :label="item.title"
                v-for="(item, index) in paramsList"            
                :key="index"
              >
                <div class="list">
                  <el-input v-model="item.value"></el-input>
                </div>
                <!-- 第二层 -->
                <el-form-item
                  v-for="(ele, n) in item.children"
                  :label="ele.title"
                  :key="n"
                >
                  <div class="list">
                    <el-input v-model="ele.value"></el-input>
                  </div>
                </el-form-item>
              </el-form-item>
            </el-form>
          </el-form-item>
        <!-- </template> -->

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" @click="submitForm"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 1. 内弹框---类目选择-- -->
    <el-dialog
      width="40%"
      title="类目选择"
      :visible.sync="innerVisible"
      append-to-body
    >
      <!-- 类目选择 列表tree -->
      <GoodsTree @getTreeData='getTreeData' ref="tree"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="showTreeData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 2. 内弹框--上传图片 -->
    <el-dialog
      width="40%"
      title="上传图片"
      :visible.sync="imgInnerVisible"
      append-to-body
    >
      <!-- 上传图片 静态托管 回显图片 -->
      <!-- <GoodsUpload @showImage="showImage" /> -->
      <GoodsUpload ref="uploadImg" />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            () => {
              this.imgInnerVisible = false;
              this.ruleForm.image = this.$refs.uploadImg.uploadImgUrl;
            }
          "
          >确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GoodsTree from "./GoodsTree.vue";
import GoodsUpload from "./GoodsUpload.vue";
import WangEditor from "./WangEditor.vue";
export default {
  components: {
    GoodsTree, // 类目选择
    GoodsUpload, // 上传图片
    WangEditor, // 富文本编辑框
  },
  props: {
    title: {
      type: String,
      default: "添加商品",
    },
    rowData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  watch: {
    // 侦听器 监听rowData数据变化 created钩子完成时已发生  此时添加 延迟加载 this.$nextTick()
    rowData(val) { // 可传新、旧数据两个参数
      this.$nextTick(() => {
        console.log("监听rowData数据修改", val);
        // 赋值ruleForm获取要编辑的row数据渲染页面
        this.ruleForm = val;

        //获取规格配置参数  先判断规格参数是否存在，存在设置显示 转数组对象
        if (val.paramsInfo) {
          this.paramsList = JSON.parse(val.paramsInfo);
          this.ruleShow = true;
        }

        // 设置富文本编译器 editor.txt.html()
        this.$refs.wangEditor.editor.txt.html(val.descs); //详情描述 字段名前后端不一致
      });
    },
  },
  data() {
    return {
      dialogVisible: false, //外弹框
      innerVisible: false, //内弹框
      imgInnerVisible: false, //内弹框-图片上传
      treeData: {}, // tree类目数据 子传父$emit
      paramsList: [], //类目选择 规格参数数据
      ruleShow: false, //是否显示 类目选择配置
      ruleForm: {
        category: "类目选择", //类目名称
        cid: "", //类目标识
        title: "",
        price: "",
        num: "",
        sellPoint: "",
        image: "", //图片地址
        desc: "",
        id: "",
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 18, message: "长度在 1 到 18 个字符", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        num: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { min: 1, message: "至少一件商品", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /* 类目选择 */
    showInnerVisible() {
      this.innerVisible = true;
      // this.dialogVisible = false
    },
    /**
     * 点击tree返回对应的类目数据
     */
    getTreeData(val) {
      this.treeData = val;
    },
    showTreeData() {
      // this.ruleForm.category = this.$refs.tree.selectednode; // $refs获取子组件数据

      //显示类目 在外弹框表单数据里显示
      this.ruleForm.category = this.treeData.name;
      this.ruleForm.cid = this.treeData.cid;

      this.innerVisible = false; //关闭内弹框
      console.log('-------',this.ruleForm.cid);
      // 获取规格参数
      this.$api.getCategoryParams({
        cid: this.ruleForm.cid,
      }).then(res => {
        console.log('goods--类目参数', res);
        if(res.status === 200){
          // 渲染规格配置
          this.ruleShow = true;
          // 规格参数配置-- result 解析数据 paramsList
          this.paramsList = JSON.parse(res.result[0].paramData);
          console.log(this.paramsList);
        } else {
          this.ruleShow = false;
        }
      })
    },
    /**
     * 点击按钮--显示上传图片
     */
    uploadImage() {
      this.imgInnerVisible = true;
    },
    /**
     * 回显图片
     */
    showImage(val) {
      this.ruleForm.image = val;
    },
    /**
     * 富文本编译数据
     */
    getWangData(val) {
      // console.log("富文本编译数据：", val);
      this.ruleForm.desc = val;
    },
    /**  提交表单
     * 确定按钮提交表单
     *  参数： title cid  category sellPoint price num desc paramsInfo image
    */
    submitForm() {
      let { title, cid, category, sellPoint, price, num, desc, image, id } = this.ruleForm;
      let paramsInfo = JSON.stringify(this.paramsList); 
      if(this.title == '添加商品'){
        this.$api
          .getAddProduct({
            title,
            cid,
            category,
            sellPoint,
            price,
            num,
            desc,
            image,
            paramsInfo,//规格参数配置内容
          })
          .then((res) => {
            // console.log("----", res);
            if (res.status === 200) {
              // 提示消息--添加成功
              this.$message({
                message: "添加商品成功！☺",
                type: "success",
              });
              // 关闭内弹框 重置表单 
              this.clearForm();
              // 刷新商品列表--操作父元素里面方法
              this.$parent.http(1);
            } else {
              this.$message.error("错了哦，添加商品失败了！☹");
            }
          });
      }else{
        console.log('编辑商品',this.ruleForm);
        this.$api.updateProduct({
            title,
            cid,
            category,
            sellPoint,
            price,
            num,
            desc,
            image,
            id,
            paramsInfo,//规格参数配置内容
          }).then(res => {
            console.log('编辑商品--',res);
            if (res.status === 200) {
              // 1.提示消息 修改成功
              this.$message({
                message: "恭喜你，修改成功！♪♪♪",
                type: "success",
              });
              // 2.清空表单 隐藏弹框
              this.clearForm();
              // 3.更新列表 --
              this.$parent.http(this.$parent.currentPage);
            }else{
              this.$message.error("很遗憾，未能修改商品参数！");
            }
          })
      }
    },
    /**
     * 清空表单
     */
    clearForm() {
      console.log("--------------");
      this.dialogVisible = false; //隐藏弹框
      //清空表单数据 1.初始化ruleForm 2.element-ui提供的重置
      this.ruleForm = {
        category: "类目选择", //类目名称
        cid: "", //类目标识
        title: "",
        price: "",
        num: "",
        sellPoint: "",
        image: "",
        desc: "",
      };
      //单独清空富文本编译器 editor.txt.clear() 清空编辑器内容
      this.$refs.wangEditor.editor.txt.clear();
      //清空类目选择 params 规格配置
      this.paramsList = [];
      this.rulesShow = false;
    },
  },
};
</script>

<style>
</style>