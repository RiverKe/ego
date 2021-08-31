/***
 * 请求的方法
 */
import base from './config';
import axios, { get, post } from '../utils/request';

const api = {
    /**
     * 登录请求 username password
     */
    getLogin(params) {
        // return axios.post(base.login,params)
        return post(base.login, params)
    },
    /**
     * 注册接口
     */
    getRegister(params) {
        return post(base.register, params)
    },


    /**
     * 商品列表接口 projectList {page:1}
     */
    getProductList(params) {//{page:xx}
        return get(base.projectList, params)
    },

    /**
     * 搜索接口 {search:xx}
     */
    getSearch(params) {
        return axios.get(base.search, {
            params
        })
    },


    /**
     * 选择类目  id
     */
    selectCategory(params) {//{id:cid}
        return get(base.selectCategory, params)
    },
    /**
     * 选择类目  id
     */
    selectCategory(params) {//{id:cid}
        return get(base.selectCategory, params)
    },


    /**
     * 增加商品列表数据
     * 参数： title cid  category sellPoint price num desc paramsInfo image
     */
    getAddProduct(params) {//{}
        return get(base.addProduct, params)
    },
    /**
     * 删除商品 {id:''}
     */
    deleteProduct(params) {
        return get(base.deleteProduct, params)
    },
    /**
     * 批量删除商品 {id:['', '', '', '']}
     */
    batchDelete(params) {
        return get(base.batchDelete, params)
    },
    /**
     * 编辑--修改商品
     * title, sellPoint, price, cid,category,num, desc, paramsInfo,image, id
     */
    updateProduct(params) {
        return get(base.updateProduct, params)
    },
    /**
     * 规格参数列表
     */
    getParams(params) {
        return get(base.getParams, params)
    },
    /**
     * 增加 规格参数配置
     * itemCatId,content,specsName
     */
    addRulesParams(params) {
        return get(base.addRulesParams, params)
    },
    /**
     * 删除 规格参数配置
     * itemCatId,content,specsName
     */
    deleteRulesParams(params) {
        return get(base.deleteRulesParams, params)
    },
    /**
     * 编辑修改 规格参数配置
     * itemCatId,content,specsName
     */
    updateParams(params) {
        return get(base.updateParams, params)
    },
    /**
     * 模糊查询 规格参数配置
     * itemCatId, content, specsName
     */
    searchParams(params) {
        return get(base.searchParams, params)
    },
    /**
     * goods页面回传规格参数  类目结构数据获取 cid
     * itemCatId,content,specsName
     */
    getCategoryParams(params) {
        return get(base.getCategoryParams, params)
    },
    /**
     * 广告分类 id
     */
    getAdvertList(params) {
        return get(base.getAdvertList, params)
    },
    /**
     * 增 -- 广告分类 id
     */
    addAdvertChild(params) {
        return get(base.addAdvertChild, params)
    },
    /**
     * 删 -- 广告分类 id
     */
    deleteAdvertChild(params) {
        return get(base.deleteAdvertChild, params)
    },
    /**
     * 改 -- 广告分类 id
     */
    updateAdvertChild(params) {
        return get(base.updateAdvertChild, params)
    },
    /**
     * 查 -- 广告分类 id
     */
    searchAdvert(params) {
        return get(base.searchAdvert, params)
    },
    /**
     * 增加广告内容
     * pid
     */
    insertTbContent(params) {
        return get(base.insertTbContent, params)
    },
    /**
     * 删除广告内容
     * pid
     */
    deleteTbContent(params) {
        return get(base.deleteTbContent, params)
    }

}

export default api