const form = document.getElementById('quiz-form');
const quizContainer = document.getElementById('quiz-container');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide the form and show the quiz container
    form.style.display = 'none';
    quizContainer.style.display = 'block';

    const numQuestions = document.getElementById('num-questions').value;
    const quizLevel = document.getElementById('quiz-level').value;
    const questionType = document.getElementById('question-type').value;
    const category = document.getElementById('category').value;

    // Fetch questions from JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(questions => {
            const filteredQuestions = questions.filter(question => {
                if (quizLevel === 'all' && category === 'all') {
                    return true;
                } else if (quizLevel !== 'all' && category === 'all') {
                    return question.level === quizLevel;
                } else if (quizLevel === 'all' && category !== 'all') {
                    return question.category === category;
                } else {
                    return question.level === quizLevel && question.category === category;
                }
            });

            const quizQuestions = [];
            for (let i = 0; i < numQuestions; i++) {
                const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
                quizQuestions.push(filteredQuestions[randomIndex]);
            }

            // Display the quiz questions
            quizContainer.innerHTML = '';
            quizQuestions.forEach((question, index) => {
                let questionHTML = '';
                switch (questionType) {
                    case 'multiple-choice':
                        questionHTML = `
                            <h2>Question ${index + 1}</h2>
                            <p>${question.text}</p>
                            <ul>
                                ${question.options.map((option, i) => `<li><input type="radio" name="question-${index}" value="${option}">${option}</li>`).join('')}
                            </ul>
                        `;
                        break;
                    case 'true-false':
                        questionHTML = `
                            <h2>Question ${index + 1}</h2>
                            <p>${question.text}</p>
                            <ul>
                                <li><input type="radio" name="question-${index}" value="true">True</li>
                                <li><input type="radio" name="question-${index}" value="false">False</li>
                            </ul>
                        `;
                        break;
                    case 'open-ended':
                        questionHTML = `
                            <h2>Question ${index + 1}</h2>
                            <p>${question.text}</p>
                            <textarea name="question-${index}" rows="5" cols="50"></textarea>
                        `;
                        break;
                }
                quizContainer.innerHTML += questionHTML;
            });

            // Add a submit button to submit the user's answers
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Answers';
            quizContainer.appendChild(submitButton);

            submitButton.addEventListener('click', () => {
                // Get the user's answers
                const userAnswers = [];
                quizQuestions.forEach((question, index) => {
                    switch (questionType) {
                        case 'multiple-choice':
                            const answer = document.querySelector(`input[name="question-${index}"]:checked`)?.value;
                            userAnswers.push(answer);
                            break;
                        case 'true-false':
                            const tfAnswer = document.querySelector(`input[name="question-${index}"]:checked`)?.value;
                            userAnswers.push(tfAnswer === 'true');
                            break;
                        case 'open-ended':
                            const oeAnswer = document.querySelector(`textarea[name="question-${index}"]`).value;
                            userAnswers.push(oeAnswer);
                            break;
                    }
                });

                // Display the quiz results
                const resultsHTML = `
                    <h2>Quiz Results</h2>
                    <p>You scored ${userAnswers.filter((answer, i) => answer === quizQuestions[i].correctAnswer).length} out of ${numQuestions}.</p>
                `;
                quizContainer.innerHTML = resultsHTML;
            });
        });
});
