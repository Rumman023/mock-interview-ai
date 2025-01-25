"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

  

function Feedback({params}) {

   const [feedbackList, setFeedbackList] = useState([])
   const router = useRouter()

   const unwrappedParams = React.use(params)

   useEffect(() => {
          GetFeedback()
   },[]);

   const GetFeedback = async () => {
        try {
            const result = await db.select().from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, unwrappedParams.interviewid))
                .orderBy(UserAnswer.id, 'asc')
            
                console.log(result)
                setFeedbackList(result)
        } catch (error) {
            console.error("Error fetching feedback:", error)
        }
    }

  return (
    <div className='p-10'>
        <h2 className='text-3xl font-bold text-green-600'>Congratulations!</h2>
        <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>
        
        {feedbackList?.length==0?
        <h2 className='text-red-600'>No Interview feedback is available; No interview was given</h2>:null}
        :
        <>
        <h2 className='text-primary text-lg my-3'>Your overall Inteview Rating: <strong>7/10</strong> </h2>
        <h2 className='text-sm text-gray-500'>Find below your interview questions with correct answers, your answer and feedback for improvement</h2>
         
         {feedbackList && feedbackList.map((feedback, index) => (
            <Collapsible key={index} className='mt-5'>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'><strong>Question: </strong>{feedback.question} <ChevronsUpDown className='h-5 w-4 cursor-pointer'/> </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-5'>
                <h2 className='bg-red-50 text-red-600 border p-3 rounded-lg'><strong>Rating:</strong> {feedback.rating}/5</h2>
                <h2 className='p-3 rounded-lg bg-blue-50 text-sm text-blue-600'><strong>Your Answer: </strong>{feedback.userAns}</h2>
                <h2 className='p-3 rounded-lg bg-yellow-50 text-sm text-yellow-800'><strong>Correct Answer: </strong>{feedback.correctAns}</h2>
                <h2 className='p-3 rounded-lg bg-green-50 text-sm text-green-600'><strong>Feedback: </strong>{feedback.feedback}</h2> 
              </div>
            </CollapsibleContent>
          </Collapsible>
          
         ))}

         </>        

        <Button onClick = {()=>router.replace('/dashboard')}>Go Home</Button>

    </div>
  )
}

export default Feedback