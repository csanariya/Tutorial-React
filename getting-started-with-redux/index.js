//compile on https://babeljs.io/repl/#

//reducer for todo
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id != action.id){
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

//reducer for todos
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

//reducer for visibility actions
const visibilityFilter = (
    state = "SHOW_ALL",
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const {combineReducers} = Redux;
const todoApp = combineReducers({
    todos, 
    visibilityFilter
});

const { createStore } = Redux;
const store = createStore(todoApp);


const { Component } = React;

let nextTodoID = 0;
class TodoApp extends Component {
    render() {
        return (
            <div>
                <input ref={node => {this.input=node;}} />
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoID++
                    });
                    this.input.value='';

                }}>
                Add Todo
                </button>
                <ul>
                    {this.props.todos.map(todo => 
                        <li key={todo.id}
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                });
                            }} 
                            style={{
                                textDecoration: todo.completed ? 'line-through' : 'none'
                            }}>
                            {todo.text}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
const render = () => {
    ReactDOM.render(
        <TodoApp  todos={store.getState().todos} />,
        document.getElementById('root')
    );
};

//updates
store.subscribe(render);

//initial state
render();