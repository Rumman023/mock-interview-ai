"use client"
import React from 'react'
import {useState} from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAiModel'
import { LoaderCircleIcon } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
  

function AddNewInterview() {
  
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [jsonResponse, setJsonResponse] = useState([])
  
  const router = useRouter()
  const {user}=useUser()

  const onSubmit= async (e)=>{
    setLoading(true)
    e.preventDefault()
    console.log(jobPosition, jobDescription, jobExperience)
    
    const inputPrompt = "Job Position: "+ jobPosition + ", Job Description: "+jobDescription+", Years of Experience: "+jobExperience+", Depending on Job Position, Job Description, Years of Experience give me "+ process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +" interview questions along with answers in JSON format. Give me `question` and `answer` field in JSON"
    
    try {
        const result = await chatSession.sendMessage(inputPrompt)
        const mockJsonResponse = (result.response.text()).replace('```json', '').replace('```','')
        console.log(JSON.parse(mockJsonResponse))
        setJsonResponse(mockJsonResponse)

    
      if(mockJsonResponse)
      {
       const resp = await db.insert(MockInterview)
       .values({
        mockId:uuidv4(),
        jsonMockResp:mockJsonResponse,
        jobPosition:jobPosition,
        jobDesc:jobDescription,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY')
       }).returning({mockId:MockInterview.mockId})

       console.log("Inserted ID: ", resp)

        if(resp){
             setOpenDialog(false)
             router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
       }
       else{
        console.log("Error inserting into DB")
       }
    } catch (error) {
        console.error("Error sending message to chat session:", error)
    }
    setLoading(false)
    
}

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-lg transition-all cursor-pointer'
        onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>

        <Dialog open={openDialog}>
  
  <DialogContent className='max-w-2xl'>
    <DialogHeader>
      <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
      <form onSubmit={onSubmit}>
       <div>
        
        <h2>Add details about your job position/role, job description and years of experience</h2>
        <div className='mt-6 my-10'>
            <label>Job Role/Job Position</label>
            <Input placeholder='Ex. Full Stack Developer' required
            onChange={(e)=>setJobPosition(e.target.value)}
            />
        </div>
        <div className='my-6'>
            <label>Job Description/Tech Stack (In Short)</label>
            <Textarea placeholder='Ex. React, Node, MongoDB, Express' required
            onChange={(e)=>setJobDescription(e.target.value)}
            />      
        </div>
        <div className='mt-6 my-10'>
            <label>Years of experience</label>
            <Input placeholder='5' type="number" max="100" required
            onChange={(e)=>setJobExperience(e.target.value)}
            />
        </div>
       </div>
       <div className='flex justify-end mt-5 space-x-2'>
            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading ? 
                <>
                <LoaderCircleIcon className='animate-spin'/>Generating from AI 
                </>:'Start Interview'}
                </Button>
      </div>
      </form>
      <DialogDescription />
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview

//Full Stack Development
//react, unreal engine, unity, mongodb