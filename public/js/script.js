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
    var form = document.getElementsByTagName('form')
    var input = document.getElementById('imgupload')
    var button = document.getElementsByClassName('mockbutton')
    var reset = document.getElementById('reset')
    for (var i = 0; i < button.length; i++) {
        button[i].addEventListener('click', (e) => {
            e.preventDefault()
            input.click()
        })
    }
    input.addEventListener("change", () => {
        if (input.value) {
            for (var i = 0; i < button.length; i++) {
                button[i].style.background = 'white'
                button[i].innerHTML = 'Image Uploaded'
            }
        }
    })
    reset.addEventListener('click', () => {
        for (var i = 0; i < form.length; i++) {
            for (var i = 0; i < button.length; i++) {
                button[i].style.background = "white url('./images/gallery.png') no-repeat center center"
                button[i].innerHTML = 'Click to Upload Image'
                button[i].value = ''
            }
        }

    })

})();

const documentname = document.title;
if (document.title == 'QUIZ DASHBOARD') {


}
else {
    var add = document.getElementById('add')
    var Question_Card = document.getElementById('question_card')
    Question_Card.style.display = 'none'
    add.addEventListener('click', () => {
        Question_Card.style.display = 'flex'
    })
}

