const resetUsersListButton = document.getElementById('resetUsersListButton');
const addNewUserButton = document.getElementById('addNewUserButton');
const saveChangesButton = document.getElementById('saveChangesButton');
const confirmReset = document.getElementById('confirmReset');
const list = document.getElementById('usersList');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const companyInput = document.getElementById('userCompany');
const websiteInput = document.getElementById('userWebsite');
const fromMemoryDialog = document.getElementById('loadedFromMemory');
const fromServerDialog = document.getElementById('loadedFromServer');
const resetUsersListDialog = document.getElementById('resetUsersList');
const newUserForm = document.getElementById('newUserForm');

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
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center',  isActive ? '-' : 'inactive');
    li.innerHTML = `
      <div class="col-4 col-md-5 d-flex flex-column user-name-email">
        <div class="user-name">${user.name}</div>
        <small class="user-email">${user.email?.toLowerCase()}</small>
      </div>
      <div class="col-4 col-md-5 d-flex flex-column text-xs additional-info">
        <small>company: ${user?.company?.name}</small>
        <small>website: <span>${user.website}</small>
      </div>
      <div class="col-4 col-md-2 col-xl-2">
        <div class="d-flex flex-column gap-1">
          <button class="btn btn-outline-primary btn-sm mr-2" id="swap-user-status" onclick="swapUserStatus.call(null, ${index})">
            ${isActive ? 'Desactivate' : 'Activate'}
          </button>
          <div class="d-flex justify-content-between">
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
    website: formData?.website?.value,
    active: false
  };
  usersList.push(newUser);
  displayUsers();
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
  updateAddSaveButtonVisible("add");
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
