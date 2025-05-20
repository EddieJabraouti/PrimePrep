import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin"

export async function GET() {
    return Response.json({success: true, data: 'Thank You'}, {status: 200});
}

export async function POST(request: Request) {

    try {
        const { type, role, level, techstack, amount, userid, industry } = await request.json();

        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The industry or field is: ${industry}.
        ${techstack ? `The tech stack or specific skills relevant to the job are: ${techstack}.` : ''}
        The focus between behavioral and technical/knowledge-based questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
        });

        //Fixed the generateText() function form putting json in improper format and not being readable. Wasnt even letting me POST
        //Fixed with claudeAI.

        let parsedQuestions;
        try {
            // Try to extract JSON array from the text response
            const jsonString = questions.trim().match(/\[.*\]/s)?.[0] || "[]";
            parsedQuestions = JSON.parse(jsonString);

            // Ensure it's an array
            if (!Array.isArray(parsedQuestions)) {
                // If not an array, try to extract questions in a different way
                parsedQuestions = questions.split('\n')
                    .filter(line => line.trim().length > 0)
                    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim()) // Remove numbering like "1." or "1)"
                    .filter(line => line.length > 0);
            }
        } catch (e) {
            console.log("Error parsing questions:", e);
            // Fallback: split by newlines and clean up
            parsedQuestions = questions.split('\n')
                .filter(line => line.trim().length > 0)
                .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim()) // Remove numbering like "1." or "1)"
                .filter(line => line.length > 0);
        }

        const interview = {
            role,
            type,
            level,
            techstack: techstack ? techstack.split(',') : [],
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }
        await db.collection("interviews").add(interview);

        return Response.json({success: true}, {status: 200});

    }catch(err) {
        console.log(err);

        return Response.json ({success: false, err}, {status: 500});
    }
}