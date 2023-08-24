import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, updatePending } from './use-cases';

const ElementIds = {
    ClearCompleted: '.clear-completed',
    FilterList: '.filter',
    NewTodoInput: '#new-todo-input',
    PendingCount: '#pending-count',
    TodoList: '.todo-list',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {
    
    const updatePendingLabel = () => {
        updatePending( ElementIds.PendingCount );
    }
    
    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIds.TodoList, todos );
        updatePendingLabel();
    }

    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayTodos();
    })();

    const newDescriptionInput = document.querySelector( ElementIds.NewTodoInput );
    const todoListUL = document.querySelector( ElementIds.TodoList );
    const clearCompletedButton = document.querySelector(ElementIds.ClearCompleted);
    const filterList = document.querySelectorAll(ElementIds.FilterList);
    
    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if ( event.keyCode !== 13 ) return;
        if ( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', ( event ) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo( element.getAttribute('data-id') );
        displayTodos();
    });

    todoListUL.addEventListener('click', ( event ) => {
        if ( event.target.classList.contains('destroy') ) {
            const element = event.target.closest('[data-id]');
            todoStore.deleteTodo( element.getAttribute('data-id') );
            displayTodos();
        }
    });

    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filterList.forEach( element => {
        element.addEventListener('click', (event) => {
            filterList.forEach( el => el.classList.remove('selected') );
            event.target.classList.add('selected');

            switch (event.target.text) {
                case 'Todos':
                    todoStore.setFilter( Filters.All );
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending );
                    break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed );
                    break;
            }
            
            displayTodos();
        })
    });
}