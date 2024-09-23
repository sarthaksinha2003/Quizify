document.getElementById('myButton').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'block';
  });

  document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
  });
  
  document.getElementById('submitBtn').addEventListener('click', function() {
    const numQuestions = document.getElementById('numQuestions').value;
    const questionLevel = document.getElementById('questionLevel').value;
    const questionType = document.getElementById('questionType').value;
    console.log(`Number of questions: ${numQuestions}`);
    console.log(`Question level: ${questionLevel}`);
    console.log(`Type of question: ${questionType}`);
  });
  function openPage() {
    window.location.href = 'afterselect.html';
  }
