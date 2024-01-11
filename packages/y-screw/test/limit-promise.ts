import limitPromise from '../src/limit-promise'

const limit = limitPromise(2)

function job(name) {
    console.log(`started: ${name}`)

    return new Promise((resolve, reject) => {
        // 当作异步任务
        setTimeout(() => {
            console.log(`    finished: ${name}`)
            resolve(name) // 异步任务里面，改 当前 promise 这个实例的状态
        }, Math.floor(Math.random() * 1000))
    })
}

for (let i = 0; i <= 4; i++) {
    limit(() => job(i))
}
