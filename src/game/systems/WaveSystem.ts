import { Entities, GameState, EnemyType } from '../types';
import { createEnemy } from '../entities/Enemy';
import { ARENA_WIDTH, ARENA_HEIGHT, WAVE_DELAY_FRAMES } from '../constants';

interface WaveConfig {
  grunt: number;
  shooter: number;
  tank: number;
}

function getWaveConfig(wave: number): WaveConfig {
  const base = wave - 1;
  return {
    grunt: 3 + base,
    shooter: wave >= 2 ? wave - 1 : 0,
    tank: wave >= 4 ? Math.floor((wave - 1) / 3) : 0,
  };
}

function getSpawnPosition(index: number, total: number): { x: number; y: number } {
  const margin = 40;
  const positions = [
    { x: margin, y: margin },
    { x: ARENA_WIDTH - margin, y: margin },
    { x: ARENA_WIDTH / 2, y: margin },
    { x: margin, y: ARENA_HEIGHT * 0.3 },
    { x: ARENA_WIDTH - margin, y: ARENA_HEIGHT * 0.3 },
    { x: margin, y: ARENA_HEIGHT * 0.15 },
    { x: ARENA_WIDTH - margin, y: ARENA_HEIGHT * 0.15 },
    { x: ARENA_WIDTH * 0.33, y: margin },
    { x: ARENA_WIDTH * 0.66, y: margin },
  ];
  const idx = index % positions.length;
  return positions[idx];
}

export function WaveSystem(entities: Entities): Entities {
  const gameState: GameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const newEntities: Entities = { ...entities };
  const gs = { ...gameState };

  // Count alive enemies
  const enemyCount = Object.keys(entities).filter(
    (k) => entities[k]?.type === 'enemy'
  ).length;

  if (gs.waveActive) {
    // Wave is running — wait for all enemies to be defeated
    if (enemyCount === 0) {
      // All dead — start delay for next wave
      gs.waveActive = false;
      gs.waveDelay = WAVE_DELAY_FRAMES;
    }
  } else {
    // Between waves
    if (gs.waveDelay > 0) {
      gs.waveDelay -= 1;
    } else {
      // Spawn next wave
      const nextWave = gs.wave + 1;
      const config = getWaveConfig(nextWave);
      const spawnList: EnemyType[] = [
        ...Array(config.grunt).fill('grunt' as EnemyType),
        ...Array(config.shooter).fill('shooter' as EnemyType),
        ...Array(config.tank).fill('tank' as EnemyType),
      ];
      spawnList.forEach((type, i) => {
        const pos = getSpawnPosition(i, spawnList.length);
        const id = `enemy_wave${nextWave}_${i}`;
        newEntities[id] = createEnemy(type, pos.x, pos.y);
        newEntities[id].id = id;
      });
      gs.wave = nextWave;
      gs.waveActive = true;
      gs.totalEnemiesThisWave = spawnList.length;
      gs.enemiesSpawnedThisWave = spawnList.length;
    }
  }

  newEntities.gameState = gs;
  return newEntities;
}
