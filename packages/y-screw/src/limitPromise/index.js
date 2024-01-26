"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function limiter(limitCount) {
    var _taskQueue = [];
    var _taskStackCount = 0;
    function queue(taskFn) {
        // 根据 task 创建新 Promise，得到 resolve, reject,
        // 并将此 task 和对应的 resolve, reject 放入队列
        // 以待后面将此任务离队，然后入栈时可以执行完成/拒绝
        // return: 如果此任务[完成/拒绝]得到结果后，将结果返回至上一层
        return new Promise(function (resolve, reject) {
            _taskQueue.push({ taskFn: taskFn, resolve: resolve, reject: reject });
        });
    }
    function dequeue() {
        // 取出队列中最先进来的任务
        if (_taskStackCount < limitCount) {
            var task = _taskQueue.shift();
            if (task) {
                /* eslint-disable no-use-before-define */
                runTask(task);
                /* eslint-disable no-use-before-define */
            }
        }
    }
    function runTask(task) {
        // 将任务入栈执行并得到 promise
        var promise = task === null || task === void 0 ? void 0 : task.taskFn().then(function (result) {
            if (_taskStackCount > 0) {
                _taskStackCount--;
            }
            // 任务完成，就 dequeue，dequeue 中又会拿到任务调用 runTask
            // 这样，如此反复，直到队列清空，就会停止这反复执行。
            dequeue();
            return result;
        });
        // 将此 promise 结果返回给对应的 resolve/reject
        Promise.resolve(promise).then(task === null || task === void 0 ? void 0 : task.resolve, task === null || task === void 0 ? void 0 : task.reject);
    }
    return function (taskFn) {
        // 如果执行栈已满（并发数量已达到上限）
        if (_taskStackCount >= limitCount) {
            // 将此任务放入队列
            // 这里使用 return，是为了后面从队列中取出任务并入栈执行，得到结果后，将结果返回至调用此模块的使用者。
            return queue(taskFn);
        }
        else {
            // 如果执行栈未满（并发数量未满）
            _taskStackCount++;
            return new Promise(function (resolve, reject) {
                runTask({ taskFn: taskFn, resolve: resolve, reject: reject });
            });
        }
    };
}
exports.default = limiter;
