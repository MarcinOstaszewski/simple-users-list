const list = document.getElementById('usersList');
const addButton = document.getElementById('addNewUser');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const companyInput = document.getElementById('userCompany');
const websiteInput = document.getElementById('userWebsite');

const newUserForm = document.getElementById('newUserForm');

let usersList = [{name: 'waiting for users list...'}];

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
  list.innerHTML = '';
  const listOfUserElements = usersList.forEach((user, index) => {
    const isActive = user.active;
    const conditionalButtons = isActive === undefined ? '' 
      : `<div class="d-flex justify-content-between">
          <button class="btn btn-outline-primary btn-sm mr-2" id="swap-user-status" onclick="swapUserStatus.call(null, ${index})">${isActive ? 'Desactivate' : 'Activate'}</button>
          <button class="btn btn-outline-danger btn-sm" id="delete-user" onclick="deleteUser.call(null, ${index})">&times;</button>
        </div>`;
    
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center',  isActive ? '-' : 'inactive');
    li.innerHTML = `
      <div class="col-5 d-flex flex-column user-name-email">
        <div class="user-name">${user.name}</div>
        <small class="user-email">${user.email?.toLowerCase()}</small>
      </div>
      <div class="col-4 d-flex flex-column text-xs additional-info">
        <small>company: ${user?.company?.name}</small>
        <small>website: <span>${user.website}</small>
      </div>
      <div class="col-3">${conditionalButtons}</div>

    `;
    list.appendChild(li);
  });
}

function addUser(user) {
  usersList.push(user);
  displayUsers();
}

addButton.addEventListener('click', () => {
  console.log(newUserForm.elements);
  for (let element in newUserForm.elements) {
    console.log(element, element.nodeName, element?.value, element?.valueOf());
  };
  const newUser = {
    name: nameInput.value,
    active: false
  };
  // addUser(newUser);
  nameInput.value = '';
});


displayUsers(usersList);

getUsers().then(users => {
  usersList = [];
  createUsersList(users);
  displayUsers();  
});