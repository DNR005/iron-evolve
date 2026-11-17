const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export const forgeApi = {
  getDashboard: () => apiRequest<any>("/dashboard/"),
  getWorkouts: () => apiRequest<any[]>("/workouts/"),
  createWorkout: (split: any) =>
    apiRequest<any>("/workouts/", {
      method: "POST",
      body: JSON.stringify(split),
    }),
  getNutritionItems: () => apiRequest<any[]>("/nutrition/items/"),
  logNutritionItem: (item: { name: string; calories: number; protein: number; carbs: number; fats: number }) =>
    apiRequest<any>("/nutrition/items/", {
      method: "POST",
      body: JSON.stringify(item),
    }),
  deleteNutritionItem: (id: number) =>
    apiRequest<any>(`/nutrition/items/${id}/`, {
      method: "DELETE",
    }),
  getNutritionGoals: () => apiRequest<any>("/nutrition/goals/"),
  updateNutritionGoals: (goals: any) =>
    apiRequest<any>("/nutrition/goals/", {
      method: "PATCH",
      body: JSON.stringify(goals),
    }),
  getWeightList: () => apiRequest<any[]>("/weight/"),
  logWeight: (weight: number, dateLabel: string) =>
    apiRequest<any>("/weight/", {
      method: "POST",
      body: JSON.stringify({ weight, date_label: dateLabel }),
    }),
  getSettings: () => apiRequest<any>("/settings/"),
  updateSettings: (settings: any) =>
    apiRequest<any>("/settings/", {
      method: "PATCH",
      body: JSON.stringify(settings),
    }),
  getChatHistory: () => apiRequest<any[]>("/ai/chat/"),
  sendChatMessage: (message: string) =>
    apiRequest<any>("/ai/chat/", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
