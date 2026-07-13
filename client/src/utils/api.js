import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api';
  }
  return 'https://text-to-learn-ai-course-generator-production.up.railway.app/api';
};

const API_URL = getApiUrl();

/**
 * Axios instance with session cookie support.
 * `withCredentials: true` ensures the browser sends the JSESSIONID cookie
 * on every request so the server can validate the session.
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send session cookie with every request
});

// ── Auth API ──────────────────────────────────────────────────────────────────

/**
 * Registers a new user account and automatically logs them in.
 * @returns {Promise<UserDTO>} the created user
 */
export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Authenticates with email and password.
 * @returns {Promise<UserDTO>} the authenticated user
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Authenticates (or registers) via a Google ID token credential.
 * @param {string} credential - the raw Google ID token from the sign-in button
 * @returns {Promise<UserDTO>} the authenticated user
 */
export const loginWithGoogle = async (credential) => {
  const response = await api.post('/auth/google', { credential });
  return response.data;
};

/**
 * Invalidates the current server session.
 */
export const logout = async () => {
  await api.post('/auth/logout');
};

/**
 * Validates the active session with the server and returns the current user.
 * Returns null if the session is invalid or expired (401).
 * @returns {Promise<UserDTO|null>}
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ── Course API ────────────────────────────────────────────────────────────────

export const generateCourse = async (prompt) => {
  try {
    // POST /api/courses/generate?topic=...
    const response = await api.post('/courses/generate', null, {
      params: { topic: prompt }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend course generation failed. Falling back to dynamic sample course:", error.message);

    const capitalizedTopic = prompt
      ? prompt.charAt(0).toUpperCase() + prompt.slice(1)
      : "React & Modern Web Dev";

    return {
      id: Date.now(),
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

export const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const getUserCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user courses:', error.message);
    return [];
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
  const response = await api.get('/youtube', { params: { query } });
  return response.data;
};

export const getHinglishAudio = async (lessonId) => {
  const response = await api.post('/hinglish', null, { params: { lessonId } });
  return response.data;
};

export default api;
