<template>
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      @node-click="handleNodeClick"
    >
    </el-tree>
</template>

<script>
export default {
    data() {
        return {
            selectednode: '',
            props: {
                label: "name",
                children: "zones",
                isLeaf: "leaf",
            },            
        };
    },
    methods: {
        //获取点击的node的界面的数据--发送给弹框
        handleNodeClick(data) {
            console.log('点击--------', data.name);
            this.selectednode = data.name;
            //把点击的tree的数据 传递给父组件弹框组件
            this.$emit('getTreeData',data)
        },
        // tree懒加载
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.$api.selectCategory().then(res => {
                    console.log('tree：', res);
                    if(res.status === 200){
                        return resolve(res.result);
                    }
                });
                // return resolve([{ name: "region" }]);
            }else{
                this.$api.selectCategory({
                    id: node.data.cid,
                }).then(res => {
                    console.log('二级tree：', res);
                    if(res.status === 200) {
                        return resolve(res.result);
                    } else{
                        return resolve([]); //return终止懒加载
                    }
                })
            }

        },
    },
};
</script>

<style>
</style>