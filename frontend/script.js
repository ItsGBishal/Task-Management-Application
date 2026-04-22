const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const state = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  tasks: [],
  filter: 'all',
  search: '',
  socket: null
};

const elements = {
  authView: document.querySelector('#authView'),
  dashboardView: document.querySelector('#dashboardView'),
  loginTab: document.querySelector('#loginTab'),
  registerTab: document.querySelector('#registerTab'),
  loginForm: document.querySelector('#loginForm'),
  registerForm: document.querySelector('#registerForm'),
  dashboardTitle: document.querySelector('#dashboardTitle'),
  logoutButton: document.querySelector('#logoutButton'),
  openTaskModal: document.querySelector('#openTaskModal'),
  closeTaskModal: document.querySelector('#closeTaskModal'),
  taskDialog: document.querySelector('#taskDialog'),
  taskForm: document.querySelector('#taskForm'),
  taskFormTitle: document.querySelector('#taskFormTitle'),
  taskGrid: document.querySelector('#taskGrid'),
  searchInput: document.querySelector('#searchInput'),
  toast: document.querySelector('#toast'),
  totalCount: document.querySelector('#totalCount'),
  pendingCount: document.querySelector('#pendingCount'),
  progressCount: document.querySelector('#progressCount'),
  completedCount: document.querySelector('#completedCount')
};

const request = async (path, options = {}) => {
  // Centralized API helper keeps JWT headers and error handling consistent.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

const showToast = (message) => {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  window.setTimeout(() => elements.toast.classList.remove('visible'), 2600);
};

const setAuthMode = (mode) => {
  const isLogin = mode === 'login';
  elements.loginTab.classList.toggle('active', isLogin);
  elements.registerTab.classList.toggle('active', !isLogin);
  elements.loginForm.classList.toggle('active', isLogin);
  elements.registerForm.classList.toggle('active', !isLogin);
};

const saveSession = ({ token, user }) => {
  state.token = token;
  state.user = user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
  state.token = null;
  state.user = null;
  state.tasks = [];
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (state.socket) state.socket.disconnect();
  state.socket = null;
};

const connectSocket = () => {
  if (!window.io || state.socket || !state.user?.id) return;

  // Rooms are per user, so task events stay scoped to the signed-in account.
  state.socket = io(SOCKET_URL);
  state.socket.emit('join-user-room', state.user.id);
  ['task:created', 'task:updated', 'task:deleted'].forEach((event) => {
    state.socket.on(event, loadTasks);
  });
};

// Map pathname → filter value used by the API
const PATH_FILTER_MAP = {
  '/dashboard': 'all',
  '/tasks': 'pending',
  '/completed': 'completed'
};

const handleRouteChange = async () => {
  const path = window.location.pathname;
  const filter = PATH_FILTER_MAP[path] || 'all';

  // Update sidebar active state
  document.querySelectorAll('.sidebar nav a').forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    link.classList.toggle('active', linkPath === path);
  });

  // Sync filter buttons
  document.querySelectorAll('.filter-button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.status === filter);
  });

  state.filter = filter;
  await loadTasks();
};

const navigate = (path) => {
  window.history.pushState({}, '', path);
  handleRouteChange();
};

const showDashboard = async () => {
  elements.authView.classList.add('hidden');
  elements.dashboardView.classList.remove('hidden');
  elements.dashboardTitle.textContent = `${state.user?.name || 'Your'}'s tasks`;
  connectSocket();
  await handleRouteChange();
};

const showAuth = () => {
  elements.dashboardView.classList.add('hidden');
  elements.authView.classList.remove('hidden');
};

const loadTasks = async () => {
  const params = new URLSearchParams();
  if (state.filter !== 'all') params.set('status', state.filter);
  if (state.search) params.set('search', state.search);

  // Stats always show counts across ALL tasks regardless of current filter
  const [filtered, all] = await Promise.all([
    request(`/tasks?${params.toString()}`),
    request('/tasks')
  ]);
  state.tasks = filtered;
  state.allTasks = all;
  renderTasks();
  renderStats();
};

const formatDate = (date) => {
  if (!date) return 'No due date';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

const labelFor = (value) => value.replace('-', ' ');

const renderStats = () => {
  const all = state.allTasks || state.tasks;
  elements.totalCount.textContent = all.length;
  elements.pendingCount.textContent = all.filter((task) => task.status === 'pending').length;
  elements.progressCount.textContent = all.filter((task) => task.status === 'in-progress').length;
  elements.completedCount.textContent = all.filter((task) => task.status === 'completed').length;
};

const escapeHtml = (value) => {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
};

const renderTasks = () => {
  if (!state.tasks.length) {
    elements.taskGrid.innerHTML = '<div class="empty-state">No tasks found. Create one and give your day a spine.</div>';
    return;
  }

  elements.taskGrid.innerHTML = state.tasks.map((task) => `
    <article class="task-card">
      <div class="task-meta">
        <span class="badge ${task.status}">${labelFor(task.status)}</span>
        <strong class="priority-${task.priority}">${task.priority}</strong>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.description || 'No description added yet.')}</p>
      <small>Due: ${formatDate(task.dueDate)}</small>
      <div class="task-actions">
        <button class="card-button" type="button" data-action="complete" data-id="${task._id}">
          ${task.status === 'completed' ? 'Reopen' : 'Complete'}
        </button>
        <span>
          <button class="card-button" type="button" data-action="edit" data-id="${task._id}">Edit</button>
          <button class="card-button danger" type="button" data-action="delete" data-id="${task._id}">Delete</button>
        </span>
      </div>
    </article>
  `).join('');
};

const openTaskModal = (task = null) => {
  elements.taskForm.reset();
  elements.taskFormTitle.textContent = task ? 'Edit Task' : 'New Task';
  elements.taskForm.elements.id.value = task?._id || '';
  elements.taskForm.elements.title.value = task?.title || '';
  elements.taskForm.elements.description.value = task?.description || '';
  
  // Set radio buttons for status and priority
  const status = task?.status || 'pending';
  const priority = task?.priority || 'medium';
  elements.taskForm.elements.status.value = status;
  elements.taskForm.elements.priority.value = priority;

  elements.taskForm.elements.dueDate.value = task?.dueDate ? task.dueDate.slice(0, 10) : '';
  elements.taskDialog.showModal();
};

const handleAuth = async (event, mode) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

  try {
    const data = await request(`/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    saveSession(data);
    showToast(mode === 'login' ? 'Logged in successfully' : 'Account created');
    await showDashboard();
  } catch (error) {
    showToast(error.message);
  }
};

const handleTaskSubmit = async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(elements.taskForm).entries());
  const taskId = payload.id;
  delete payload.id;

  try {
    await request(taskId ? `/tasks/${taskId}` : '/tasks', {
      method: taskId ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    elements.taskDialog.close();
    showToast(taskId ? 'Task updated' : 'Task created');
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
};

const handleTaskGridClick = async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const task = state.tasks.find((item) => item._id === button.dataset.id);
  if (!task) return;

  try {
    if (button.dataset.action === 'edit') {
      openTaskModal(task);
      return;
    }

    if (button.dataset.action === 'delete') {
      await request(`/tasks/${task._id}`, { method: 'DELETE' });
      showToast('Task deleted');
    }

    if (button.dataset.action === 'complete') {
      const isCompleting = task.status !== 'completed';
      await request(`/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: isCompleting ? 'completed' : 'pending' })
      });
      showToast(isCompleting ? 'Task marked as completed! 🎉' : 'Task reopened');

      // Redirect to the appropriate view using clean URLs
      navigate(isCompleting ? '/completed' : '/tasks');
      return;
    }

    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
};

elements.loginTab.addEventListener('click', () => setAuthMode('login'));
elements.registerTab.addEventListener('click', () => setAuthMode('register'));
elements.loginForm.addEventListener('submit', (event) => handleAuth(event, 'login'));
elements.registerForm.addEventListener('submit', (event) => handleAuth(event, 'register'));
elements.logoutButton.addEventListener('click', () => {
  clearSession();
  showAuth();
});
elements.openTaskModal.addEventListener('click', () => openTaskModal());
elements.closeTaskModal.addEventListener('click', () => elements.taskDialog.close());
elements.taskForm.addEventListener('submit', handleTaskSubmit);
elements.taskGrid.addEventListener('click', handleTaskGridClick);
elements.searchInput.addEventListener('input', (event) => {
  state.search = event.target.value.trim();
  window.clearTimeout(elements.searchInput.searchTimer);
  elements.searchInput.searchTimer = window.setTimeout(loadTasks, 250);
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const reverseMap = { all: '/dashboard', pending: '/tasks', completed: '/completed' };
    const targetPath = reverseMap[button.dataset.status] || '/dashboard';
    
    if (window.location.pathname === targetPath) {
      document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      state.filter = button.dataset.status;
      await loadTasks();
    } else {
      navigate(targetPath);
    }
  });
});

// Intercept sidebar link clicks to prevent page reloads
document.querySelector('.sidebar nav').addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link && link.getAttribute('href').startsWith('/')) {
    event.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

// Listen for browser Back/Forward buttons
window.addEventListener('popstate', handleRouteChange);

if (state.token && state.user) {
  showDashboard().catch(() => {
    clearSession();
    showAuth();
    showToast('Session expired. Please login again.');
  });
} else {
  showAuth();
}
