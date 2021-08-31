import store from '../store'
//刷新获取本地的存储
let userinfo = localStorage.getItem('userinfo');

if(userinfo){
  let obj = JSON.parse(userinfo);
  store.commit('loginModule/setUser',obj);
}
