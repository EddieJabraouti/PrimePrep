import React from 'react'
import {getCurrentUser} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";
import {getFeedbackByInterviewId, getInterviewById} from "@/lib/actions/general.action";

const Page = async ({params}: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser()

    const interview = await getInterviewById(id)
    if(!interview) redirect('/')

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id!
    })

    console.log(feedback)

    return (
        <div>Page</div>
    )
}
export default Page
