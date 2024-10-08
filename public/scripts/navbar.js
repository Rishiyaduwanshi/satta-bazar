$(document).ready(function() {
    // Toggle visibility of signin and signup forms
    $('#signin-btn').click(function() {
        $('.signin-container').show();
        $('.signup-container').hide();
    });

    $('#signup-btn').click(function() {
        $('.signup-container').show();
        $('.signin-container').hide();
    });
    $('#signin-btn-2').click(function() {
    
        $('.signin-container').show();
        $('.signup-container').hide();
    });

    $('#signup-btn-2').click(function() {
        $('.signup-container').show();
        $('.signin-container').hide();
    });

    $(".cross").click(()=>{
        $('.signin-container').hide();
        $('.signup-container').hide();
    })
});






