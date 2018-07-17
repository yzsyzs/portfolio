<!-- 如果编辑器不能针对.vue生成对应的模板的情况下，该文件可供外部复用-->
<!-- 根据需要做修改，并且把不需要用到的函数注释删除 -->
<!-- vue2.x的更多详情可参照 https://vuefe.cn/v2/guide/ -->

<template>
  <div class="portfolio">
    <div class="portfolio-head">
      开市 <i class="el-icon-more" style="padding:0 20px;"></i>
    </div>
    <div class="portfolio-section">
        <div class="section-left-title">
          <h4>投资组合</h4>
          <i class="el-icon-close" style="font-size: 30px;"></i>
        </div>
        <div class="section-left-tab">
          <div class="tab-left">
            <div>
              <h5>总资产</h5>
              <p>8668686.00</p>
            </div>
            <div>
              <h5>现金结余</h5>
              <p>2342.00</p>
            </div>
            <div>
              <h5>可用现金 / 冻结现金</h5>
              <p>3344.00/2424.00</p>
            </div>
          </div>
          <div class="tab-right">
            <el-button type="info">刷新</el-button>
            <el-button type="info">买入</el-button>
            <el-button type="info">卖出</el-button>
          </div>
        </div>
        <div class="section-left-list">
          <div class="list-top">
            <div v-for="(item, index) in list" :key="index">{{item.name}}</div>
          </div>
          <ul class="list-main">
            <li>
              <div>
                <div>
                  <p>长河</p>
                  <p>1</p>
                </div>
                <i :class="[true?'el-icon-arrow-down':'el-icon-arrow-up']"></i>
              </div>
              <div>
                <p>232</p>
                <p>43543</p>
              </div>
              <div>
                343434
              </div>
              <div>
                <p>2234</p>
                <p>3232%</p>
              </div>
              <div>
                3498439483
              </div>
              <div>
                2323
              </div>
              <div>
                <p>2323</p>
                <p>3243</p>
              </div>
              <div>
                <img src="#" alt="">
                <h4>买入中</h4>
              </div>
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  // 组件的名称
  name: 'portfolio',

  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},

  // 数据绑定
  data () {
    return {
      isTrue: false,
      list: [
        { id: '1', name: '股票' },
        { id: '2', name: '持股数量 / 可交易数' },
        { id: '3', name: '平均成本价' },
        { id: '4', name: '当前价' },
        { id: '5', name: '市值' },
        { id: '6', name: '交易佣金' },
        { id: '7', name: '盈利' },
        { id: '8', name: '状态' }
      ],
      data: []
    }
  },

  // 组件
  components: {},

  // 注意，不应该使用箭头函数来定义 methods函数 或者  computed函数 (例如 aDouble: () => this.a * 2)。
  // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined

  // 方法
  methods: {
    // gotoPush () {
    //   if (this.isTrue) {
    //     this.$refs.sectionRight.style.marginLeft = '50%'
    //     this.$refs.sectionLeft.style.width = '50%'
    //     this.isTrue = false
    //   } else {
    //     this.$refs.sectionRight.style.marginLeft = '90%'
    //     this.$refs.sectionLeft.style.width = '90%'
    //     this.isTrue = true
    //   }
    // }
  },

  // 计算属性
  computed: {},

  // 监听
  watch: {
    // 监听路由变化
    '$route' (to, from) { }
  },

  // 常用钩子函数，总共有8个，可以参照vue的生命周期看

  // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  created () { },

  // 完成挂载，相当于dom ready
  mounted () { },

  // 销毁，可以做一些定时器的销毁,缓存的清除等操作
  destroyed () { }
}
</script>

<style lang="scss" scoped='scoped'>
.portfolio {
  background: #000;
  min-width: 1200px;
  .portfolio-head {
    height: 40px;
    line-height: 40px;
    background: #1a1a1a;
    text-align: right;
    color: #fff;
  }
  .portfolio-section {
    color: #fff;
    height: 500px;
    background: #3e4949;
    padding: 10px;
    .section-left-title {
      display: flex;
      height: 40px;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    }
    .section-left-tab {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #1a1a1a;
      padding: 5px;
      .tab-left {
        flex: 0 0 800px;
        display: flex;
        text-align: left;
        div {
          flex: 1;
          h5 {
            margin-bottom: 5px;
            color: #39fffa;
          }
        }
      }
      .tab-right {
        flex: 1;
        text-align: right;
      }
    }
    .section-left-list {
      .list-top {
        display: flex;
        border-bottom: 1px solid #999;
        padding: 0 10px;
        div:nth-child(1) {
          flex: 0 0 15%;
          text-align: left;
        }
        div:nth-child(2) {
          flex: 0 0 10%;
        }
        div {
          flex: 1;
          height: 40px;
          line-height: 40px;
          text-align: right;
        }
        div:last-child {
          flex: 0 0 30%;
          text-align: left;
          padding-left: 8%;
        }
      }
      .list-main {
        background: #1a1a1a;
        li {
          display: flex;
          border-bottom: 1px solid #333;
          div:nth-child(1) {
            flex: 0 0 15%;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
              display: flex;
              flex-direction: column;
            }
          }
          div:nth-child(2) {
            flex: 0 0 10%;
          }
          div {
            flex: 1;
            height: 60px;
            text-align: right;
            line-height: 30px;
          }
          div:nth-child(3),div:nth-child(5),div:nth-child(6) {
            line-height: 60px;
          }
          div:last-child {
            flex: 0 0 30%;
            text-align: left;
            padding-left: 8%;
            display: flex;
            // justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
