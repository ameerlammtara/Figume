import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ARENA_WIDTH, ARENA_HEIGHT } from '../../game/constants';

interface Props {
  lifetime: number;
  maxLifetime: number;
  [key: string]: any;
}

export default function FrostFlashRenderer({ lifetime, maxLifetime }: Props) {
  const t = Math.max(0, lifetime / maxLifetime);
  // Bright flash early, fading toward end of life
  const opacity = 0.15 + t * 0.55;

  return (
    <View style={[styles.fill, { opacity }]} pointerEvents="none">
      <Text style={styles.label}>ABSOLUTE ZERO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ARENA_WIDTH,
    height: ARENA_HEIGHT,
    backgroundColor: 'rgba(180,240,255,0.55)',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#0a3a55',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
