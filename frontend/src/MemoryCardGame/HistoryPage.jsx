import React, { useState, useEffect } from 'react'; // Importe React e os hooks
import { fetchGameHistory } from '../api/gameService';
import styles from './HistoryPage.module.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchGameHistory();
        if (response.success) {
          setHistory(response.data);
        } else {
          setError('Failed to load history');
        }
      } catch (error) {
        setError('Network error');
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>Game History</h1>
      <table className={styles.historyTable}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Level</th>
            <th>Time (s)</th>
            <th>Moves</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((game, index) => (
            <tr key={index}>
              <td>{game.playerName}</td>
              <td>{game.level}</td>
              <td>{game.time}</td>
              <td>{game.moves}</td>
              <td>{game.score}</td>
              <td>{new Date(game.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;