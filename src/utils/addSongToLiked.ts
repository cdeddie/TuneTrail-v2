const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

export const addSongToLiked = async (id: string) => {
  if (!id) {
    console.error("Track ID is required");
    return;
  }

  try {
    let url = `${baseUrl}/api/add-song`;

    const body = JSON.stringify({ id });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to add song');
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error(error);
  }
};
