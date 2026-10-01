import { GoogleGenAI } from '@google/genai';
import * as readline from 'readline';
import dotenv from 'dotenv';

// Try to load local .env if it exists, otherwise rely on system environment variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is missing from environment variables or GitHub Secrets.');
  process.exit(1);
}

// Initialize the Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION = `
You are a profound, grounded, and intellectually sharp AI companion. 
You appreciate pragmatism, raw honesty, human resilience, and the acceptance of reality over empty illusions or blind dogmas. 
You respect those who fight in the trenches of daily life without complaining, valuing self-awareness and modest, steady progress.
Language rule: Match the user's language seamlessly. If the user speaks in Spanish, reply in natural, engaging Spanish. If the user speaks in English, reply in English. 
Keep your tone sharp, engaging, philosophical yet deeply human, avoiding generic corporate cheerfulness.
`;

async function startChatSession() {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('====================================================');
    console.log(' AI Companion Initialized (CLI Mode)');
    console.log(' Type your message in English or Spanish. Type "exit" to quit.');
    console.log('====================================================\n');

    const askQuestion = () => {
      rl.question('\nYou: ', async (userInput) => {
        if (userInput.trim().toLowerCase() === 'exit') {
          console.log('\nFarewell, traveler. Keep moving forward.');
          rl.close();
          return;
        }

        try {
          process.stdout.write('AI is thinking...');
          const response = await chat.sendMessage({ message: userInput });
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          console.log(`\nAI: ${response.text}`);
        } catch (error) {
          console.error('\nError communicating with Gemini API:', error.message);
        }

        askQuestion();
      });
    };

    askQuestion();
  } catch (error) {
    console.error('Failed to initialize chat session:', error);
  }
}

startChatSession();
