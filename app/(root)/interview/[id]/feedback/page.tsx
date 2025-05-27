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
                <h1 className="text=4xl font-semibold">
                    Feedback on Interview -{" "}
                    <span className="capitalize">{interview.role}</span> Interview
                </h1>
            </div>

            <div className="flex flex-row justify-center">
                <div className="flex flex-row gap-5">
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star icon" />
                        <p>
                            Overall Impression:{" "}
                            <span className="text-primary-200 font-bold">
                                {feedback?.totalScore}
                            </span>
                            /100
                        </p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                        <p>
                            {feedback?.createdAt ? dayjs (feedback.createdAt).format("YYYY, MMMM-DD") : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <hr/>

            <p>{feedback?.finalAssessment}</p>

            <div className="flex flex-col gap-4">
                <h2>Interview Breakdown:</h2>
                {feedback?.categoryScores?.map((category, index) => (
                    <div key={index}>
                        <p className="font-bold">
                            {index + 1}. {category.name} ({category.score}/100)
                        </p>
                        <p>{category.comment}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                <h3>Strengths</h3>
                <ul>
                    {feedback?.strengths && feedback.strengths.length > 0 ? (
                        feedback.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                        ))
                    ) : (
                        <li>None</li>
                    )}
                </ul>
            </div>

            <div className="flex flex-col gap-3">
                <h3>Areas for Improvement</h3>
                <ul>
                    {feedback?.areasForImprovement?.map((areas, index) => (
                        <li key={index}>{areas}</li>
                    ))}
                </ul>
            </div>

            <div className="buttons">
                <Button className="btn-secondary flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-sembold text-primary-200 text-center">
                            Back to frontpage
                        </p>
                    </Link>
                </Button>

                <Button className="btn-secondary flex-1">
                    <Link href={`/interview/${id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-primary-200 text-center">
                            Retake The Interview
                        </p>
                    </Link>
                </Button>
            </div>

        </section>
    )
}
export default Page
