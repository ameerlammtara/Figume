import { Entities, GameState, PlayerEntity } from '../types';
import { outputState } from '../inputState';

export function SyncSystem(entities: Entities): Entities {
  const gs: GameState = entities.gameState;
  const player: PlayerEntity = entities.player;
  if (gs) {
    outputState.wave = gs.wave;
    outputState.score = gs.score;
    outputState.waveActive = gs.waveActive;
    outputState.waveDelay = gs.waveDelay;
    outputState.gameOver = gs.gameOver;
  }
  if (player) {
    outputState.health = player.health;
    outputState.maxHealth = player.maxHealth;
    outputState.playerX = player.position.x;
    outputState.playerY = player.position.y;
  }
  return entities;
}
