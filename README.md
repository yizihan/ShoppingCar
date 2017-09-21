# ShoppingCar

# 涵记

标签（空格分隔）： JS汇总

---
[TOC]

### 2017-09-15
#### 函数this指向
JS中的this可以是全局对象、当前对象或任意对象，这完全取决于函数的调用方式。

 - 作为对象的方法调用
 - 作为函数调用
 - 作为构造函数调用（new）
 - 使用call或apply调用

![this决策树][1]

```
function func (x) {
    this.x = x;
};
func(5);    // this是全局对象window
```
> 一个函数被执行时，会创建一个执行环境（ExecutionContext），函数的所有的行为均发生在此执行环境中，构建该执行环境时，JavaScript 首先会创建 arguments变量，其中包含调用函数时传入的参数。

> 接下来创建作用域链。然后初始化变量，首先初始化函数的形参表，值为 arguments变量中对应的值，如果 arguments变量中没有对应值，则该形参初始化为 undefined。

> 如果该函数中含有内部函数，则初始化这些内部函数。如果没有，继续初始化该函数内定义的局部变量，需要注意的是此时这些变量初始化为 undefined，其赋值操作在执行环境（ExecutionContext）创建成功后，函数执行时才会执行。

> 最后为 this变量赋值，如前所述，会根据函数调用方式的不同，赋给 this全局对象，当前对象等。至此函数的执行环境（ExecutionContext）创建成功，函数开始逐行执行，所需变量均从之前构建好的执行环境（ExecutionContext）中读取。

参考：[图解this指向][2]

---

#### 箭头函数

本质上说 `Arrow Function` 并没有自己的 `this`，他的`this`是派生而来的，根据“词法作用域”派生而来。

**词法作用域**
一个变量的作用在定义的时候就已经被定义好了，当在本作用域中找不到变量，就会一直向父作用域中查找，直到找到为止。

```
function taskA() {
  this.name = 'hello'
  var obj = {
    name: 'haha'
  }

  var fn = function() {
    console.log(this)
    console.log(this.name)
  }

  var arrow_fn = () => {
    console.log(this)
    console.log(this.name)
  }
  fn()                      // fn()函数是自运行的，this指向window
  obj.fn()                  // 函数由对象调用的，this指向obj
  arrow_fn()                // arrow_fn()本身没有this，于是向上查找this，发现taskA是有this的，于是继承了taskA的作用域
}
taskA()
```

参考：[箭头函数中的this指向][3]

---

#### 展开运算符 Spread operator
> 允许一个表达式在期望多个参数（用于函数调用）或多个元素（用于数组字面量）或多个变量（用于解构赋值）的位置扩展。

```
// 解构赋值
const [...abc] = [1, 2, 3];
abc                     // [1, 2, 3]

// 函数传参
const abccc = function (a, b, ...c) {
    console.log(a);     // 1
    console.log(b);     // 2
    console.log(c);     // [3, 4, 5]
}
abccc(1, 2, 3, 4, 5);

// 深拷贝
var arr1 = [1, 2, 2, 3];
var arr2 = [...arr1];       // [1, 2, 2, 3]

// 数组去重
var arr3 = [3, 3, 4];
var arr4 = [...(new Set(arr3))]
```

参考：[MDN-Spread_operator][4]

---

### 2017-09-16
#### Vue双向绑定
MV*
M：Model（数据）当后台数据有变更时，会再次渲染并更新视图；
V：View（视图）通过用户的交互，产生状态，将视图对数据的更新同步到后台数据。

Vue采用ES5提供的 `Object.defineProperty()`，监听对数据的操作，从而自动触发数据同步。
> Ojbect.defineProperty() 会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

数据与视图的绑定与同步，最终体现在对数据的读写处理，也就是 `Object.defineProperty()` 定义的数据set、get函数中。

Watcher 会获取新的数据发送给视图

通过在HTML中添加指令的方式，将视图元素与数据的绑定关系进行声明。
```
<form id="test">
  <input type="text" v-model="name">
</form>
```
```
var vm = new Vue({
  el: '#test',
  data: {
    name: 'luobo'
  }
})
```

初始化过程

 - compile：对于给定的元素进行解析，识别出所有绑定在元素上的指令。
 - link：建立这些指令与对应数据的绑定关系，并以数据的初始值进行渲染。绑定关系建立后，就可以进行双向数据同步。

文档初始化，compile找到所有的指令v-model，link建立指令与数据的联系，通过get将数据的初始值给View，通过set将更新的数据给Model；通过Object.defineProperty()的set-get进行数据的双向同步。

参考：[Vue 双向数据绑定原理分析][5]

---

#### Object.defineProperty()
> 会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

对象里面目前存在属性描述符有两种：

 - 数据描述符：一个拥有可写或不可写的值得属性
 - 存取描述符：由一对getter-setter函数功能来描述的属性

```
var o = {};

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(o, "a", {
    value: 37,              // 设置value值，default undefined
    writable: true,         // 可写，default false
    enumerable: true,       // 可枚举，default false
    configurable: true      // 可删除，default false
});

var variable;
// 在对象中添加一个属性与存取描述符的示例
Object.defineProperty(o, "b", {     // 绑定外面的变量
    get: function() {               // 取值
        retutn variable;
    },
    set: function(newVariable) {    // 存值
        variable = newVarable;
    },
    enumerable: true,
    configuable: true
});
// 现在o.b的值总是与variable相同！
```

参考：[MDN-defineProperty][6]

---

#### vue v-for :key
```
value in arr
(value, index) in arr

value in obj
(value, key, index) in obj
```
key主要用在虚拟DOM的算法，在新旧nodes对比时辨别VNodes。
它会基于key的变化重新排列元素顺序，并移除key不存在的元素。

为了给Vue一个提示，以便它能追踪每个节点的身份，从而重用和重新排序现有元素，所以需要为每项提供一个唯一的key属性。

 ![此处输入图片的描述][7]

虚拟DOM的Diff算法

 - 两个相同的组件产生类似的DOM结构，不同的组件产生不同的DOM结构
 - 同一层级的一组节点，他们可以通过唯一的id进行区分

当数据发生变化时，Diff算法只会比较同一级别的节点：

 - 如果节点类型不同，直接干掉前面的节点，再创建并插入新的节点，不会在比较这个节点的子节点了。
 - 如果节点类型相同，则会重新设置该节点的属性，从而实现节点的更新。



参考：[知乎][8]

---

### 2017-09-21
#### Vue 添加属性
```
methods: {
    selectedProduct: function(item) {
        if (typeof item.checked == 'undefined') {
            this.$set(item, "checked", true);   // 添加属性及值
        } else {
            item.checked = !item.checked;
        }
    }
}
```
---

#### Vue 删除列表元素
```
methods: {
    delConfirm: function (item) {
        this.currentProduct = item;     // 确认选中的列表
    },
    delProduct: function () {
        var index = this.productList.indexOf(this.currentProduct);  // 选中的列表的index
        this.productList.splice(index, 1);      // 删除选中的列表项
    }
}
```

---

#### Vue tab切换
```
<li v-for="(item, index) in lists"
    // 循环列表
    :class="{'checked': index==currentIndex}"
    // 判断当前index是否为选中状态
    @click="currentIndex=index">
    // 设置点击的index列表为currentIndex，即选中列表
</li>
```
---

#### Vue列表数量控制
```
data: {
    addressList: [],    // 列表总数
    limitNum: 3         // 设置显示列表数量
}
computed:{
    filterAddress: function () {
        return this.addressList.slice(0, limitNum);
        // 返回一个新的数组，不会一次性加载过多
    }
}
```
```
<li v-for="(item, index) in filterAddress"></li>
<a @click="limitNum++">More</a>
```

参考：[慕课网][9]


  [1]: http://images2015.cnblogs.com/blog/76497/201510/76497-20151029094513044-212473139.jpg
  [2]: http://www.cnblogs.com/isaboy/archive/2015/10/29/javascript_this.html
  [3]: https://github.com/zhengweikeng/blog/blob/master/posts/2016/%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%E4%B8%ADthis%E7%9A%84%E7%94%A8%E6%B3%95.md
  [4]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator
  [5]: http://www.jianshu.com/p/d3a15a1f94a0
  [6]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  [7]: https://calendar.perfplanet.com/wp-content/uploads/2013/12/vjeux/2.png
  [8]: https://www.zhihu.com/question/61064119/answer/183717717
  [9]: http://www.imooc.com/learn/796

Learning From [Imooc](http://www.imooc.com/learn/796)
