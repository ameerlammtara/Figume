import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vec2 } from '../../game/types';

interface Props {
  position: Vec2;
  health: number;
  maxHealth: number;
  radius: number;
  invincibleFrames: number;
  [key: string]: any;
}

export default function PlayerRenderer({ position, health, maxHealth, radius, invincibleFrames }: Props) {
  const size = radius * 2;
  const healthPct = Math.max(0, health / maxHealth);
  const healthColor = healthPct > 0.6 ? '#2ecc71' : healthPct > 0.3 ? '#f1c40f' : '#e74c3c';
  const isFlashing = invincibleFrames > 0 && Math.floor(invincibleFrames / 4) % 2 === 0;

  return (
    <View
      style={[
        styles.container,
        {
          left: position.x - radius,
          top: position.y - radius - 12,
          opacity: isFlashing ? 0.3 : 1,
        },
      ]}
    >
      <View style={[styles.healthBg, { width: size + 8 }]}>
        <View style={[styles.healthFill, { width: `${healthPct * 100}%`, backgroundColor: healthColor }]} />
      </View>
      <View style={[styles.aura, { width: size + 14, height: size + 14, borderRadius: (size + 14) / 2 }]} pointerEvents="none" />
      <View style={[styles.body, { width: size, height: size, borderRadius: radius }]}>
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        {/* Frost sword indicator */}
        <View style={styles.sword} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  healthBg: {
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 2,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    borderRadius: 3,
  },
  aura: {
    position: 'absolute',
    bottom: -7,
    backgroundColor: 'rgba(174,240,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(174,240,255,0.4)',
  },
  sword: {
    position: 'absolute',
    right: -10,
    top: '40%',
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#eafcff',
    borderWidth: 1,
    borderColor: '#7fd4f0',
  },
  body: {
    backgroundColor: '#4db8e8',
    borderWidth: 3,
    borderColor: '#2c80b4',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  eyeLeft: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
    marginHorizontal: 3,
  },
  eyeRight: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
    marginHorizontal: 3,
  },
});
