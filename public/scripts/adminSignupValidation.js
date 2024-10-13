    const signupForm = document.querySelector('.signup-form');
    const signupUsernameInput = document.getElementById('username');
    const signupEmailInput = document.getElementById('email');
    const signupPasswordInput = document.getElementById('password');
    const signupConfirmPasswordInput = document.getElementById('confirmPassword');

    const errorColor = "var(--color-red)"; 

    signupForm.addEventListener('submit', function (e) {
        let valid = true;

        // Reset input styles
        signupUsernameInput.style.borderColor = '';
        signupEmailInput.style.borderColor = '';
        signupPasswordInput.style.borderColor = '';
        signupConfirmPasswordInput.style.borderColor = '';

        const username = signupUsernameInput.value.trim();
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value.trim();
        const confirmPassword = signupConfirmPasswordInput.value.trim();

        // Regex for validating email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regex for validating strong password
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

        // Check if username is filled
        if (username === '') {
            toastr.error('Username is required.');
            signupUsernameInput.style.borderColor = errorColor;
            valid = false;
        }

        // Check if email is filled and valid
        if (email === '') {
            toastr.error('Email is required.');
            signupEmailInput.style.borderColor = errorColor;
            valid = false;
        } else if (!emailPattern.test(email)) {
            toastr.error('Invalid email format.');
            signupEmailInput.style.borderColor = errorColor;
            valid = false;
        }

        // Check if password is filled
        if (password === '') {
            toastr.error('Password is required.');
            signupPasswordInput.style.borderColor = errorColor;
            valid = false;
        } else if (!passwordPattern.test(password)) {
            toastr.error('Password must be at least 6 characters long and include at least one letter, one number, and one special character.');
            signupPasswordInput.style.borderColor = errorColor;
            valid = false;
        }

        // Check if confirm password matches
        if (confirmPassword !== password) {
            toastr.error('Passwords do not match.');
            signupConfirmPasswordInput.style.borderColor = errorColor;
            valid = false;
        }

        // If any validation fails, prevent form submission
        if (!valid) {
            e.preventDefault();
        }
    });

