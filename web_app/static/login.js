
export let isLoggedIn = false;
export let currentUser = '';

const loginFormBtn = document.getElementById('login-form-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close-login-form');
const userLogin = document.getElementById('userLogin');

function logInLogOutButtonClick() {
    console.log("loginFormBtn.click()");
    if(isLoggedIn) {
        isLoggedIn = false;
        currentUser = '';
        userLogin.innerText = currentUser;
        loginFormBtn.innerText = 'Log in';
    } else {
        loginModal.classList.remove('hidden');
    }
}

function logInButtonClick(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(`Username: ${username}, password: ${password}`);

    // Prepare data to send
    const data = {
        username: username,
        password: password
    };

    // Send the POST request to the backend
    fetch('/api/verify_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        let res = response.json();
        const prettyJson = JSON.stringify(res, null, 2);
        return res;
    })
    .then(data => {
        if(data.message === "success") {
            isLoggedIn = true;
            currentUser = username;
            
            userLogin.innerText = currentUser;
            userLogin.classList.remove('hidden');
            loginFormBtn.innerText = 'Log out';
            loginModal.classList.add('hidden');
        } else {
            alert(data.message);
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
        }
    })
    .catch(error => {
        alert(error.message || 'Unable to log in. Please try again.');
    });
}

// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     if (username && password) {
//         isLoggedIn = true;
//         currentUser = username;

//         userLogin.innerText = currentUser;
//         userLogin.classList.remove('hidden');
//         loginFormBtn.innerText = 'Log out';
//         loginModal.classList.add('hidden');
//     }
// });

function registerButtonClick(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password
    };

    fetch('/api/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        let res = response.json();
        const prettyJson = JSON.stringify(res, null, 2);
        return res;
    })
    .then(data => {
        if(data.message === "success") {
            isLoggedIn = true;
            currentUser = username;
            
            userLogin.innerText = currentUser;
            userLogin.classList.remove('hidden');
            loginFormBtn.innerText = 'Log out';
            loginModal.classList.add('hidden');
        } else {
            alert(data.message);
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
        }
    })
    .catch(error => {
        alert(error.message || 'Unable to log in. Please try again.');
    });
}

export function initLoginForm() {
    document.getElementById('submit-log-in-btn').addEventListener('click', function(event) {logInButtonClick(event);});
    document.getElementById('submit-register-btn').addEventListener('click', function(event) {registerButtonClick(event);});
    loginFormBtn.addEventListener('click', function() {logInLogOutButtonClick();});

    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.classList.add('hidden'); // Closing the modal when clicking outside
        }
    });

    closeModal.addEventListener('click', function() {
        console.log("closeModal.click()");
        loginModal.classList.add('hidden');
    });
}