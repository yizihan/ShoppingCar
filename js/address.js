new Vue({
  el: '.container',
  data: {
    limitNum: 3,
    addressList: [],
    currentIndex: 0,
    shippingMethod: 1
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getAddressList()
    });
  },
  computed: {
    filterAddress: function() {
      return this.addressList.slice(0, this.limitNum);
    }
  },
  methods: {
    getAddressList: function() {
      this.$http.get("data/address.json").then(response => {
        var res = response.data;
        if (res.status == "0") {
          this.addressList = res.result;
        }
      })
    },
    loadMore: function() {
      this.limitNum = this.addressList.length;
    },
    setDefault: function(addressId) {
      // 遍历整个数组
      this.addressList.forEach(function(address, index) {
        // 判断当前列表addressId是否为选中item
        if (address.addressId === addressId) {
          address.isDefault = true;
        } else {
          address.isDefault = false;
        }
      })
    }
  }
});