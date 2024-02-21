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
    <div className='container mx-auto p-4 text-center bg-gradient-to-r from-purple-200 to-gray-700'>
      <div className='min-h-screen flex flex-col justify-center'>
        <h1 className='text-4xl font-bold mb-4 text-gray-800 '>Quiz App</h1>
        {questions.length > 0 ? (
          showScore ? (
            <div>
              <h2 className='text-xl font-semibold mb-4'>Your Score: {score}/{questions.length}</h2>
              <button  className='bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-700' onClick={() => window.location.reload()}>Restart Quiz</button>
            </div>
          ) : (
            <div className=" mx-52 bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
              <h2 className='text-xl font-semibold mb-4 text-blue-900'>Question {currentQuestion + 1}/{questions.length}</h2>
              <p className='text-lg mb-4 font-semibold'>{questions[currentQuestion].question}</p>
              <div className='grid grid-cols-2 gap-4 mx-44'>
                {questions[currentQuestion].incorrect_answers.map((option, index) => (
                  <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" key={index} onClick={() => handleClick(option)}>{option}</button>
                ))}
                <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={()=>handleClick(questions[currentQuestion].correct_answer)}>{questions[currentQuestion].correct_answer}</button>
              </div>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Quiz;