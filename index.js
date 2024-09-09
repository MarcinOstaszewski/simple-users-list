const list = document.getElementById('usersList');
const addUserButton = document.getElementById('addUserButton');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const companyInput = document.getElementById('userCompany');
const websiteInput = document.getElementById('userWebsite');
const fromMemoryDialog = document.getElementById('loadedFromMemory');
const fromServerDialog = document.getElementById('loadedFromServer');

const newUserForm = document.getElementById('newUserForm');

let usersList = [];

async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}

function createUsersList(users) {
  usersList = users.map(user => ({...user, active: true}));
  console.log(usersList);
}

const deleteUser = (index) => {
  usersList.splice(index, 1);
  displayUsers();
}

const swapUserStatus = (index) => {
  usersList[index].active = !usersList[index].active;
  displayUsers();
}

function displayUsers() {
  usersList.length && saveUsersListToLocalStorage();
  list.innerHTML = '';
  if (usersList.length === 0) {
    list.innerHTML = '<li class="list-group-item animate-waiting">Fetching users list from API. Please wait...</li>';
    fetchUsers();
    return;
  };
  usersList.forEach((user, index) => {
    const isActive = user.active;
    
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center',  isActive ? '-' : 'inactive');
    li.innerHTML = `
      <div class="col-5 d-flex flex-column user-name-email">
        <div class="user-name">${user.name}</div>
        <small class="user-email">${user.email?.toLowerCase()}</small>
      </div>
      <div class="col-4 col-xl-5 d-flex flex-column text-xs additional-info">
        <small>company: ${user?.company?.name}</small>
        <small>website: <span>${user.website}</small>
      </div>
      <div class="col-3 col-xl-2">
        <div class="d-flex justify-content-between">
          <button class="btn btn-outline-primary btn-sm mr-2" id="swap-user-status" onclick="swapUserStatus.call(null, ${index})">
            ${isActive ? 'Desactivate' : 'Activate'}
          </button>
          <button class="btn btn-outline-danger btn-sm" id="delete-user" onclick="deleteUser.call(null, ${index})">&times;</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

function resetInputs() {
  nameInput.value = '';
  emailInput.value = '';
  companyInput.value = '';
  websiteInput.value = '';
};

function saveUsersListToLocalStorage() {
  console.log('from saveUsersListToLocalStorage', usersList)
  localStorage.setItem('usersList', JSON.stringify(usersList));
}

function addUser(user) {
  usersList.push(user);
  resetInputs();
  displayUsers();
}

addUserButton.addEventListener('click', () => {
  const formData = newUserForm.elements;
  const newUser = {
    name: formData?.userName?.value,
    email: formData?.userEmail?.value,
    company: formData?.company?.name?.value,
    website: formData?.website?.value,
    active: false
  };
  addUser(newUser);
});

fromMemoryDialog.addEventListener('click', () => {
  fromMemoryDialog.close();
});

fromServerDialog.addEventListener('click', () => {
  fromServerDialog.close();
});

function fetchUsers() {
  getUsers().then(users => {
    usersList = [];
    createUsersList(users);
    fromServerDialog.show();
    displayUsers();  
  });
};

function initApp() {
  let listFromStorage = localStorage.getItem('usersList');
  if (listFromStorage?.length) {listFromStorage = JSON.parse(listFromStorage)};
  if (listFromStorage.length) {
    usersList = listFromStorage;
    displayUsers();
    fromMemoryDialog.show();
  } else {
    displayUsers();
    fetchUsers();
  }
};


// Initialise application
initApp();
