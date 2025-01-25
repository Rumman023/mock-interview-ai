"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAiModel'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
    const [userAnswer, setUserAnswer] = useState('')
    const {user} = useUser()
    const [loading, setLoading] = useState(false)

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    })

    // Reset userAnswer when starting a new recording
    const handleStartRecording = () => {
        setUserAnswer('') // Reset userAnswer
        startSpeechToText() // Start recording
    }

    // Update userAnswer with the latest results
    useEffect(() => {
        if (results.length > 0) {
            const latestTranscript = results[results.length - 1].transcript
            setUserAnswer(latestTranscript)
        }
    }, [results])

    useEffect(() => {  
         if(!isRecording && userAnswer?.length > 0)
         {
             updateUserAnswer()
         }
         if(userAnswer?.length < 0)
            {
                setLoading(false)
                toast.error('Error saving your answer. Please record your answer again.')
                return
            }
     },[userAnswer])

    const StartStopRecording =async() => {
        if(isRecording)
        {
            stopSpeechToText()    
        }else{  
            startSpeechToText()
        }
    }

    const updateUserAnswer = async () => { 
        
        console.log(userAnswer)
        setLoading(true)
        const feedbackPrompt = "Questions:"+mockInterviewQuestion[activeQuestionIndex]?.question + "Answer:"+userAnswer+"depending on the question and answer, please give us rating for answer and feedback for area of improvement if any "+
            "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field."
             
            const result = await chatSession.sendMessage(feedbackPrompt)

            const mockJsonResponse = (result.response.text()).replace('```json', '').replace('```','')
            
            console.log(mockJsonResponse)

            const jsonFeedbackResponse = JSON.parse(mockJsonResponse)
        
            const resp=await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns:userAnswer,
                feedback:jsonFeedbackResponse?.feedback,
                rating:jsonFeedbackResponse?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-YYYY')
            })

            if(resp)
            {
                toast.success('User Answer saved successfully!')
                setUserAnswer('')
                setResults([])
            }
            setResults([])
            
            setLoading(false)
        
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div
                className="flex flex-col items-center justify-center rounded-lg p-5 shadow-md"
                style={{ backgroundColor: '#b1b5b8' }}
            >
                <Image src="/wc.png" alt="logo" width={200} height={200} className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                variant='outline'
                className='mt-5'
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <h2 className='text-red-600 flex gap-2'>
                        <Mic /> Stop Recording
                    </h2>
                ) : (
                    'Record Answer'
                )}
            </Button>

            <Button onClick={() => console.log(userAnswer)}>Show Answer</Button>

        </div>
    )
}

export default RecordAnswerSection