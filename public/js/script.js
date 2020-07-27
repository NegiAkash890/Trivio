///added a comment in new-feature branch//
var ip1 = document.getElementById('ip1')
var ip2 = document.getElementById('ip2')
var ip3 = document.getElementById('ip3')
var ip4 = document.getElementById('ip4')
var choice_1 = document.getElementById('c1')
var choice_2 = document.getElementById('c2')
var choice_3 = document.getElementById('c3')
var choice_4 = document.getElementById('c4')
var choice_value_1 = document.getElementById('ip1_value')
var choice_value_2 = document.getElementById('ip2_value')
var choice_value_3 = document.getElementById('ip3_value')
var choice_value_4 = document.getElementById('ip4_value');
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
        ip1.value = ''
        choice_value_1.innerText = 'No File Selected'
        ip2.value = ''
        choice_value_2.innerText = 'No File Selected'
        ip3.value = ''
        choice_value_3.innerText = 'No File Selected'
        ip4.value = ''
        choice_value_4.innerText = 'No File Selected'
    })

})();

const documentname = document.title;
if (document.title == 'QUIZ DASHBOARD') {


}
else {
//     var share_creds = document.getElementById('share_creds')
//     share_creds.style.display = 'none'
//     var share_link = document.getElementById('share_link')
//     var share_button = document.getElementById('share_button')
//     share_button.addEventListener('click', () => {
//         share_creds.style.display = 'block'
//     })
    var add = document.getElementById('add')
    var Question_Card = document.getElementById('question_card')
    // Question_Card.style.display = 'none'
    add.addEventListener('click', () => {
        Question_Card.style.display = 'flex'
    })


    choice_1.addEventListener('click', () => {
        var ip1 = document.getElementById('ip1')
        ip1.click()
    })
    ip1.addEventListener('change', () => {
        choice_value_1.innerText = ip1.value.split('\\')[2]
    })
    choice_2.addEventListener('click', () => {
        var ip2 = document.getElementById('ip2')
        ip2.click()
    })
    ip2.addEventListener('change', () => {
        choice_value_2.innerText = ip2.value.split('\\')[2]
    })
    choice_3.addEventListener('click', () => {
        var ip3 = document.getElementById('ip3')
        ip3.click()
    })
    ip3.addEventListener('change', () => {

        choice_value_3.innerText = ip3.value.split('\\')[2]
    })
    choice_4.addEventListener('click', () => {
        var ip4 = document.getElementById('ip4')
        ip4.click()
    })
    ip4.addEventListener('change', () => {

        choice_value_4.innerText = ip4.value.split('\\')[2]
    })
}

