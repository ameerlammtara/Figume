import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vec2 } from '../../game/types';

interface Props {
  position: Vec2;
  angle?: number;
  lifetime: number;
  maxLifetime: number;
  [key: string]: any;
}

export default function SlashEffectRenderer({ position, angle, lifetime, maxLifetime }: Props) {
  const t = Math.max(0, lifetime / maxLifetime);
  const deg = ((angle ?? 0) * 180) / Math.PI;
  const size = 70;

  return (
    <View
      style={[
        styles.wrap,
        {
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
          opacity: t,
          transform: [{ rotate: `${deg}deg` }, { scale: 0.7 + (1 - t) * 0.5 }],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.crescent} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crescent: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: '#eafcff',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    shadowColor: '#aef0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});
