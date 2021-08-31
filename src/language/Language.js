import Vue from 'vue';
import Element from 'element-ui';
import VueI18n from 'vue-i18n';
//引入自定义语言环境
import enLocale from './enLocale';
import zhLocale from './zhLocale';
//引入element里面的语言包
import eleENLocale from 'element-ui/lib/locale/lang/en'; //语言包 最后'/'后单词为语言种类
import eleZHLocale from 'element-ui/lib/locale/lang/zh-CN';

Vue.use(VueI18n)

//准备语法环境
const messages = {
    en: { //英语 导入语言包也是对象 需要...展开处理
       ...enLocale,
       ...eleENLocale
    },
    zh: { //汉语
        ...zhLocale,
        ...eleZHLocale
    }
}


// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
    locale: localStorage.getItem('lang')||'zh', // 设置地区
    messages, // 设置地区信息
})

/**
 *  // 支持 vue-i18n@6.x 版本
        Vue.use(Element, {
            i18n: (key, value) => i18n.t(key, value)
        })
*/

//配置element支持vuei18n@8.x版本  
Element.i18n((key, value) => i18n.t(key, value))

export default i18n;