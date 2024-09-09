const resetUsersListButton = document.getElementById('resetUsersListButton');
const addNewUserButton = document.getElementById('addNewUserButton');
const saveChangesButton = document.getElementById('saveChangesButton');
const confirmReset = document.getElementById('confirmReset');
const list = document.getElementById('usersList');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const companyInput = document.getElementById('userCompany');
const websiteInput = document.getElementById('userWebsite');
const customNotification = document.getElementsByClassName('customNotification')[0];
const resetUsersListDialog = document.getElementById('resetUsersList');
const newUserForm = document.getElementById('newUserForm');

const messages = {
  fromMemory: "Users list loaded from browser's memory.",
  fromServer: "New list of users fetched from server.",
  userAdded: "New user added to the list.",
  userUpdated: "Updated user data.",
  userDeleted: "User deleted from the list."
}

let usersList = [];
let editedUserIndex = null;

function updateAddSaveButtonVisible(value) {
  if (value === "save") {
    addNewUserButton.classList.add('d-none');
    saveChangesButton.classList.remove('d-none');
  } else if (value === "add") {
    addNewUserButton.classList.remove('d-none');
    saveChangesButton.classList.add('d-none');
  } 
}

async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}

function createUsersList(users) {
  usersList = users.map(user => ({...user, active: true}));
}

const editUser = (index) => {
  editedUserIndex = index;
  updateAddSaveButtonVisible("save");
  const editedUser = usersList[index];
  nameInput.value = editedUser.name;
  emailInput.value = editedUser.email;
  companyInput.value = editedUser.company.name;
  websiteInput.value = editedUser.website;
}

const deleteUser = (index) => {
  usersList.splice(index, 1);
  displayUsers();
  showNotification(messages.userDeleted);
}

const swapUserStatus = (index) => {
  usersList[index].active = !usersList[index].active;
  displayUsers();
}

function displayUsers() {
  resetInputs();
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
    li.classList.add('list-group-item', 'd-flex', 'flex-wrap', 'justify-content-between', 'align-items-center',  isActive ? '-' : 'inactive');
    li.innerHTML = `
      <div class="col-6 col-sm-4 col-md-5 d-flex flex-column user-name-email">
        <div class="user-name">${user.name}</div>
        <small class="user-email">${user.email?.toLowerCase()}</small>
      </div>
      <div class="col-6 col-sm-4 col-md-5 d-flex flex-column text-xs additional-info">
        <small>company: ${user?.company?.name}</small>
        <small>website: <span>${user.website}</small>
      </div>
      <div class="col-12 col-sm-4 col-md-2 col-xl-2 mt-2 mt-sm-0">
        <div class="d-flex flex-sm-column gap-1 justify-content-end">
          <button class="btn btn-outline-primary btn-sm mr-2" id="swap-user-status" onclick="swapUserStatus.call(null, ${index})">
            ${isActive ? 'Desactivate' : 'Activate'}
          </button>
          <div class="d-flex justify-content-between gap-1">
            <button class="btn btn-outline-dark btn-sm" id="edit-user" onclick="editUser.call(null, ${index})">Edit</button>
            <button class="btn btn-outline-danger btn-sm" id="delete-user" onclick="deleteUser.call(null, ${index})">Delete</button>
          </div>
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
  localStorage.setItem('usersList', JSON.stringify(usersList));
}

function addUser() {
  // TODO add validation !!!
  const formData = newUserForm.elements;
  const newUser = {
    name: formData?.userName?.value,
    email: formData?.userEmail?.value,
    company: {
      name: formData?.userCompany?.value
    },
    website: formData?.userWebsite?.value,
    active: false
  };
  usersList.push(newUser);
  displayUsers();
  showNotification(messages.userAdded);
}

function saveUserData() {
  // TODO add validation !!!
  const formData = newUserForm.elements;
  const updatedUser = {
    name: formData?.userName?.value,
    email: formData?.userEmail?.value,
    company: {
      ...formData.company,
      name: formData?.userCompany?.value
    },
    website: formData?.userWebsite?.value,
    active: usersList[editedUserIndex].active
  };
  usersList.splice(editedUserIndex, 1, updatedUser);
  updateAddSaveButtonVisible("add");
  displayUsers();
  showNotification(messages.userUpdated);
  editedUserIndex = null;
}

addNewUserButton.addEventListener('click', addUser);
saveChangesButton.addEventListener('click', saveUserData);

resetUsersListButton.addEventListener('click', () => {
  resetUsersListDialog.show();
});

confirmReset.addEventListener('click', () => {
  fetchUsers();
});

resetUsersListDialog.addEventListener('click', () => {
  resetUsersListDialog.close();
});

customNotification.addEventListener('click', () => {
  customNotification.close();
});

function fetchUsers() {
  getUsers().then(users => {
    usersList = [];
    createUsersList(users);
    showNotification(messages.fromServer);
    displayUsers();  
  });
};

function showNotification(message) {
  const header = customNotification.querySelector('h6');
  header.innerHTML = message;
  customNotification.show();
  setTimeout(() => {
    customNotification.close();
  }, 4500);
}

function initApp() {
  updateAddSaveButtonVisible("add");
  let listFromStorage = localStorage.getItem('usersList');
  if (listFromStorage?.length) {
    listFromStorage = JSON.parse(listFromStorage);
    usersList = listFromStorage;
    displayUsers();
    showNotification(messages.fromMemory);
  } else {
    displayUsers();
    fetchUsers();
  }
};


// Initialise application
initApp();
