import axios from 'axios';

// Mock response for showcase since there's no actual backend initialized.
const MOCK_DELAY = 2500;
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const fallbackMockResponse = {
  id: 1,
  title: "Introduction to React & Modern Web Dev",
  description: "A comprehensive journey into building modern user interfaces.",
  modules: [
    {
      id: 101,
      title: "Module 1: The Basics",
      lessons: [
        {
          id: 1011,
          title: "What is React?",
          content: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called 'components'.",
          youtubeUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM",
          youtubeQuery: null
        },
        {
          id: 1012,
          title: "JSX and Components",
          content: "JSX is a syntax extension for JavaScript that looks similar to XML or HTML. Components are independent and reusable bits of code.",
          youtubeUrl: null,
          youtubeQuery: "React JSX tutorial for beginners"
        }
      ]
    },
    {
      id: 102,
      title: "Module 2: State and Effects",
      lessons: [
        {
          id: 1021,
          title: "Understanding useState",
          content: "State allows React components to change their output over time in response to user actions, network responses, and anything else.",
          youtubeUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
          youtubeQuery: null
        },
        {
          id: 1022,
          title: "Side Effects with useEffect",
          content: "The Effect Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.",
          youtubeUrl: null,
          youtubeQuery: "React useEffect hook explained"
        }
      ]
    }
  ]
};

export const generateCourse = async (topic) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/courses/generate`, null, {
      params: { topic }
    });
    // console.log("Course generated from API:", response.data);
    return response.data;
  } catch (error) {
    console.warn("API Call failed. Falling back to mock data.", error);

    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fallbackMockResponse);
      }, MOCK_DELAY);
    });
  }
};
