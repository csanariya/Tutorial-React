//compile on https://babeljs.io/repl/#


const { connect } = ReactRedux;

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

const { combineReducers } = Redux;
const todoApp = combineReducers({
    todos, 
    visibilityFilter
});

let nextTodoID = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        text,
        id: nextTodoID++
    };
};

//action creators
const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

const { Component } = React;

//presentational component
const Link = ({
    active,
    children,
    onClick
}) => {
    if (active)
    {
        return <span>{children}</span>;
    }    
    return (
        <a href='#'
            onClick={e => {
                e.preventDefault();
                onClick();
            }}
        >{children}</a>
    );
};

const mapStateToLinkProps = (
    state,
    ownProps //container components own props, not props passed to child (which is return val)
) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};
const mapDispatchToLinkProps = (
    dispatch,
    ownProps
) => {
    return {
        onClick: () => { 
            dispatch(
                setVisibilityFilter(ownProps.filter)
            );
        }
    };
};

//container component
const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

const Footer = () => (
    <p>Show:
        {' '}
        <FilterLink filter='SHOW_ALL' 
        >All</FilterLink>
        {' '}
        <FilterLink filter='SHOW_ACTIVE' 
        >Active</FilterLink>
        {' '}
        <FilterLink filter='SHOW_COMPLETED' 
        >Completed</FilterLink>
    </p>
)

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li 
        onClick={onClick} 
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}>
        {text}
    </li>
);

const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo => 
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        )}
    </ul>
)


let AddTodo = ({ dispatch }) => {
    let input;
    return (
        <div>
            <input ref={node => {input=node;}} />
            <button onClick={() => {
                dispatch(addTodo(input.value));
                input.value='';
            }}>
            Add Todo
            </button>
        </div>
    );
};
AddTodo = connect()(AddTodo); //default behavior of connect(mapState, mapDispatch) to not sub to store, and dispatch fx is injected as a prop

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed)
        default:
            return todos;
    }
}

//props for the presentational component (TodoList). will be updated any time state is updated
const mapStateToTodoListProps = (
    state
) => {
    return {
        todos: getVisibleTodos(
            state.todos, 
            state.visibilityFilter
        )
    };
};
const mapDispatchToTodoListProps = (
    dispatch
) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id))
        }
    };
};

//containter component
const VisibleTodoList = connect(
        mapStateToTodoListProps,
        mapDispatchToTodoListProps
    )(TodoList); //presentational component that you're connecting to the redux store


const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

const { Provider } = ReactRedux;
const { createStore } = Redux;

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);
