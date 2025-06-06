import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/interviewCard";
import {getCurrentUser} from "@/lib/actions/auth.action";
import {getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/general.action";


const Page = async () => {
    const user = await getCurrentUser();

    const [userInterviews, latestInterviews] = await Promise.all([
        await getInterviewsByUserId(user?.id!),
        await getLatestInterviews({userId: user?.id!})
    ])


    const hasPastInterviews = userInterviews?.length > 0;
    const hasUpcomingOInterviews = latestInterviews?.length > 0;


    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2 className="text-white">Dominate Your Interviews with AI Powered Mock Interviews & Detailed Feedback</h2>
                    <p className="text-lg text-white">
                        Practice with realistic interview style questions & receive instant feedback
                    </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Jump Into an Interview</Link>
                    </Button>
                </div>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2 className="text-white">Your Interviews:</h2>
                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <InterviewCard{...interview} key={interview.id} />

                        ))) : (
                            <p>You have not taken an interviews yet</p>
                    )}

                </div>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2 className="text-white">Take an Interview</h2>
                <div className="interviews-section">
                    {hasUpcomingOInterviews ? (
                        latestInterviews?.map((interview) => (
                            <InterviewCard{...interview} key={interview.id} />

                        ))) : (
                        <p className="text-white">There are no new interviews available</p>
                    )}
                </div>
            </section>
        </>
    )
}
export default Page
