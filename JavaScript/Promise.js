import { promises } from "fs";

/** 
 * 1.Promise 声明
 * 首先呢，Promise肯定是一个类，我们从class来声明
 * 由于new Promise((resolve, reject) => {}), 所以传入一个参数（函数）， executor,传入就执行
 * executor里面有两个参数，一个resolve(成功)，一个叫reject(失败) 
 * 由于resolve和reject可执行，所有都是函数，我们用let声明
 */
class Promise {
  // 构造器
  constructor(executor) {
    // 成功
    let resolve = () => {};
    // 失败
    let reject = () => {};
    // 立即执行
    executor(resolve, reject); 
  }
}

/** 
 * 解决基本状态
 * Promise A+ 规定
 * Promise存在三个状态(state) pending,fulfilled, rejected
 * pending(等待态)为初始态，并可以转化为fulfilled(成功态)和rejected（失败态）
 * fulfilled 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
 * rejected 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
 * 若是executor函数报错，直接执行reject()
 */
class Promise {
  constructor(executor) {
    // 初始化state为等待态
    this.state = 'pending'
    // 成功的值
    this.value = undefined
    // 失败的原因
    this.reason = undefined

    this.resolve = value => {
      // state改变，resolve调用就会失败
      if (this.state === 'pending') {
        // resolve调用后，state转化为成功态
        this.state = 'fulfilled'
        // 储存成功的值
        this.value = value
      }
    }

    this.reject = reason => {
      // state改变，reject调用就会失败
      if (this.state === 'pending') {
        // reject调用后，state转化为失败态
        this.state = 'rejected'
        // 储存失败的原因
        this.reason = reason
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
}

/**
 * then 方法
 * Promise A+规定：Promise有一个叫做then的方法，里面有一两个参数 onFulfilled,onRejected  成功有成功的值，失败有失败的原因
 * 当状态state为fulfilled，则执行onFulfilled，传入this.value。当状态state为rejected,则执行onRejected，传入this.reason
 * onFulfilled, onRejected如果他们是函数，则必须分别在fulfilled, rejected后被调用，value或reason依次作为他们的第一个参数
 */
class Promise {
  constructor() {}
  // then 方法有两个参数onFulfilled onRejected
  then (onFulfilled, onRejected) {
    // 状态为fulfilled, 执行onFulfilled，传入成功的值
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
  }
}

/**
 * 解决异步实现
 * 现在基本可以实现简单的同步代码，但是当resolve在setTimeout内执行then时，state还是pending等待状态，我们就需要在thenm调用的时候，
 * 将成功和失败存到各自的数组中，一但reject或者resolve,就调用它们
 * 类似于发布订阅，先将then里面的两个函数储存起来，由于一个promise可以有多个then，所以存在同一个数组内
 */
// 多个then的情况
let p = new promises()
p.then()
p.then()

// 成功或者失败时，forEach调用它们
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    // 成功存放的数组
    this.onResolvedCallbacks = []
    // 失败存放的数组
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    // 当状态state为pending
    if (this.state === 'pending') {
      // onFulfilled传入到成功数组
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      // onRejected传入到失败数组
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

/**
 * 解决链式调用
 * 我们常常用到new Promise().then().then(), 这就是链式调用，用来解决回调地狱
 * 由于Promise中转态不可以改变，所以要实现链式调用，那么then方法执行后的返回值必须是一个新实例
 * 
 * Promise的链式调用（分两种情况讨论）
 * promise的then方法之后会继续返回一个promise对象
 */

 // 例子如下
let test = new Promise((resolve, reject) => {
  let random = Math.random()
  if (random > 0.5) {
    resolve('大于0.5')
  } else {
    reject('小于等于0.5')
  }
})

let p = test.then(result => {
  console.log(result)
  return result
}).catch(err => {
  console.log(result)
  return err
}).then(result => {
  console.log(result)
  return result
}).then(result => {
  console.log('last', result)
})

/**
 * Promise的resolve, reject, all, race方法实现
 */
// resolve方法
Promise.resolve = function(val) {
  return new Promise((resolve, reject) => {
    resolve(val)
  })
}
// reject方法
Promise.reject = function(val) {
  return new Promise((resolve, reject) => {
    reject(val)
  })
}

// race方法
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}

// all方法（获取所有的promise, 都执行then，把结束放到数组，一起返回）
Promise.all = function(promises) {
  let arr = []
  let i = 0
  function processData(index, data) {
    arr[index] = data
    i++
    if (i === promises.length) {
      resolve(arr)
    }
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(data => {
        processData[i].then(data => {
          processData(data);
        }, reject)
      })
    }
  })
}