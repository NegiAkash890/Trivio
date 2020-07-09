(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
// var input = document.getElementById('imgupload')
// var button = document.getElementById('mockbutton')
// button.addEventListener('click', () => {
//     input.click()
//     if (input.value) {
//         button.style.backgroundImage = "url('./images/logo.png')"
//         button.innerHTML = 'IMAGE UPLOADED'
//     }
//     else {
//         button.innerHTML = 'CLICK TO UPLOAD IMAGE'
//     }
// })








