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
    var Question_Card = document.getElementById('question_card')
    var form = document.getElementsByTagName('form')
    var input = document.getElementById('imgupload')
    var button = document.getElementById('mockbutton')
    var reset = document.getElementById('reset')
    var add = document.getElementById('add')
    Question_Card.style.display = 'none'
    add.addEventListener('click', () => {
        Question_Card.style.display = 'flex'
    })

    button.addEventListener('click', () => {
        input.click()
    })
    input.addEventListener("change", () => {
        if (input.value) {
            button.style.background = 'white'
            button.innerHTML = 'Image Uploaded'
        }
    })
    reset.addEventListener('click', () => {
        for (var i = 0; i < form.length; i++) {
            form[i].reset()
            button.style.background = "white url('./images/gallery.png') no-repeat center center"
            button.innerHTML = 'Click to Upload Image'
        }

    })

})();
