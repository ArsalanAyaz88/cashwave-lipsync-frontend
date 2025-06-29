const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Generation {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  output_url?: string;
  [key: string]: any;
}

export const uploadAndGenerate = async (videoFile: File, audioFile: File, model: string): Promise<Generation> => {
  const formData = new FormData();
  formData.append('video_file', videoFile);
  formData.append('audio_file', audioFile);
  formData.append('model', model);

  const response = await fetch(`${API_BASE_URL}/upload-and-generate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to start generation.');
  }

  return response.json();
};

export const getGeneration = async (id: string): Promise<Generation> => {
  const response = await fetch(`${API_BASE_URL}/generations/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get generation status.');
  }
  return response.json();
};

export const listGenerations = async (): Promise<Generation[]> => {
  const response = await fetch(`${API_BASE_URL}/generations`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to list generations.');
  }
  return response.json();
};

export const estimateCost = async (videoFile: File, audioFile: File, model: string) => {
    const formData = new FormData();
    formData.append('video_file', videoFile);
    formData.append('audio_file', audioFile);
    formData.append('model', model);

    const response = await fetch(`${API_BASE_URL}/generations/estimate-cost`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to estimate cost.');
    }

    return response.json();
};
