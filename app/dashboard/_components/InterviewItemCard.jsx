import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {

    const router = useRouter()

    const onStartPressed=()=>{
        router.push(`/dashboard/interview/${interview?.mockId}/start`)
    }

    const onFeedbackPressed=()=>{
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
    }

  return (
    <div className='border p-5 rounded-md shadow-sm'>
           <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
           <h2 className='text-sm text-gray-600 font-bold'>{interview?.jobExperience}</h2>
           <h2 className='text-sm text-gray-400 font-semibold'>Created At: {interview?.createdAt}</h2>
        <div className='flex justify-between items-center gap-5'>
            <Button variant='outline' className='border rounded-lg p-2 shadow-sm mt-3 w-full' 
            onClick={onFeedbackPressed}
            >Feedback</Button>
            <Button className="mt-3 w-full"
            onClick={onStartPressed}
            >Start</Button>
            
        </div>
    </div>
  )
}

export default InterviewItemCard