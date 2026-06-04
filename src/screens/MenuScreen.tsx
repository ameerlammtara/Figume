import React from 'react';
import MainMenu from '../components/MainMenu';

interface MenuScreenProps {
  onPlay: () => void;
}

export default function MenuScreen({ onPlay }: MenuScreenProps) {
  return <MainMenu onPlay={onPlay} />;
}
