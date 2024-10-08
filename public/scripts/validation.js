$(document).ready(function () {
  // Function to validate email format
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // Function to validate password
  function validatePassword(password) {
    return password.length >= 6;
  }

  // Function to validate matching passwords
  function validateConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
  }

  // Function to show error message
  function showError(input, message) {
    var parentDiv = input.closest(".form-group");
    parentDiv.addClass("error");
    parentDiv.find(".error-message").text(message);
  }

  // Function to clear error message
  function clearError(input) {
    var parentDiv = input.closest(".form-group");
    parentDiv.removeClass("error");
    parentDiv.find(".error-message").text("");
  }

  // Sign Up form submission
  $("#signup-btn").click(function (e) {
    e.preventDefault();

    // Reset error messages
    $(".error-message").text("");
    $(".form-group").removeClass("error");

    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var dob = $("#dob").val().trim();
    var mob = $("#mob").val().trim();
    var address = $("#add").val().trim();
    var password = $("#pass").val();
    var confirmPassword = $("#cpass").val();

    // Perform validation
    var isValid = true;

    if (name === "") {
      showError($("#name"), "Please enter your name.");
      isValid = false;
    }

    if (!validateEmail(email)) {
      showError($("#email"), "Please enter a valid email address.");
      isValid = false;
    }

    if (dob === "") {
      showError($("#dob"), "Please enter your date of birth.");
      isValid = false;
    }

    if (mob === "") {
      showError($("#mob"), "Please enter your mobile number.");
      isValid = false;
    }

    if (address === "") {
      showError($("#add"), "Please enter your address.");
      isValid = false;
    }

    if (!validatePassword(password)) {
      showError($("#pass"), "Password must be at least 6 characters long.");
      isValid = false;
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      showError($("#cpass"), "Passwords do not match.");
      isValid = false;
    }

    // Submit the form if all fields are valid
    if (isValid) {
      $(".signup-form").submit();
    }
  });

  // Sign In form submission
  $("#signin-btn").click(function (e) {
    e.preventDefault();

    // Reset error messages
    $(".error-message").text("");
    $(".form-group").removeClass("error");

    var email = $("#email-signin").val().trim();
    var password = $("#pass-signin").val();

    // Perform validation
    var isValid = true;

    if (!validateEmail(email)) {
      showError($("#email-signin"), "Please enter a valid email address.");
      isValid = false;
    }

    if (!validatePassword(password)) {
      showError(
        $("#pass-signin"),
        "Password must be at least 6 characters long."
      );
      isValid = false;
    }

    // Submit the form if all fields are valid
    if (isValid) {
      $(".signin-form").submit();
    }
  });

  // Cross button click event
  $(".cross").click(function () {
    // Hide the corresponding form
    $(this).closest(".container").hide();
  });


});
