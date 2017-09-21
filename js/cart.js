var vm = new Vue({
  el: '#app',
  data: {
    productList: [],
    totalMoney: 0,
    checkAllFlag: false,
    delFlag: false,
    currentProduct: ''
  },
  filters: {
    formatMoney: function(value) {
      return "￥ " + value.toFixed(2);
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.cartView();
    })
  },
  methods: {
    cartView: function() {
      this.$http.get("data/cartData.json", { "id": 123 }).then(res => {
        this.productList = res.data.result.list;
      })
    },
    changeMoney: function(product, way) {
      if (way > 0) {
        product.productQuantity++;
      } else {
        product.productQuantity--;
        if (product.productQuantity < 1) {
          return product.productQuantity = 1;
        }
      }
      this.calcTotalMoney();
    },
    selectedProduct: function(item) {
      if (typeof item.checked == 'undefined') {
        this.$set(item, "checked", true)
      } else {
        item.checked = !item.checked;
      }
      this.calcTotalMoney();
    },
    checkAll: function(flag) {
      this.checkAllFlag = flag;
      this.productList.forEach(item => {
        if (typeof item.checked == 'undefined') {
          this.$set(item, "checked", this.checkAllFlag)
        } else {
          item.checked = this.checkAllFlag;
        }
      })
      this.calcTotalMoney();
    },
    calcTotalMoney: function() {
      this.totalMoney = 0;
      this.productList.forEach(item => {
        if (item.checked) {
          this.totalMoney += item.productPrice * item.productQuantity;
        }
      });
    },
    delConfirm: function(item) {
      this.delFlag = true;
      this.currentProduct = item;
    },
    delProduct: function() {
      var index = this.productList.indexOf(this.currentProduct);
      this.productList.splice(index, 1);
      this.delFlag = false;
    }
  }
});
Vue.filter("money", function(value, type) {
  return "￥ " + value.toFixed(2) + type;
})