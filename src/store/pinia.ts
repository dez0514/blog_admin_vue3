import { defineStore } from 'pinia'
interface ToDoItem {
    text: string, 
    id: number, 
    isFinished: boolean
}
interface States {
    todos: ToDoItem[],
    filter: string,
    nextId: number
}
export const todoStore = defineStore('todos', {
  state: ():States => ({
    todos: [],
    filter: 'all',
    nextId: 0,
  }),
  getters: {
    finishedTodos(state:States):ToDoItem[] {
      return state.todos.filter((todo:ToDoItem) => todo.isFinished)
    },
    unfinishedTodos(state:States):ToDoItem[] {
      return state.todos.filter((todo:ToDoItem) => !todo.isFinished)
    },
    filteredTodos(state:States):ToDoItem[] {
      if (this.filter === 'finished') {
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // 传入任意参数，可以返回promise，也可以不返回
    addTodo(text:string) {
      // 可以直接更改状态
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})