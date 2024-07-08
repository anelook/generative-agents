import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function getStream(messages) {
    const responseStream = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
        stream: true
    });
    let finalResponse = ''
    for await(const part of responseStream) {
        const delta = part.choices[0].delta;
        if (delta && delta.content) {
            for(const char of delta.content) {
                await new Promise(resolve => setTimeout(resolve, 50));
                process.stdout.write(char);
                finalResponse += char;
            }
        }
    }
    process.stdout.write('\n\n');
    return finalResponse;
}
