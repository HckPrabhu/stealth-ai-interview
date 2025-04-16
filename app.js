const OPENAI_API_KEY = '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'; // Add your real key

const questionDisplay = document.getElementById('question');
const answerDisplay = document.getElementById('answer');

// Speech-to-Text
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onresult = async (event) => {
  const lastResult = event.results[event.results.length - 1];
  const spokenText = lastResult[0].transcript.trim();
  questionDisplay.textContent = `🗣️ Q: ${spokenText}`;

  const aiAnswer = await getAIAnswer(spokenText);
  answerDisplay.textContent = `🤖 A: ${aiAnswer}`;

  speakAnswer(aiAnswer);
};

recognition.onerror = (err) => {
  console.error('Speech recognition error:', err);
};

// Start listening
recognition.start();

// GPT Answer Generator
async function getAIAnswer(question) {
  const prompt = `
You are my AI interview assistant. Answer the following interview question naturally, like a confident human. Avoid robotic language. Do not mention AI. Speak as if it's me talking in an interview. Keep answers under 100 words.

Question: "${question}"
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    }),
  });

  const data = await response.json();
  const aiText = data.choices[0].message.content.trim();
  return aiText;
}

// TTS - Text to Speech
function speakAnswer(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 1.2;
  utter.volume = 0.3; // Quiet voice for whisper effect
  speechSynthesis.speak(utter);
}
