import React from 'react';
import GameCanvas from '../components/GameCanvas';

interface GameScreenProps {
  onMenu: () => void;
}

export default function GameScreen({ onMenu }: GameScreenProps) {
  return <GameCanvas onMenu={onMenu} />;
}
