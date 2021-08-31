/**
 * 基础的接口地址
 */
const base = {
    baseUrl: 'http://localhost:3333', //基础地址
    login: '/api/login', //登录接口
    register: '/api/register', //注册接口
    projectList: '/api/projectList', //商品列表接口
    search: '/api/search', //搜索接口
    selectCategory: '/api/backend/itemCategory/selectItemCategoryByParentId', // 类目选择
    uploadUrl: '/upload', // 上传图片 无需跨域
    addProduct: "/api/backend/item/insertTbItem", // 增加商品接口
    deleteProduct: "/api/backend/item/deleteItemById", // 删除商品接口
    batchDelete: "/api/batchDelete", // 批量删除
    updateProduct: "/api/backend/item/updateTbItem", // 编辑--修改商品
    getParams: "/api/backend/itemParam/selectItemParamAll", // 规格参数列表
    addRulesParams: "/api/backend/itemParam/insertItemParam", // 规格参数配置 添加
    deleteRulesParams: "/api/params/delete", // 规格参数配置 删除
    updateParams: "/api/update/category", // 规格参数配置 修改
    searchParams: "/api/params/search", // 规格参数配置 模糊查询
    getCategoryParams: '/api/category/data', // 规格参数类目结构数据获取 cid
    getAdvertList: "/api/content/selectContentCategoryByParentId",// 获取广告分类内容
    addAdvertChild: "/api/content/insertContentCategory", // 增加子广告分类
    updateAdvertChild: "/api/content/updateContentCategory", // 修改子广告分类
    deleteAdvertChild: "/api/content/deleteContentCategoryById", // 删除子广告分类
    searchAdvert: "/api/content/selectTbContentAllByCategoryId",// 内容分类管理 内容查询
    insertTbContent: "/api/content/insertTbContent", // 增加广告内容
    deleteTbContent: "/api/content/deleteContentByIds", // 删除广告内容
}

export default base