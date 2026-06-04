import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vec2, EnemyType } from '../../game/types';

interface Props {
  position: Vec2;
  health: number;
  maxHealth: number;
  radius: number;
  enemyType: EnemyType;
  frozenFrames?: number;
  [key: string]: any;
}

const ENEMY_COLORS: Record<string, { bg: string; border: string }> = {
  grunt: { bg: '#e74c3c', border: '#c0392b' },
  shooter: { bg: '#e67e22', border: '#d35400' },
  tank: { bg: '#922b21', border: '#6e1f19' },
};

export default function EnemyRenderer({ position, health, maxHealth, radius, enemyType, frozenFrames }: Props) {
  const size = radius * 2;
  const isFrozen = (frozenFrames ?? 0) > 0;
  const healthPct = Math.max(0, health / maxHealth);
  const healthColor = healthPct > 0.6 ? '#2ecc71' : healthPct > 0.3 ? '#f1c40f' : '#e74c3c';
  const colors = ENEMY_COLORS[enemyType] || ENEMY_COLORS.grunt;
  const isSquare = enemyType === 'shooter';

  return (
    <View
      style={[
        styles.container,
        {
          left: position.x - radius,
          top: position.y - radius - 12,
        },
      ]}
    >
      <View style={[styles.healthBg, { width: size + 8 }]}>
        <View style={[styles.healthFill, { width: `${healthPct * 100}%`, backgroundColor: healthColor }]} />
      </View>
      <View
        style={[
          styles.body,
          {
            width: size,
            height: size,
            borderRadius: isSquare ? 4 : radius,
            backgroundColor: colors.bg,
            borderColor: isFrozen ? '#bfe9ff' : colors.border,
          },
        ]}
      >
        <View style={styles.eyeRow}>
          <View style={[styles.eye, enemyType === 'tank' && styles.eyeLarge]} />
          <View style={[styles.eye, enemyType === 'tank' && styles.eyeLarge]} />
        </View>
        {isFrozen && (
          <View
            style={[
              styles.frostOverlay,
              { borderRadius: isSquare ? 4 : radius },
            ]}
            pointerEvents="none"
          />
        )}
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
    backgroundColor: '#222',
    borderRadius: 3,
    marginBottom: 2,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    borderRadius: 3,
  },
  body: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 5,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  eyeLarge: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  frostOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(174,240,255,0.5)',
    borderWidth: 2,
    borderColor: '#aef0ff',
  },
});
