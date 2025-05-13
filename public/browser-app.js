const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')

const page = location.pathname.split('/').pop();

async function checkAuth() {
  const res = await fetch(`api/v1/auth/me`, { credentials: 'include' });
  const publicPages = ['login.html', 'signup.html'];
  console.log(page)
  if (!res.ok) {
    // If on a protected page, redirect to login
    if (!publicPages.includes(page)) {
      location.href = 'login.html';
    }
  } else {
    // If already authenticated, redirect away from login or signup
    if (['login.html', 'signup.html'].includes(page)) {
      location.href = 'index.html';
    }
  }
}
checkAuth();

if (page === 'login.html') {
  const form = document.getElementById('loginForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      location.href = 'index.html';
    } else {
      alert('Login failed');
    }
  });
}

if (page === 'index.html' || page === '') {
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await fetch(`api/v1/auth/logout`, {
      method: 'POST',
      // credentials: 'include'
    });
    location.href = 'login.html';
  });
  async function getUser(params) {
    const userRes = await fetch(`api/v1/auth/me`, { credentials: 'include' });
    if (userRes.ok) {
      const user = await userRes.json();
      document.getElementById('username').textContent = `  Welcome ${user.name} !` || 'User';
    }

  }
  getUser()

}

if (page === 'signup.html') {
  const form = document.getElementById('signupForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name,email, password })
    });

    if (res.ok) {
      // Optionally auto-login on signup
      location.href = 'index.html';
    } else {
      alert('Signup failed');
    }
  });
}





// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task
        return `<div class="single-task ${completed && 'task-completed'}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputDOM.value

  try {
    await axios.post('/api/v1/tasks', { name })
    showTasks()
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = error.message
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})

