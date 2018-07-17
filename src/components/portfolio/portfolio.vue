<!-- 如果编辑器不能针对.vue生成对应的模板的情况下，该文件可供外部复用-->
<!-- 根据需要做修改，并且把不需要用到的函数注释删除 -->
<!-- vue2.x的更多详情可参照 https://vuefe.cn/v2/guide/ -->

<template>
  <div class="portfolio">
    <div class="portfolio-head">
      开市 <i class="el-icon-more" style="padding:0 20px;"></i>
    </div>
    <div class="portfolio-section" v-show="portfolioSection">
        <div class="section-left-title">
          <h4>投资组合</h4>
          <i class="el-icon-close" @click="closeClick" style="font-size: 30px;"></i>
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
            <button type="button" @click="refreshClick">刷新</button>
            <button type="button" @click="buyClick">买入</button>
            <button type="button">卖出</button>
          </div>
        </div>
        <div class="section-left-list">
          <div class="list-top">
            <div v-for="(item, index) in list" :key="index">{{item.name}}</div>
          </div>
          <ul class="list-main">
            <li v-for="(item, index) in items" :key="index" @click="listClick(item, index)" :class="{activeBg:index===currentIndex}">
              <div>
                <div>
                  <div>
                    <h5>{{item.Market}}</h5>
                    <h5>{{item.Symbol}}</h5>
                  </div>
                  <i :class="[item.Invalid?'el-icon-arrow-up':'el-icon-arrow-down']" style="font-size: 20px;" @click="iconClick(item)"></i>
                </div>
                <div>
                  <h5>{{item.Volume.toFixed(2)}}</h5>
                  <h5>{{item.SellableVolume.toFixed(2)}}</h5>
                </div>
                <div>
                  {{item.AverageCost.toFixed(2)}}
                </div>
                <div>
                  <h5>{{item.CurrentPrice.toFixed(2)}}</h5>
                  <h5 :class="[item.ChangePercentage>0?'green':item.ChangePercentage===0?'':'red']">{{item.ChangePercentage===0?0:(item.ChangePercentage*100).toFixed(3)}}%</h5>
                </div>
                <div>
                  {{item.MarketValue.toFixed(2)}}
                </div>
                <div>
                  {{item.Charge.toFixed(2)}}
                </div>
                <div>
                  <h5 :class="[item.Profit<0?'red':'']">{{item.Profit.toFixed(2)}}</h5>
                  <h5 :class="[item.TempProfitPercentage>0?'green':item.TempProfitPercentage===0?'':'red']">{{item.TempProfitPercentage===0?0:(item.TempProfitPercentage*100).toFixed(3)}}%</h5>
                </div>
                <div>
                  <img src="#" :class="icon(item.Status)" alt="">
                  <h4>{{item.Status | gameStatus}}</h4>
                </div>
              </div>
              <ul class="li-position" v-show="item.Invalid">
                <li>
                  <a>手动买入中</a>
                </li>
                <li>
                  <a>指令数量: 2000</a>
                </li>
                <li>
                  <a>价格: 34.43</a>
                </li>
                <li>
                  <a>剩余有效天数: 1</a>
                </li>
                <li>
                  <a>2017-4-2</a>
                </li>
                <li>
                  <a @click.stop="item.Invalid=!item.Invalid">撤销</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <el-dialog
          title="提示"
          :visible.sync="visible"
          width="30%"
          center>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="当前股价">
              <el-input v-model="form.price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="限价交易">
              <el-input v-model="form.limitPrice">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="有效天数">
              <el-input v-model="form.dayCount" :disabled="true">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
const opkey = 'f497ba51-c0c7-443f-94e7-ca6d736ff89e'
const accountId = '4f6f1d13-3cc8-440e-a19f-ad18458875fd'
export default {
  // 组件的名称
  name: 'portfolio',

  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},

  // 数据绑定
  data () {
    return {
      // 控制投资组合主体内容是否显示
      portfolioSection: true,
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
      items: [],
      currentIndex: -1,
      // itemObj: {},
      // dialog 对话框的显示
      visible: false,
      form: {
        price: 0,
        limitPrice: 0,
        dayCount: 1
      }
    }
  },

  // 组件
  components: {},

  // 注意，不应该使用箭头函数来定义 methods函数 或者  computed函数 (例如 aDouble: () => this.a * 2)。
  // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined

  // 方法
  methods: {
    // 获取数据的方法
    _getAccountPortfolioInfos () {
      let params = {
        opkey: opkey,
        accountId: accountId
      }
      api.getAccountPortfolioInfos(params).then((res) => {
        console.log(res.data)
        this.items = res.data.Items
      })
    },
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
    // 确定状态图标的 方法
    icon (val) {
      return val === 'TRADEIN' ? 'icon-buy' : val === 'TRADEOUT' ? 'icon-buysell' : 'icon-sell'
    },
    // 点击上下图标的方法
    iconClick (val) {
      val.Invalid = !val.Invalid
    },
    // 点击列表每一行的 方法
    listClick (val, index) {
      this.currentIndex = index
    },
    // 关闭整个 投资组合的方法
    closeClick () {
      this.$confirm('确定关闭投资组合界面吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.portfolioSection = false
        this.$message({
          type: 'success',
          message: '关闭成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 买入 按钮指令的 方法
    buyClick () {
      if (this.currentIndex === -1) {
        this.$message({
          type: 'warning',
          message: '请选择一支股票!'
        })
      } else {
        this.visible = true
      }
    },
    // 买入指令后，提交指令的方法
    onSubmit () {
      alert(3)
    },
    // 手动刷新列表的方法
    refreshClick () {
      alert('刷新')
    }
  },

  // 计算属性
  computed: {
  },

  // 监听
  watch: {
    // 监听路由变化
    '$route' (to, from) { },
    currentIndex (val, oldVal) {
      if (val !== oldVal) {
      }
    }
  },

  // 常用钩子函数，总共有8个，可以参照vue的生命周期看

  // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  created () {
    // 获取数据的方法
    this._getAccountPortfolioInfos()
  },

  // 完成挂载，相当于dom ready
  mounted () {
  },

  // 销毁，可以做一些定时器的销毁,缓存的清除等操作
  destroyed () { }
}
</script>

<style lang="scss" scoped='scoped'>
.activeBg {
  background: #15364c;
}
.icon-buy {
  background: url("../../assets/images/icon-buy.png") no-repeat center center;
}
.icon-buysell {
  background: url("../../assets/images/icon-buysell.png") no-repeat center
    center;
}
.icon-sell {
  background: url("../../assets/images/icon-sell.png") no-repeat center center;
}
.red {
  color: #ed1c24;
}
.green {
  color: #26ff00;
}
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
    height: 100%;
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
        button {
          width: 80px;
          height: 26px;
          background: #506872;
          border-radius: 3px;
          &:hover {
            cursor: pointer;
            background: #235c5c;
          }
        }
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
          // display: flex;
          border-bottom: 1px solid #333;
          // padding: 10px 0;
          // position: relative;
          .li-position {
            // position: absolute;
            // left: 0;
            // top: 60px;
            text-align: left;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background: #00113f;
            li:nth-child(1) {
              flex: 0 0 20%;
            }
            li {
              flex: 1;
              padding: 10px;
            }
            li:last-child {
              a {
                display: inline-block;
                text-align: center;
                width: 80px;
                height: 26px;
                line-height: 26px;
                background: #00755f;
                border-radius: 3px;
                &:hover {
                  cursor: pointer;
                  background: #219696;
                }
              }
            }
          }
          div {
            display: flex;
            // border-bottom: 1px solid #333;
            padding: 2px 0;
            width: 100%;
            // position: relative;
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
              i {
                &:hover {
                  cursor: pointer;
                }
              }
            }
            div:nth-child(2) {
              flex: 0 0 10%;
            }
            div {
              flex: 1;
              // height: 50px;
              text-align: right;
              h5 {
                font-size: 16px;
                font-weight: normal;
              }
              // line-height: 25px;
              h5:nth-child(1) {
                margin-bottom: 2px;
              }
            }
            div:nth-child(2),
            div:nth-child(4),
            div:nth-child(7) {
              display: flex;
              flex-direction: column;
            }
            div:nth-child(3),
            div:nth-child(5),
            div:nth-child(6) {
              display: flex;
              justify-content: flex-end;
              align-items: center;
            }
            div:nth-child(8) {
              flex: 0 0 30%;
              text-align: left;
              padding-left: 8%;
              display: flex;
              // justify-content: center;
              align-items: center;
              img {
                display: inline-block;
                width: 20px;
                height: 20px;
                padding-right: 30px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
