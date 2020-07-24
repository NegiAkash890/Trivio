(function () {
    window.addEventListener('load', function () {
        var next = document.getElementById('next')
        var count = document.getElementById('time_rem')
        var question_count = document.getElementById('current_question_count')
        var total_questions = document.getElementById('total_questions')
        question_count.innerText = 1
        localStorage.question_count = 0
        total_questions.innerText = 10
        count.innerHTML = 5

        function countdown() {
            if (parseInt(count.innerText) > 0) {
                count.innerHTML = parseInt(count.innerText) - 1
            }
            else {
                next.click()

            }
        }
        var x = setInterval(countdown, 1000)
    })
}
)()
