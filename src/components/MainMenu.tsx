import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

interface MainMenuProps {
  onPlay: () => void;
}

export default function MainMenu({ onPlay }: MainMenuProps) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background decoration circles */}
      <View style={[styles.bgCircle, { top: -80, left: -60, width: 220, height: 220 }]} />
      <View style={[styles.bgCircle2, { bottom: -60, right: -40, width: 180, height: 180 }]} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <View style={styles.playerIcon} />
          </View>
          <Text style={styles.title}>FIGUME</Text>
          <Text style={styles.subtitle}>WAVE SHOOTER</Text>
        </View>

        {/* Enemy showcase */}
        <View style={styles.enemyShowcase}>
          <View style={[styles.enemyDot, { backgroundColor: '#e74c3c', width: 36, height: 36, borderRadius: 18 }]} />
          <View style={[styles.enemyDot, { backgroundColor: '#e67e22', width: 36, height: 36, borderRadius: 4 }]} />
          <View style={[styles.enemyDot, { backgroundColor: '#922b21', width: 50, height: 50, borderRadius: 25 }]} />
        </View>

        <Text style={styles.enemyLabel}>Grunt · Shooter · Tank</Text>

        {/* How to play */}
        <View style={styles.howToPlay}>
          <Text style={styles.howTitle}>HOW TO PLAY</Text>
          <Text style={styles.howText}>🕹 Left joystick to move</Text>
          <Text style={styles.howText}>👆 Tap right side to shoot</Text>
          <Text style={styles.howText}>💀 Survive waves of enemies!</Text>
        </View>

        {/* Play button */}
        <TouchableOpacity style={styles.playBtn} onPress={onPlay} activeOpacity={0.8}>
          <Text style={styles.playText}>▶  PLAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a',
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 110,
    backgroundColor: 'rgba(52,152,219,0.12)',
  },
  bgCircle2: {
    position: 'absolute',
    borderRadius: 90,
    backgroundColor: 'rgba(231,76,60,0.1)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  logoSection: {
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(52,152,219,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3498db',
    marginBottom: 8,
  },
  playerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3498db',
    borderWidth: 3,
    borderColor: '#2980b9',
  },
  title: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: '#3498db',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 4,
  },
  enemyShowcase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  enemyDot: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  enemyLabel: {
    color: '#aaa',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: -10,
  },
  howToPlay: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  howTitle: {
    color: '#f1c40f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  howText: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
  },
  playBtn: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 60,
    marginTop: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  playText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
