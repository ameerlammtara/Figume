import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HUDProps {
  health: number;
  maxHealth: number;
  wave: number;
  score: number;
  waveActive: boolean;
  waveDelay: number;
}

export default function HUD({ health, maxHealth, wave, score, waveActive, waveDelay }: HUDProps) {
  const healthPct = Math.max(0, health / maxHealth);
  const healthColor = healthPct > 0.6 ? '#2ecc71' : healthPct > 0.3 ? '#f1c40f' : '#e74c3c';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top bar */}
      <View style={styles.topBar}>
        {/* Health */}
        <View style={styles.healthSection}>
          <Text style={styles.labelText}>HP</Text>
          <View style={styles.healthBarBg}>
            <View
              style={[
                styles.healthBarFill,
                { width: `${healthPct * 100}%`, backgroundColor: healthColor },
              ]}
            />
          </View>
          <Text style={styles.healthText}>{Math.ceil(health)}</Text>
        </View>

        {/* Wave */}
        <View style={styles.waveSection}>
          <Text style={styles.waveLabel}>WAVE</Text>
          <Text style={styles.waveNumber}>{wave}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.labelText}>SCORE</Text>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Wave announcement */}
      {!waveActive && waveDelay > 0 && (
        <View style={styles.waveBanner}>
          <Text style={styles.waveBannerText}>
            Wave {wave + 1} incoming...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    width: '100%',
    justifyContent: 'space-between',
  },
  healthSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  labelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  healthBarBg: {
    flex: 1,
    height: 14,
    backgroundColor: '#333',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    maxWidth: 100,
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 7,
  },
  healthText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'right',
  },
  waveSection: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  waveLabel: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  waveNumber: {
    color: '#f1c40f',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },
  scoreSection: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  scoreText: {
    color: '#f1c40f',
    fontSize: 18,
    fontWeight: '900',
  },
  waveBanner: {
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1c40f',
  },
  waveBannerText: {
    color: '#f1c40f',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
