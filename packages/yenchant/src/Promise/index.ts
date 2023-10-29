// 先定义三个常量表示状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  // 存一下this,以便resolve和reject里面访问
  const that = this;

  that.status = PENDING; // 初始状态为pending
  that.value = null; // 初始化value
  that.reason = null; // 初始化reason

  // 构造函数里面添加两个数组存储成功和失败的回调
  that.onFulfilledCallbacks = [];
  that.onRejectedCallbacks = [];

  // 注意：resolve 并不会立即把值返回出去，而是先将值保存，最后会给 .then(onFulfilled) 的 onFulfilled(value)
  function resolve(value) {
    if (that.status === PENDING) {
      that.status = FULFILLED;
      that.value = value;

      // 这步只处理异步任务，即：resolve 不是同步的，而是在异步任务之后执行的
      that.onFulfilledCallbacks.forEach((callback) => {
        callback(that.value);
      });
    }
  }

  // reject方法参数是reason
  function reject(reason) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.reason = reason;

      // resolve里面将所有失败的回调拿出来执行
      that.onRejectedCallbacks.forEach((callback) => {
        callback(that.reason);
      });
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// x: 可能是 thenable 或一个普通值
// 当 .then() 返回 thenable 或普通值时，这个 x 就是对应的值。
function resolvePromise(selfPromise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，reject()
  // 防止死循环
  if (selfPromise === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }

  // 说明可能是 thenable, 即：定义了 then 的对象或函数 -> { then: callback }, 或者说是 MyPromise 的实例
  if (typeof x === "object" || typeof x === "function") {
    // 这个坑是跑测试的时候发现的，如果 x 是 null，应该直接 resolve
    if (x === null) {
      return resolve(x);
    }

    let then;

    try {
      // 把 x.then 赋值给 then，为什么？x.then(resolve,reject) 这样会有问题
      // 访问 x.then 时，相当于访问 x 的 then getter，比如：Object.defineProperty(a, 'then', {get() { // do something  }} )
      // 这样此代码就被侵入了，即：访问 then 时，就会执行其它代码。
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(error);
    }

    if (typeof then === "function") {
      let called = false;
      // 由于取出了 x.then, 所以调用 then 时，为了保证 then 的作用于依然是 this, 使用 then.call(x)
      // 传递两个回调函数作为参数，1: resolvePromise ，2: rejectPromise
      try {
        // 功能相当于: x.then(resolve, reject)
        then.call(
          x,
          // 在此条件分支，此形参将永远为 thenable
          function (thenable) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            // 这里的 resolve/reject 指的是最初的函数，
            // 这是因为, Promise A+ 规范规定: 如果 promise.then() 返回一个 thenable, 那么 promise 的状态和值由此 thenable 决定。
            // 即： 直到最后调用 .then() 时的结果，不返回 thenable
            // 那么将此 .then 的值作为第一次（最初）调用 promise.then() 的结果，然后第一次的 .then 的状态和最后一次 .then 的状态同步。
            resolvePromise(selfPromise, thenable, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          function (reason) {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } catch (error) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;

        // 否则以 e 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

// 会返回一个新的 promise，以支持链式调用
// TIP: onFulfilled 和 onRejected 需要放入微任务队列
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this; // 保存一下 this, 因为有些函数的执行上下文并非 MyPromise
  // 执行 .then() 时，如果是 FULFILLED,
  // 说明传递给 Promise(executor) 的 executor 直接就同步 resolve / reject 了。
  // 因为如果 resolve/reject 是异步的，promise.then 会同步被触发，然后此时 status 是 PENDING
  if (that.status === FULFILLED) {
    const promise2 = new MyPromise(function (resolve, reject) {
      // 用 setTimeout 模拟微任务，可用 queueMicrotask(callback), MutationObserver 替代。
      // 如果是在 node 环境，可用：process.nextTick(callback)

      setTimeout(function () {
        try {
          if (typeof onFulfilled === "function") {
            const x = onFulfilled(that.value);
            resolvePromise(promise2, x, resolve, reject);
          } else {
            resolve(that.value);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  // 执行 .then() 时，如果还是 PENDING, 所以此时 resolve() 是异步被执行，就保存任务到队列
  if (that.status === PENDING) {
    const promise2 = new MyPromise(function (resolve, reject) {
      that.onFulfilledCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onFulfilled === "function") {
              const x = onFulfilled(that.value);
              // 解析的目的：调用用户传入的 onFulfilled 时，用户此函数可能返回 thenable 或 promise 或 普通值，
              // 所以为了正确处理这些值，我们调用 resolvePromise.
              resolvePromise(promise2, x, resolve, reject);
            } else {
              resolve(that.value);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      that.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (typeof onRejected === "function") {
              const x = onRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject);
            } else {
              reject(that.reason);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    });

    return promise2;
  }

  if (that.status === REJECTED) {
    const promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (typeof onRejected === "function") {
            const x = onRejected(that.reason);
            resolvePromise(promise2, x, resolve, reject);
          } else {
            reject(that.reason);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }
};

MyPromise.resolve = function (parameter) {
  if (parameter instanceof MyPromise) {
    return parameter;
  }

  return new MyPromise(function (resolve) {
    resolve(parameter);
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise(function (resolve, reject) {
    reject(reason);
  });
};

MyPromise.all = function (promiseList) {
  var resPromise = new MyPromise(function (resolve, reject) {
    var count = 0;
    var result: any[] = [];
    var length = promiseList.length;

    if (length === 0) {
      return resolve(result);
    }

    promiseList.forEach(function (promise, index) {
      MyPromise.resolve(promise).then(
        function (value) {
          count++;
          result[index] = value;
          if (count === length) {
            resolve(result);
          }
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  });

  return resPromise;
};

MyPromise.race = function (promiseList) {
  var resPromise = new MyPromise(function (resolve, reject) {
    var length = promiseList.length;

    if (length === 0) {
      return resolve();
    } else {
      for (var i = 0; i < length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          function (value) {
            return resolve(value);
          },
          function (reason) {
            return reject(reason);
          }
        );
      }
    }
  });

  return resPromise;
};

MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};

MyPromise.prototype.finally = function (fn) {
  return this.then(
    function (value) {
      return MyPromise.resolve(fn()).then(function () {
        return value;
      });
    },
    function (error) {
      return MyPromise.resolve(fn()).then(function () {
        throw error;
      });
    }
  );
};

MyPromise.allSettled = function (promiseList) {
  return new MyPromise(function (resolve) {
    var length = promiseList.length;
    var result: any[] = [];
    var count = 0;

    if (length === 0) {
      return resolve(result);
    } else {
      for (var i = 0; i < length; i++) {
        (function (i) {
          var currentPromise = MyPromise.resolve(promiseList[i]);

          currentPromise.then(
            function (value) {
              count++;
              result[i] = {
                status: "fulfilled",
                value: value,
              };
              if (count === length) {
                return resolve(result);
              }
            },
            function (reason) {
              count++;
              result[i] = {
                status: "rejected",
                reason: reason,
              };
              if (count === length) {
                return resolve(result);
              }
            }
          );
        })(i);
      }
    }
  });
};

MyPromise.enchant = function () {
  if (window) {
    (window as any).PromiseSource = Promise;
    window.Promise = MyPromise as any;
  }
};

export default MyPromise;
