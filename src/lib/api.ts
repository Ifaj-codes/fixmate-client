const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('fixmate_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data,
      message: data?.message,
    };
  } catch (err: any) {
    console.error('API Request Error:', err);
    return {
      success: false,
      message: err.message || 'Network connection failed. Please check your backend server.',
    };
  }
}

// Upload image to ImgBB
export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  // If no live ImgBB key provided, convert file to data URL as fallback so user can test upload immediately!
  if (!apiKey || apiKey.includes('mock')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (json.success) {
    return json.data.url;
  }
  throw new Error(json.error?.message || 'Failed to upload image to ImgBB');
}
