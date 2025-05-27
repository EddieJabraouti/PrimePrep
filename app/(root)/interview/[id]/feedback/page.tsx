import React from 'react'
import dayjs from "dayjs";
import {getCurrentUser} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";
import {getFeedbackByInterviewId, getInterviewById} from "@/lib/actions/general.action";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

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
        <section className="section-feedback">
            <div className="flex flex-row justify-center">
                <h1 className="text-4xl font-semibold text-white">
                    Feedback on Interview -{" "}
                    <span className="capitalize">{interview.role}</span> Interview
                </h1>
            </div>

            <div className="flex flex-row justify-center">
                <div className="flex flex-row gap-5">
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star icon" />
                        <p className="text-white">
                            Overall Impression:{" "}
                            <span className="text-white font-bold">
                                {feedback?.totalScore}
                            </span>
                            /100
                        </p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                        <p className="text-white">
                            {feedback?.createdAt ? dayjs (feedback.createdAt).format("YYYY, MMMM-DD") : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <hr/>

            <p className="text-white">{feedback?.finalAssessment}</p>

            <div className="flex flex-col gap-4">
                <h2 className="text-white">Interview Breakdown:</h2>
                {feedback?.categoryScores?.map((category, index) => (
                    <div key={index}>
                        <p className="font-bold text-white">
                            {index + 1}. {category.name} ({category.score}/100)
                        </p>
                        <p className="text-white">{category.comment}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-white" >Strengths</h3>
                <ul>
                    {feedback?.strengths && feedback.strengths.length > 0 ? (
                        feedback.strengths.map((strength, index) => (
                            <li className="text-white" key={index}>{strength}</li>
                        ))
                    ) : (
                        <li className="text-white">None</li>
                    )}
                </ul>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-white">Areas for Improvement</h3>
                <ul className="text-white">
                    {feedback?.areasForImprovement?.map((areas, index) => (
                        <li className="text-white" key={index}>{areas}</li>
                    ))}
                </ul>
            </div>

            <div className="buttons">
                <Button className="btn-secondary flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-sembold text-black text-center">
                            Back to frontpage
                        </p>
                    </Link>
                </Button>

                <Button className="btn-secondary flex-1">
                    <Link href={`/interview/${id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-black text-center">
                            Retake The Interview
                        </p>
                    </Link>
                </Button>
            </div>

        </section>
    )
}
export default Page
