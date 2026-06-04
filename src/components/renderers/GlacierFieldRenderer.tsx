import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vec2 } from '../../game/types';

interface Props {
  position: Vec2;
  radius?: number;
  lifetime: number;
  maxLifetime: number;
  [key: string]: any;
}

export default function GlacierFieldRenderer({ position, radius, lifetime, maxLifetime }: Props) {
  const r = radius ?? 70;
  const size = r * 2;
  const t = Math.max(0, lifetime / maxLifetime);
  // Pulse: subtle scale oscillation, fade out near end of life
  const pulse = 1 + Math.sin(lifetime * 0.4) * 0.04;
  const fade = t < 0.25 ? t / 0.25 : 1;

  return (
    <View
      style={[
        styles.field,
        {
          left: position.x - r,
          top: position.y - r,
          width: size,
          height: size,
          borderRadius: r,
          opacity: fade,
          transform: [{ scale: pulse }],
        },
      ]}
      pointerEvents="none"
    >
      <View style={[styles.inner, { borderRadius: r }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    position: 'absolute',
    backgroundColor: 'rgba(174,240,255,0.28)',
    borderWidth: 3,
    borderColor: 'rgba(140,210,245,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#aef0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  inner: {
    width: '70%',
    height: '70%',
    backgroundColor: 'rgba(220,250,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
