<!-- 如果编辑器不能针对.vue生成对应的模板的情况下，该文件可供外部复用-->
<!-- 根据需要做修改，并且把不需要用到的函数注释删除 -->
<!-- vue2.x的更多详情可参照 https://vuefe.cn/v2/guide/ -->

<template>

</template>

<script>
export default {
    // 组件的名称
    name: 'tpl',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
        return {}
    },

    // 组件
    components: {},

    // 注意，不应该使用箭头函数来定义 methods函数 或者  computed函数 (例如 aDouble: () => this.a * 2)。
    // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined

    // 方法
    methods: {},

    // 计算属性
    computed: {},

    // 监听
    watch: {

        // 监听路由变化
        '$route' (to, from) {}
    },

    // 常用钩子函数，总共有8个，可以参照vue的生命周期看

    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created() {},

    // 完成挂载，相当于dom ready
    mounted() {},

    // 销毁，可以做一些定时器的销毁,缓存的清除等操作
    destroyed() {}
}
</script>

<style lang="scss" scoped='scoped'>

</style>
