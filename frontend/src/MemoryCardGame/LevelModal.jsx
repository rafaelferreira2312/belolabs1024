import React from 'react';
import styles from './LevelModal.module.css';

const LevelModal = ({ onClose, onSelectLevel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Select Difficulty Level</h2>
        <button className={styles.levelButton} onClick={() => onSelectLevel('easy')}>
          Easy
        </button>
        <button className={styles.levelButton} onClick={() => onSelectLevel('medium')}>
          Medium
        </button>
        <button className={styles.levelButton} onClick={() => onSelectLevel('hard')}>
          Hard
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LevelModal;