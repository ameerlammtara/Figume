import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  GestureResponderEvent,
  TouchableOpacity,
  Text,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { ARENA_WIDTH, ARENA_HEIGHT } from '../game/constants';
import { GameState, PlayerEntity } from '../game/types';
import { createPlayer } from '../game/entities/Player';
import { resetEnemyIdCounter } from '../game/entities/Enemy';
import { resetBulletIdCounter } from '../game/entities/Bullet';
import { resetEffectIdCounter } from '../game/entities/Effect';
import { MovementSystem } from '../game/systems/MovementSystem';
import { AISystem } from '../game/systems/AISystem';
import { BulletSystem } from '../game/systems/BulletSystem';
import { CollisionSystem } from '../game/systems/CollisionSystem';
import { WaveSystem } from '../game/systems/WaveSystem';
import { MeleeSystem } from '../game/systems/MeleeSystem';
import { AbilitySystem } from '../game/systems/AbilitySystem';
import { EffectSystem } from '../game/systems/EffectSystem';
import { SyncSystem } from '../game/systems/SyncSystem';
import { inputState, outputState } from '../game/inputState';
import Joystick from './Joystick';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';

const ALL_SYSTEMS = [
  MovementSystem,
  AISystem,
  MeleeSystem,
  AbilitySystem,
  BulletSystem,
  CollisionSystem,
  EffectSystem,
  WaveSystem,
  SyncSystem,
];

function buildInitialEntities() {
  resetEnemyIdCounter();
  resetBulletIdCounter();
  resetEffectIdCounter();

  // Reset input
  inputState.joystick.active = false;
  inputState.joystick.dx = 0;
  inputState.joystick.dy = 0;
  inputState.shoot.active = false;
  inputState.shoot.dirX = 0;
  inputState.shoot.dirY = 1;
  inputState.abilityB = false;
  inputState.abilityA = false;
  inputState.abilitySignature = false;

  // Reset output
  outputState.health = 100;
  outputState.maxHealth = 100;
  outputState.wave = 0;
  outputState.score = 0;
  outputState.waveActive = false;
  outputState.waveDelay = 60;
  outputState.gameOver = false;
  outputState.blinkCd = 0;
  outputState.glacierCd = 0;
  outputState.signatureCharge = 0;

  return {
    gameState: {
      type: 'gameState',
      wave: 0,
      score: 0,
      gameOver: false,
      waveDelay: 60,
      waveActive: false,
      enemiesSpawnedThisWave: 0,
      totalEnemiesThisWave: 0,
    } as GameState,
    player: createPlayer(ARENA_WIDTH / 2, ARENA_HEIGHT / 2),
  };
}

interface GameCanvasProps {
  onMenu: () => void;
}

export default function GameCanvas({ onMenu }: GameCanvasProps) {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const scale = Math.min(screenW / ARENA_WIDTH, screenH / ARENA_HEIGHT);
  const arenaDisplayW = ARENA_WIDTH * scale;
  const arenaDisplayH = ARENA_HEIGHT * scale;
  const arenaOffsetX = (screenW - arenaDisplayW) / 2;
  const arenaOffsetY = (screenH - arenaDisplayH) / 2;

  const [gameKey, setGameKey] = useState(0);
  const [autoShoot, setAutoShoot] = useState(false);
  const [hudState, setHudState] = useState({
    health: 100, maxHealth: 100, wave: 0, score: 0, waveActive: false, waveDelay: 0,
  });
  const [abilityState, setAbilityState] = useState({
    blinkCd: 0, blinkCdMax: 300, glacierCd: 0, glacierCdMax: 600, signatureCharge: 0,
  });
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave, setFinalWave] = useState(0);

  const autoShootRef = useRef(false);
  const playerPosRef = useRef({ x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 });
  const scaleRef = useRef(scale);
  const arenaOffsetXRef = useRef(arenaOffsetX);
  const arenaOffsetYRef = useRef(arenaOffsetY);
  scaleRef.current = scale;
  arenaOffsetXRef.current = arenaOffsetX;
  arenaOffsetYRef.current = arenaOffsetY;

  // Poll outputState for HUD ~10 times/second
  useEffect(() => {
    const interval = setInterval(() => {
      if (outputState.gameOver && !gameOver) {
        setFinalScore(outputState.score);
        setFinalWave(outputState.wave);
        setGameOver(true);
      }
      setHudState({
        health: outputState.health,
        maxHealth: outputState.maxHealth,
        wave: outputState.wave,
        score: outputState.score,
        waveActive: outputState.waveActive,
        waveDelay: outputState.waveDelay,
      });
      setAbilityState({
        blinkCd: outputState.blinkCd,
        blinkCdMax: outputState.blinkCdMax,
        glacierCd: outputState.glacierCd,
        glacierCdMax: outputState.glacierCdMax,
        signatureCharge: outputState.signatureCharge,
      });
    }, 80);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Track player position from outputState so shoot direction is accurate
  // We need player pos — store it in outputState via SyncSystem
  const handleJoystickMove = useCallback((dx: number, dy: number) => {
    inputState.joystick.active = true;
    inputState.joystick.dx = dx;
    inputState.joystick.dy = dy;
  }, []);

  const handleJoystickRelease = useCallback(() => {
    inputState.joystick.active = false;
    inputState.joystick.dx = 0;
    inputState.joystick.dy = 0;
  }, []);

  const computeShootDir = useCallback((px: number, py: number) => {
    const arenaX = (px - arenaOffsetXRef.current) / scaleRef.current;
    const arenaY = (py - arenaOffsetYRef.current) / scaleRef.current;
    const dx = arenaX - outputState.playerX;
    const dy = arenaY - outputState.playerY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 5) {
      inputState.shoot.dirX = dx / len;
      inputState.shoot.dirY = dy / len;
    }
  }, []);

  const handleShootStart = useCallback((e: GestureResponderEvent) => {
    inputState.shoot.active = true;
    computeShootDir(e.nativeEvent.pageX, e.nativeEvent.pageY);
    return true;
  }, [computeShootDir]);

  const handleShootMove = useCallback((e: GestureResponderEvent) => {
    computeShootDir(e.nativeEvent.pageX, e.nativeEvent.pageY);
  }, [computeShootDir]);

  const handleShootEnd = useCallback(() => {
    inputState.shoot.active = false;
  }, []);

  const toggleAutoShoot = useCallback(() => {
    const next = !autoShootRef.current;
    autoShootRef.current = next;
    inputState.shoot.autoShoot = next;
    setAutoShoot(next);
  }, []);

  const triggerBlink = useCallback(() => {
    inputState.abilityB = true;
  }, []);
  const triggerGlacier = useCallback(() => {
    inputState.abilityA = true;
  }, []);
  const triggerSignature = useCallback(() => {
    inputState.abilitySignature = true;
  }, []);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setGameKey((k) => k + 1);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: '#0a150a' }]}>
      {/* Grass background behind arena */}
      <View
        style={[
          styles.arenaOuter,
          {
            left: arenaOffsetX,
            top: arenaOffsetY,
            width: arenaDisplayW,
            height: arenaDisplayH,
            backgroundColor: '#2d5a1b',
          },
        ]}
        pointerEvents="none"
      />

      {/* GameEngine (scaled) */}
      <View
        style={[
          styles.arenaOuter,
          {
            left: arenaOffsetX,
            top: arenaOffsetY,
            width: arenaDisplayW,
            height: arenaDisplayH,
            overflow: 'hidden',
          },
        ]}
        pointerEvents="none"
      >
        <View
          style={{
            width: ARENA_WIDTH,
            height: ARENA_HEIGHT,
            transform: [{ scale }],
            transformOrigin: 'top left' as any,
          }}
        >
          <GameEngine
            key={gameKey}
            style={styles.gameEngine}
            systems={ALL_SYSTEMS}
            entities={buildInitialEntities()}
            running={!gameOver}
          />
        </View>
        {/* Border overlay */}
        <View style={styles.arenaBorder} pointerEvents="none" />
      </View>

      {/* HUD */}
      <HUD
        health={hudState.health}
        maxHealth={hudState.maxHealth}
        wave={hudState.wave}
        score={hudState.score}
        waveActive={hudState.waveActive}
        waveDelay={hudState.waveDelay}
      />

      {/* Controls */}
      <View style={styles.controls} pointerEvents="box-none">
        <View style={styles.leftControl}>
          <Joystick onMove={handleJoystickMove} onRelease={handleJoystickRelease} />
        </View>

        <View
          style={styles.rightControl}
          onStartShouldSetResponder={() => true}
          onResponderGrant={handleShootStart}
          onResponderMove={handleShootMove}
          onResponderRelease={handleShootEnd}
          onResponderTerminate={handleShootEnd}
        >
          <TouchableOpacity
            style={[styles.autoShootBtn, autoShoot && styles.autoShootActive]}
            onPress={toggleAutoShoot}
            activeOpacity={0.8}
          >
            <Text style={styles.autoShootText}>{autoShoot ? 'AUTO ✓' : 'AUTO'}</Text>
          </TouchableOpacity>
          <View style={styles.shootBtn}>
            <Text style={styles.shootBtnText}>🗡️</Text>
          </View>
        </View>

        {/* Ability buttons column (above the aim responder) */}
        <View style={styles.abilityColumn} pointerEvents="box-none">
          <TouchableOpacity style={styles.abilityBtn} onPress={triggerBlink} activeOpacity={0.8}>
            <Text style={styles.abilityIcon}>⚡</Text>
            <Text style={styles.abilityLabel}>BLINK</Text>
            {abilityState.blinkCd > 0 && (
              <View style={styles.cdOverlay}>
                <Text style={styles.cdText}>{Math.ceil(abilityState.blinkCd / 60)}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.abilityBtn} onPress={triggerGlacier} activeOpacity={0.8}>
            <Text style={styles.abilityIcon}>❄️</Text>
            <Text style={styles.abilityLabel}>GLACIER</Text>
            {abilityState.glacierCd > 0 && (
              <View style={styles.cdOverlay}>
                <Text style={styles.cdText}>{Math.ceil(abilityState.glacierCd / 60)}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signatureBtn, abilityState.signatureCharge >= 100 && styles.signatureReady]}
            onPress={triggerSignature}
            activeOpacity={0.8}
            disabled={abilityState.signatureCharge < 100}
          >
            <Text style={styles.abilityIcon}>🌟</Text>
            <Text style={styles.signatureLabel}>
              {abilityState.signatureCharge >= 100 ? 'ABSOLUTE ZERO' : `${Math.floor(abilityState.signatureCharge)}%`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Over */}
      {gameOver && (
        <GameOverScreen
          score={finalScore}
          wave={finalWave}
          onRestart={handleRestart}
          onMenu={onMenu}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  arenaOuter: {
    position: 'absolute',
  },
  arenaBorder: {
    ...StyleSheet.absoluteFill,
    borderWidth: 8,
    borderColor: '#6b3a2a',
  },
  gameEngine: {
    width: ARENA_WIDTH,
    height: ARENA_HEIGHT,
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    flexDirection: 'row',
  },
  leftControl: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  rightControl: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 10,
  },
  autoShootBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  autoShootActive: {
    backgroundColor: 'rgba(231,76,60,0.5)',
    borderColor: '#e74c3c',
  },
  autoShootText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  shootBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(231,76,60,0.4)',
    borderWidth: 3,
    borderColor: 'rgba(231,76,60,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shootBtnText: {
    fontSize: 28,
  },
  abilityColumn: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    gap: 8,
    alignItems: 'center',
  },
  abilityBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(45,128,180,0.45)',
    borderWidth: 2,
    borderColor: '#7fd4f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  abilityIcon: {
    fontSize: 20,
  },
  abilityLabel: {
    color: '#eafcff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cdOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cdText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  signatureBtn: {
    minWidth: 70,
    paddingHorizontal: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(80,80,90,0.5)',
    borderWidth: 2,
    borderColor: 'rgba(180,180,200,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureReady: {
    backgroundColor: 'rgba(174,240,255,0.55)',
    borderColor: '#ffffff',
    shadowColor: '#aef0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  signatureLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
