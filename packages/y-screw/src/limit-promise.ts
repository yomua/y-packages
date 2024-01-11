// 限制多个 Promise 的并发量
type Task = () => Promise<unknown>
type Queue = {
    taskFn: Task
    resolve: (value: unknown) => void
    reject: (reason?: any) => void
}

export default function limiter(limitCount: number) {
    const _taskQueue: Queue[] = []
    let _taskStackCount = 0

    function queue(taskFn: Task) {
        // 根据 task 创建新 Promise，得到 resolve, reject,
        // 并将此 task 和对应的 resolve, reject 放入队列
        // 以待后面将此任务离队，然后入栈时可以执行完成/拒绝
        // return: 如果此任务[完成/拒绝]得到结果后，将结果返回至上一层
        return new Promise((resolve, reject) => {
            _taskQueue.push({ taskFn, resolve, reject })
        })
    }

    function dequeue() {
        // 取出队列中最先进来的任务
        if (_taskStackCount < limitCount) {
            const task = _taskQueue.shift()

            if (task) {
                /* eslint-disable no-use-before-define */
                runTask(task)
                /* eslint-disable no-use-before-define */
            }
        }
    }

    function runTask(task: Queue) {
        // 将任务入栈执行并得到 promise
        const promise = task?.taskFn().then((result) => {
            if (_taskStackCount > 0) {
                _taskStackCount--
            }

            // 任务完成，就 dequeue，dequeue 中又会拿到任务调用 runTask
            // 这样，如此反复，直到队列清空，就会停止这反复执行。
            dequeue()

            return result
        })

        // 将此 promise 结果返回给对应的 resolve/reject
        Promise.resolve(promise).then(task?.resolve, task?.reject)
    }

    return (taskFn: Task) => {
        // 如果执行栈已满（并发数量已达到上限）
        if (_taskStackCount >= limitCount) {
            // 将此任务放入队列
            // 这里使用 return，是为了后面从队列中取出任务并入栈执行，得到结果后，将结果返回至调用此模块的使用者。
            return queue(taskFn)
        } else {
            // 如果执行栈未满（并发数量未满）
            _taskStackCount++

            return new Promise((resolve, reject) => {
                runTask({ taskFn, resolve, reject })
            })
        }
    }
}
