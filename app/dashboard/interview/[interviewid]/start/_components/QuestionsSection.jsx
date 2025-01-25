import { Lightbulb, Volume, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {
    const textToSpeech = (text) => {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);
      synth.speak(utterThis);
    }
  
    if (!Array.isArray(mockInterviewQuestion) || mockInterviewQuestion.length === 0) {
      return (
        <div className='p-3 rounded-lg shadow-md border'>
          <p>No interview questions available.</p>
        </div>
      );
    }
  
    return (
      <div className='p-3 rounded-lg shadow-md border'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {mockInterviewQuestion.map((question, index) => (
            <h2 key={index} className={`p-2 border rounded-full text-xs md:text-sm text-center 
              cursor-pointer ${activeQuestionIndex === index && 'bg-primary text-white'}`}>
              Question #{index+1}
            </h2>
          ))}
        </div>
        <h2 className='my-5 text-md md: text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <Volume2 onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
  
        <div className='border rounded-lg p-5 bg-blue-100 my-10'>
          <h2 className='flex gap-2 items-center text-primary'>
            <Lightbulb/>
            <strong>NOTE:</strong>
          </h2>
          <h2 className='text-sm text-primary my-2'>
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  }
  
export default QuestionsSection