/**
 * To-Do List Application
 * Vanilla JavaScript implementation with localStorage persistence
 */

// ===== Constants =====
const STORAGE_KEY = 'todo:v1:tasks';
const ANIMATION_DURATION = 300; // milliseconds

// ===== State =====
let tasks = [];
let editingTaskId = null;

// ===== DOM Elements =====
const elements = {
    form: document.getElementById('add-task-form'),
    input: document.getElementById('task-input'),
    errorMessage: document.getElementById('input-error'),
    taskList: document.getElementById('task-list'),
    emptyState: document.getElementById('empty-state'),
    taskCount: document.getElementById('task-count')
};

// ===== Initialization =====
function init() {
    loadTasks();
    render();
    attachEventListeners();
}

// ===== LocalStorage Functions =====
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [];
        
        // Validate and sanitize loaded data
        tasks = tasks.filter(task => 
            task && 
            typeof task.id === 'string' && 
            typeof task.title === 'string' &&
            task.title.trim() !== ''
        );
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        tasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
        showError('Failed to save tasks. Storage may be full.');
    }
}

// ===== Task Management Functions =====
function addTask(title) {
    const trimmedTitle = title.trim();
    
    // Validate input
    if (!trimmedTitle) {
        showError('Task cannot be empty');
        elements.input.classList.add('error');
        return false;
    }
    
    if (trimmedTitle.length > 500) {
        showError('Task is too long (max 500 characters)');
        elements.input.classList.add('error');
        return false;
    }
    
    // Create new task
    const task = {
        id: generateId(),
        title: trimmedTitle,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task); // Add to beginning of array
    saveTasks();
    render();
    
    // Clear input and error
    elements.input.value = '';
    clearError();
    
    // Focus back on input for quick entry
    elements.input.focus();
    
    return true;
}

function editTask(id, newTitle) {
    const trimmedTitle = newTitle.trim();
    
    // Validate input
    if (!trimmedTitle) {
        showError('Task cannot be empty');
        return false;
    }
    
    if (trimmedTitle.length > 500) {
        showError('Task is too long (max 500 characters)');
        return false;
    }
    
    // Find and update task
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].title = trimmedTitle;
        saveTasks();
        render();
        clearError();
        return true;
    }
    
    return false;
}

function deleteTask(id) {
    // Find task for confirmation message
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Confirmation prompt
    const confirmed = confirm(`Delete task: "${task.title}"?`);
    if (!confirmed) return;
    
    // Add removing animation
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
        taskElement.classList.add('removing');
        
        // Wait for animation before removing
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            render();
        }, ANIMATION_DURATION);
    } else {
        // Fallback if element not found
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        render();
    }
}

// ===== Rendering Functions =====
function render() {
    renderTasks();
    updateTaskCount();
    updateEmptyState();
}

function renderTasks() {
    if (tasks.length === 0) {
        elements.taskList.innerHTML = '';
        return;
    }
    
    elements.taskList.innerHTML = tasks.map(task => createTaskHTML(task)).join('');
}

function createTaskHTML(task) {
    const date = formatDate(task.createdAt);
    const isEditing = editingTaskId === task.id;
    
    return `
        <li class="task-item ${isEditing ? 'editing' : ''}" data-task-id="${task.id}" role="listitem">
            <div class="task-content">
                <div class="task-title" data-action="edit">${escapeHtml(task.title)}</div>
                <input 
                    type="text" 
                    class="task-edit-input" 
                    value="${escapeHtml(task.title)}"
                    data-task-id="${task.id}"
                    aria-label="Edit task"
                >
                <span class="task-date">${date}</span>
            </div>
            <div class="task-actions">
                <button 
                    class="btn-icon edit" 
                    data-action="edit"
                    aria-label="Edit task: ${escapeHtml(task.title)}"
                    title="Edit"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button 
                    class="btn-icon delete" 
                    data-action="delete"
                    aria-label="Delete task: ${escapeHtml(task.title)}"
                    title="Delete"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </li>
    `;
}

function updateTaskCount() {
    elements.taskCount.textContent = tasks.length;
}

function updateEmptyState() {
    if (tasks.length === 0) {
        elements.emptyState.hidden = false;
        elements.taskList.setAttribute('aria-label', 'No tasks');
    } else {
        elements.emptyState.hidden = true;
        elements.taskList.setAttribute('aria-label', `${tasks.length} tasks`);
    }
}

// ===== Event Listeners =====
function attachEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
    
    // Input changes (clear error on typing)
    elements.input.addEventListener('input', handleInputChange);
    
    // Event delegation for task list
    elements.taskList.addEventListener('click', handleTaskListClick);
    elements.taskList.addEventListener('keydown', handleTaskListKeydown);
    elements.taskList.addEventListener('blur', handleTaskListBlur, true);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const title = elements.input.value;
    addTask(title);
}

function handleInputChange() {
    if (elements.input.classList.contains('error')) {
        elements.input.classList.remove('error');
        clearError();
    }
}

function handleTaskListClick(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.dataset.taskId;
    const action = e.target.closest('[data-action]')?.dataset.action;
    
    if (action === 'edit') {
        startEditing(taskId);
    } else if (action === 'delete') {
        deleteTask(taskId);
    }
}

function handleTaskListKeydown(e) {
    const editInput = e.target.closest('.task-edit-input');
    if (!editInput) return;
    
    const taskId = editInput.dataset.taskId;
    
    if (e.key === 'Enter') {
        e.preventDefault();
        finishEditing(taskId, editInput.value);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEditing();
    }
}

function handleTaskListBlur(e) {
    const editInput = e.target.closest('.task-edit-input');
    if (!editInput) return;
    
    const taskId = editInput.dataset.taskId;
    
    // Small delay to allow click events to fire first
    setTimeout(() => {
        if (editingTaskId === taskId) {
            finishEditing(taskId, editInput.value);
        }
    }, 100);
}

// ===== Editing Functions =====
function startEditing(taskId) {
    editingTaskId = taskId;
    render();
    
    // Focus the edit input
    const editInput = document.querySelector(`[data-task-id="${taskId}"].task-edit-input`);
    if (editInput) {
        editInput.focus();
        editInput.select();
    }
}

function finishEditing(taskId, newTitle) {
    if (editingTaskId !== taskId) return;
    
    const success = editTask(taskId, newTitle);
    if (success) {
        editingTaskId = null;
    }
}

function cancelEditing() {
    editingTaskId = null;
    render();
    clearError();
}

// ===== Error Handling =====
function showError(message) {
    elements.errorMessage.textContent = message;
}

function clearError() {
    elements.errorMessage.textContent = '';
    elements.input.classList.remove('error');
}

// ===== Utility Functions =====
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Start Application =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
