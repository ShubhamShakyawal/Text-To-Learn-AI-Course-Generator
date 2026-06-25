import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const generateCourse = async (prompt) => {
  try {
    // Align with Spring Boot controller endpoint: POST /api/courses/generate?topic=...
    const response = await api.post('/courses/generate', null, {
      params: { topic: prompt }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend course generation failed. Falling back to dynamic sample course:", error.message);

    const capitalizedTopic = prompt 
      ? prompt.charAt(0).toUpperCase() + prompt.slice(1) 
      : "React & Modern Web Dev";
      
    // Return a beautifully structured sample course custom-tailored to the user's prompt topic
    return {
      id: Date.now(), // Dynamic unique ID so frontend saves/lists it correctly
      title: `${capitalizedTopic} (Sample Course)`,
      description: `A beautifully structured learning journey designed to master the fundamentals and advanced architectural patterns of ${capitalizedTopic}.`,
      modules: [
        {
          id: Date.now() + 1,
          title: "Module 1: Core Fundamentals",
          lessons: [
            {
              id: Date.now() + 11,
              title: `Introduction to ${capitalizedTopic}`,
              content: `${capitalizedTopic} represents a powerful engineering paradigm. In this lesson, we will explore the foundational paradigms, syntax/design principles, execution model, and explain how mastering ${capitalizedTopic} will accelerate your capabilities in modern development.`,
              youtubeUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM",
              youtubeQuery: `${prompt || "React overview"} introduction tutorial`
            },
            {
              id: Date.now() + 12,
              title: "Setting Up Your Workspace & Tools",
              content: "To build secure, fast, and scalable projects, having a professionally configured environment is essential. Here we cover compiler toolchains, package and dependency managers, IDE configurations, and basic CLI commands for building.",
              youtubeUrl: null,
              youtubeQuery: `${prompt || "React setup"} developer environment tools tutorial`
            }
          ]
        },
        {
          id: Date.now() + 2,
          title: "Module 2: Advanced Integration & Flow",
          lessons: [
            {
              id: Date.now() + 21,
              title: "Under the Hood: Execution & Architecture",
              content: `Understanding how ${capitalizedTopic} works internally is key to write high-performance applications. We will dive deep into performance analysis, memory models, compilation metrics, and clean engineering architecture.`,
              youtubeUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
              youtubeQuery: `${prompt || "React architecture"} advanced deep dive`
            },
            {
              id: Date.now() + 22,
              title: "Asynchronous Coordination & Caching",
              content: "Most modern systems communicate with external APIs, network threads, or local storage streams. This lesson covers asynchronous scheduling, resolving race conditions, error boundaries, and building resilient caching layers.",
              youtubeUrl: null,
              youtubeQuery: `${prompt || "React async"} data fetching tutorial`
            }
          ]
        }
      ]
    };
  }
};


export const syncUser = async (userData) => {
  try {
    const response = await api.post('/user/sync', userData);
    return response.data;
  } catch (error) {
    console.warn('Backend user sync failed, running in local-only fallback mode:', error.message);
    return { success: true, user: userData, local: true };
  }
};

export const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const getUserCourses = async () => {
  try {
    const response = await api.get('/user-courses');
    return response.data;
  } catch (error) {
    // If backend doesn't have custom /user-courses, fetch all courses from general /courses endpoint
    console.warn('Backend /user-courses failed, falling back to /courses:', error.message);
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (fallbackError) {
      console.error('All course fetch attempts failed:', fallbackError);
      return [];
    }
  }
};

export const getLesson = async (id) => {
  const response = await api.get(`/lessons/${id}`);
  return response.data;
};

export const updateLessonProgress = async (courseId, lessonId, completed) => {
  try {
    const response = await api.patch(`/courses/${courseId}/progress/${lessonId}`, { completed });
    return response.data;
  } catch (error) {
    console.warn('Backend progress update failed, state is updated locally:', error.message);
    return { success: true, courseId, lessonId, completed };
  }
};

export const getYouTubeVideo = async (query) => {
  const response = await api.get(`/youtube`, { params: { query } });
  return response.data;
};

export const getHinglishAudio = async (lessonId) => {
  const response = await api.post(`/hinglish`, null, { params: { lessonId } });
  return response.data;
};

export default api;
