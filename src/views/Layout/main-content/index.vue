<template>
  <div class="content">
      <TopHeader/>
      <Content/>
  </div>
</template>

<script>
import Content from './content.vue'
import TopHeader from './top-header.vue'
export default {
    components:{
        Content,
        TopHeader
    }
}
</script>

<style lang='scss' scoped>
.content{
    flex: 1;
}
</style>