"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState(null) // Initialize as null
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([])
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

// Unwrap the params object using React.use()
const unwrappedParams = React.use(params)
const interviewId = unwrappedParams.interviewid

    useEffect(() => {
         
          GetInterviewDetails()
      },[]);


  const GetInterviewDetails = async () => {
          try {
              const result = await db.select().from(MockInterview)
                  .where(eq(MockInterview.mockId, interviewId))

            const jsonMockResp = JSON.parse(result[0].jsonMockResp)
            console.log(jsonMockResp)
            setMockInterviewQuestion(jsonMockResp)
            setInterviewData(result[0]) // Set interviewData if data is found
          } catch (error) {
              console.error("Error fetching interview details:", error)
          }
      }
  
  
    return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionsSection 
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        />
        
        <RecordAnswerSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        interviewData={interviewData}
        />
       
        </div>
        
        <div className='flex justify-end gap-5'>
          {activeQuestionIndex>0 && 
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
          {activeQuestionIndex != mockInterviewQuestion?.length - 1 && 
           <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} >Next Question</Button>}
          {activeQuestionIndex == mockInterviewQuestion?.length - 1 && 
          <Link href={`/dashboard/interview/${interviewId}/feedback`}>
          <Button>End Interview</Button>
          </Link>}

        </div>

    </div>
  )
}

export default StartInterview