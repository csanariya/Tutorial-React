'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//compile on https://babeljs.io/repl/#

//reducer for todo
var todo = function todo(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id != action.id) {
                return state;
            }
            return _extends({}, state, {
                completed: !state.completed
            });
        default:
            return state;
    }
};

//reducer for todos
var todos = function todos() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];

    switch (action.type) {
        case 'ADD_TODO':
            return [].concat(_toConsumableArray(state), [todo(undefined, action)]);
        case 'TOGGLE_TODO':
            return state.map(function (t) {
                return todo(t, action);
            });
        default:
            return state;
    }
};

//reducer for visibility actions
var visibilityFilter = function visibilityFilter() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "SHOW_ALL";
    var action = arguments[1];

    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

var _Redux = Redux,
    combineReducers = _Redux.combineReducers;

var todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
});

var _Redux2 = Redux,
    createStore = _Redux2.createStore;

var store = createStore(todoApp);

var _React = React,
    Component = _React.Component;


var FilterLink = function FilterLink(_ref) {
    var filter = _ref.filter,
        currentFilter = _ref.currentFilter,
        children = _ref.children,
        _onClick = _ref.onClick;

    if (filter === currentFilter) {
        return React.createElement(
            'span',
            null,
            children
        );
    }
    return React.createElement(
        'a',
        { href: '#',
            onClick: function onClick(e) {
                e.preventDefault();
                _onClick(filter);
            }
        },
        children
    );
};

var Footer = function Footer(_ref2) {
    var visibilityFilter = _ref2.visibilityFilter,
        onFilterClick = _ref2.onFilterClick;
    return React.createElement(
        'p',
        null,
        'Show:',
        ' ',
        React.createElement(
            FilterLink,
            { filter: 'SHOW_ALL',
                currentFilter: visibilityFilter,
                onClick: onFilterClick },
            'All'
        ),
        ' ',
        React.createElement(
            FilterLink,
            { filter: 'SHOW_ACTIVE',
                currentFilter: visibilityFilter,
                onClick: onFilterClick },
            'Active'
        ),
        ' ',
        React.createElement(
            FilterLink,
            { filter: 'SHOW_COMPLETED',
                currentFilter: visibilityFilter,
                onClick: onFilterClick },
            'Completed'
        )
    );
};

var Todo = function Todo(_ref3) {
    var onClick = _ref3.onClick,
        completed = _ref3.completed,
        text = _ref3.text;
    return React.createElement(
        'li',
        {
            onClick: onClick,
            style: {
                textDecoration: completed ? 'line-through' : 'none'
            } },
        text
    );
};

var TodoList = function TodoList(_ref4) {
    var todos = _ref4.todos,
        onTodoClick = _ref4.onTodoClick;
    return React.createElement(
        'ul',
        null,
        todos.map(function (todo) {
            return React.createElement(Todo, _extends({
                key: todo.id
            }, todo, {
                onClick: function onClick() {
                    return onTodoClick(todo.id);
                }
            }));
        })
    );
};

var AddTodo = function AddTodo(_ref5) {
    var onAddClick = _ref5.onAddClick;

    var input = void 0;
    return React.createElement(
        'div',
        null,
        React.createElement('input', { ref: function ref(node) {
                input = node;
            } }),
        React.createElement(
            'button',
            { onClick: function onClick() {
                    onAddClick(input.value);
                    input.value = '';
                } },
            'Add Todo'
        )
    );
};

var getVisibleTodos = function getVisibleTodos(todos, filter) {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(function (t) {
                return !t.completed;
            });
        case 'SHOW_COMPLETED':
            return todos.filter(function (t) {
                return t.completed;
            });
        default:
            return todos;
    }
};

var nextTodoID = 0;
var TodoApp = function TodoApp(_ref6) {
    var todos = _ref6.todos,
        visibilityFilter = _ref6.visibilityFilter;
    return React.createElement(
        'div',
        null,
        React.createElement(AddTodo, { onAddClick: function onAddClick(text) {
                return store.dispatch({
                    type: 'ADD_TODO',
                    text: text,
                    id: nextTodoID++
                });
            } }),
        React.createElement(TodoList, { todos: getVisibleTodos(todos, visibilityFilter),
            onTodoClick: function onTodoClick(id) {
                return store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: id
                });
            } }),
        React.createElement(Footer, {
            visibilityFilter: visibilityFilter,
            onFilterClick: function onFilterClick(filter) {
                return store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter: filter
                });
            } })
    );
};

var render = function render() {
    ReactDOM.render(React.createElement(TodoApp, store.getState()), document.getElementById('root'));
};

//updates
store.subscribe(render);

//initial state
render();