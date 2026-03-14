import { Mistral } from '@mistralai/mistralai';
import { Profile } from '../types';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || '';

let client: Mistral | null = null;

// Initialize Mistral client
const getClient = () => {
  if (!client && apiKey) {
    client = new Mistral({ apiKey });
  }
  return client;
};

// Generate AI response based on profile personality
export const generateAIResponse = async (
  userMessage: string,
  matchProfile: Profile
): Promise<string> => {
  try {
    const mistralClient = getClient();
    
    if (!mistralClient) {
      // Fallback if no API key
      return generateFallbackResponse(userMessage, matchProfile);
    }

    // Create a personality prompt based on the profile
    const systemPrompt = createPersonalityPrompt(matchProfile);

    const chatResponse = await mistralClient.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      maxTokens: 150,
    });

    const messageContent = chatResponse.choices?.[0]?.message?.content;
    const aiMessage = typeof messageContent === 'string' ? messageContent : '';
    return aiMessage || generateFallbackResponse(userMessage, matchProfile);
  } catch (error) {
    console.error('Mistral AI error:', error);
    return generateFallbackResponse(userMessage, matchProfile);
  }
};

// Create a personality prompt based on profile data
const createPersonalityPrompt = (profile: Profile): string => {
  const age = calculateAge(profile.birth_date);
  
  let prompt = `You are ${profile.name}, a ${age}-year-old ${profile.gender} on a dating app. `;
  
  if (profile.bio) {
    prompt += `Your bio says: "${profile.bio}". `;
  }
  
  if (profile.job_title) {
    prompt += `You work as a ${profile.job_title}`;
    if (profile.company) {
      prompt += ` at ${profile.company}`;
    }
    prompt += '. ';
  }
  
  if (profile.interests && profile.interests.length > 0) {
    prompt += `Your interests include: ${profile.interests.slice(0, 5).join(', ')}. `;
  }
  
  if (profile.city) {
    prompt += `You live in ${profile.city}. `;
  }

  if (profile.relationship_goal) {
    const goals: Record<string, string> = {
      'relationship': 'looking for a long-term relationship',
      'casual': 'interested in casual dating',
      'friendship': 'looking to make new friends',
      'not_sure': 'open to seeing where things go',
    };
    prompt += `You're ${goals[profile.relationship_goal] || 'exploring connections'}. `;
  }

  prompt += `\n\nRespond naturally and authentically as this person would in a dating app conversation. `;
  prompt += `Be friendly, engaging, and show genuine interest. Keep responses conversational and not too long (2-3 sentences max). `;
  prompt += `Use emojis occasionally but don't overdo it. Be flirty but respectful.`;

  return prompt;
};

// Calculate age from birth date
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Fallback responses if AI fails
const generateFallbackResponse = (userMessage: string, profile: Profile): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Greeting responses
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return `Hey! How's it going? 😊`;
  }
  
  // Question about interests
  if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || lowerMessage.includes('like to do')) {
    if (profile.interests && profile.interests.length > 0) {
      return `I'm really into ${profile.interests[0].toLowerCase()} and ${profile.interests[1]?.toLowerCase() || 'exploring new things'}! What about you?`;
    }
    return `I love trying new things! What are you passionate about?`;
  }
  
  // Question about work
  if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('do for')) {
    if (profile.job_title) {
      return `I'm a ${profile.job_title}! It's pretty interesting. What do you do?`;
    }
    return `I'm working on some exciting projects! What about you?`;
  }
  
  // Question about location
  if (lowerMessage.includes('where') || lowerMessage.includes('live') || lowerMessage.includes('from')) {
    if (profile.city) {
      return `I'm in ${profile.city}! Have you been here before?`;
    }
    return `I'm local to the area! Where are you from?`;
  }
  
  // Default friendly response
  const responses = [
    `That's interesting! Tell me more 😊`,
    `I'd love to hear more about that!`,
    `Sounds cool! What else do you enjoy?`,
    `Nice! I'm curious to know more about you`,
    `That's awesome! What made you interested in that?`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
