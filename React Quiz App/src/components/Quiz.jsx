import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const decodeEntities = (html) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get("https://opentdb.com/api.php?amount=10");
        const formattedQuestions = response.data.results.map((question) => ({
          ...question,
          question: decodeEntities(question.question),
          incorrect_answers: question.incorrect_answers.map(decodeEntities),
          correct_answer: decodeEntities(question.correct_answer)
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error(`Error Fetching data: ${error}`);
      }
    }
    fetchQuestions();
  }, []);

  const handleClick = (answer) => {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <>
      <div>
        <h1>Quiz App</h1>
        {questions.length > 0 ? (
          showScore ? (
            <div>
              <h2>Your Score: {score}/{questions.length}</h2>
              <button onClick={() => window.location.reload()}>Restart Quiz</button>
            </div>
          ) : (
            <div>
              <h2>Question {currentQuestion + 1}/{questions.length}</h2>
              <p>{questions[currentQuestion].question}</p>
              <div>
                {questions[currentQuestion].incorrect_answers.map((option, index) => (
                  <button key={index} onClick={() => handleClick(option)}>{option}</button>
                ))}
              </div>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default Quiz;