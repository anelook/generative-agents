import {getStream} from "./utils.js";


export class Agent {
    constructor(personality) {
        this.personality = personality;
        this.observations = [];
        this.actions = [];
        this.locations = ['home:40.8772:-76.92992'];
    }

    async simulateObservation(currentTime) {
        // make a call to a LLM
        const messages = [{role: "system", content: this.personality},
            {
                role: "user",
                content: `It is ${currentTime}.  Your latest observations: ${this.observations.join(', ')}. Your latest actions: ${this.actions.join(', ')}. Your latest locations: ${this.locations.slice(-2).join(', ')}. Based on what is happening, how do you feel right now? Be concise, just one short sentence.`
            }];

        const response = await getStream(messages);
        this.observations.push(`${currentTime}: ${response}`);
    }

    async simulateAction(currentTime) {
        // make a call to a LLM
        const messages = [{role: "system", content: this.personality},
            {
                role: "user",
                content: `It is ${currentTime}.  Your latest observations: ${this.observations.join(', ')}. Your latest actions: ${this.actions.join(', ')}. Your latest locations: ${this.locations.slice(-2).join(', ')}. Based on your thoughts and previous actions, what is an appropriate action to do right now? Assume that you're doing this action. feel free to imagine outside of your description, invent people, objects, environment, etc. Evolve the story based on your previous actions, observations and locations. Add emojis. Be concise, just one short sentence.`
            }];

        const response = await getStream(messages);
        this.actions.push(`${currentTime}: ${response}`);
    }

    async simulateLocation(currentTime) {
        // make a call to a LLM
        const messages = [{role: "system", content: this.personality},
            {
                role: "user",
                content: `It is ${currentTime}. Your latest observations: ${this.observations.join(', ')}. Your latest actions: ${this.actions.join(', ')}. Your latest locations: ${this.locations.slice(-2).join(', ')} Based on your thoughts, actions and current time, where are you right now? Write the response in format: NAME:LATITUDE:LONGITUDE Omit any other punctuation, for example home:40.8772:-76.92992`
            }];

        const response = await getStream(messages);
        this.locations.push(`${currentTime}: ${response}`);
    }
}