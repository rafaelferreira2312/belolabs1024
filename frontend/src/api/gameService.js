const API_URL = 'http://localhost:5000/api/memory'; // Adicione /memory ao caminho

export const saveGameResult = async (gameData) => {
  const response = await fetch(`${API_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  return await response.json();
};

export const fetchGameHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};