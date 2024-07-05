# 概述

Redux core 和 Redux Toolkit 合并.

# 快速开始

# 使用

与框架无关, 可以集成进任何库或框架, 包括在原生代码中使用.

```html
<body>
  <input id="input" />
  <button id="add">add</button>
</body>

<script type="module">
  import {
    createSlice,
    subscribe,
    useDispatch,
    useSelector,
  } from '@yomua/y-simdux'

  const articleSlice = createSlice({
    name: 'article',
    initialState: {
      value: 0,
    },
    reducers: {
      setSearchValue: (prevState, action) => {
        console.log(action.payload) // { data:'666', value:'999' }

        return {
          value: prevState.value + 1,
        }
      },
    },
  })

  const { setSearchValue } = articleSlice.actions

  const dispatch = useDispatch()

  const input = document.getElementById('input')
  const addBtn = document.getElementById('add')

  function render() {
    const value = useSelector((state) => {
      return state.article.value
    })

    input.value = value
  }

  render()

  subscribe(render)

  addBtn.addEventListener('click', () => {
    // 标准写法
    dispatch(setSearchValue({{ data:'666', value:'999' }}))

    // 或
    // dispatch({ type: 'article/setSearchValue', payload:{ data:'666', value:'999' } })
  })
</script>
```
