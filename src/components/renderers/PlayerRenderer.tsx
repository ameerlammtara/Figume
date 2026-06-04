import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlayerEntity } from '../../game/types';

interface Props {
  entity: PlayerEntity;
}

export default function PlayerRenderer({ entity }: Props) {
  const { position, health, maxHealth, radius, invincibleFrames } = entity;
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
          top: position.y - radius,
          width: size,
          height: size,
          opacity: isFlashing ? 0.3 : 1,
        },
      ]}
    >
      {/* Health bar background */}
      <View style={styles.healthBg}>
        <View style={[styles.healthFill, { width: `${healthPct * 100}%`, backgroundColor: healthColor }]} />
      </View>
      {/* Player body */}
      <View style={[styles.body, { width: size, height: size, borderRadius: radius }]}>
        {/* Eye highlights */}
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
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
    width: 44,
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
  body: {
    backgroundColor: '#3498db',
    borderWidth: 3,
    borderColor: '#2980b9',
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
