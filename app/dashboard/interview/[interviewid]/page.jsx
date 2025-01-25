"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import Webcam from 'react-webcam'
import Link from 'next/link'

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null) // Initialize as null
    const [webcamEnabled, setWebcamEnabled] = useState(false)
    const webcamRef = useRef(null)

    // Unwrap the params object using React.use()
    const unwrappedParams = React.use(params)
    const interviewId = unwrappedParams.interviewid

    useEffect(() => {
        console.log(interviewId)
        GetInterviewDetails()
    }, [interviewId])

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId))

            if (result.length > 0) {
                setInterviewData(result[0]) // Set interviewData if data is found
            } else {
                console.error("No interview data found for ID:", interviewId)
            }
        } catch (error) {
            console.error("Error fetching interview details:", error)
        }
    }

    const handleEnableWebcam = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                setWebcamEnabled(true)
                console.log("Webcam and microphone accessed successfully!")
            } else {
                alert("Your browser does not support webcam and microphone access.")
            }
        } catch (error) {
            console.error("Error accessing webcam:", error)
            if (error.name === "NotAllowedError") {
                alert("Please allow camera and microphone permissions in your browser settings.")
            } else if (error.name === "NotFoundError") {
                alert("No camera or microphone found. Please check your hardware.")
            } else {
                alert("Failed to access webcam and microphone. Please check your permissions and hardware.")
            }
        }
    }

    return (
        <div className='my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='font-bold text-3xl text-center mb-10 text-gray-800'>Let's Get Started!</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Interview Details Section */}
                {interviewData ? (
                    <div className='space-y-6'>
                        <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Interview Details</h2>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-500'>Job Role/Job Position</p>
                                    <p className='text-lg font-medium text-gray-800'>{interviewData.jobPosition}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Job Description/Tech Stack</p>
                                    <p className='text-lg font-medium text-gray-800'>{interviewData.jobDesc}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Years of Experience</p>
                                    <p className='text-lg font-medium text-gray-800'>{interviewData.jobExperience}</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-red-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-red-100'>
                            <div className='flex items-center gap-2 mb-4'>
                                <Lightbulb className='w-6 h-6 text-red-600' />
                                <h2 className='text-xl font-semibold text-red-600'>Information</h2>
                            </div>
                            <p className='text-red-700'>{process.env.NEXT_PUBLIC_INFORMATION}</p>
                        </div>
                    </div>
                ) : (
                    <p className='text-gray-600'>Loading interview data...</p>
                )}

                {/* Webcam Section */}
                <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Webcam Preview</h2>
                    {webcamEnabled ? (
                        <Webcam
                            ref={webcamRef}
                            audio={true}
                            mirrored={true}
                            videoConstraints={{
                                width: 300,
                                height: 300,
                                facingMode: "user"
                            }}
                            onUserMedia={() => console.log("Webcam accessed successfully!")}
                            onUserMediaError={(error) => {
                                console.error("Webcam access error:", error)
                                setWebcamEnabled(false)
                            }}
                            className='rounded-lg w-full h-auto'
                        />
                    ) : (
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            <WebcamIcon className='w-24 h-24 text-gray-400' />
                            <Button
                                variant='ghost'
                                onClick={handleEnableWebcam}
                                className='bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300'
                            >
                                Click Here to Enable Webcam and Microphone
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Start Interview Button */}
            <div className='flex justify-end mt-8'>
                <Link href={'/dashboard/interview/'+unwrappedParams.interviewid+'/start'}>
                <Button className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
                    Start Interview
                </Button>
                </Link>
                
            </div>
        </div>
    )
}

export default Interview