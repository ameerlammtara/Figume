import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BulletEntity } from '../../game/types';

interface Props {
  entity: BulletEntity;
}

export default function BulletRenderer({ entity }: Props) {
  const { position, radius, owner } = entity;
  const size = radius * 2;
  const color = owner === 'player' ? '#f1c40f' : '#ff6b6b';
  const borderColor = owner === 'player' ? '#e67e22' : '#c0392b';

  return (
    <View
      style={[
        styles.bullet,
        {
          left: position.x - radius,
          top: position.y - radius,
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: color,
          borderColor,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bullet: {
    position: 'absolute',
    borderWidth: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
});
