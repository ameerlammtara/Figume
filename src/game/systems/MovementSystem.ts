import { Entities, PlayerEntity, EnemyEntity } from '../types';
import { ARENA_WIDTH, ARENA_HEIGHT } from '../constants';
import { inputState } from '../inputState';

export function MovementSystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const player: PlayerEntity = entities.player;

  // Move player based on joystick
  if (inputState.joystick.active) {
    const newX = player.position.x + inputState.joystick.dx * player.speed;
    const newY = player.position.y + inputState.joystick.dy * player.speed;
    player.position = {
      x: Math.max(player.radius, Math.min(ARENA_WIDTH - player.radius, newX)),
      y: Math.max(player.radius, Math.min(ARENA_HEIGHT - player.radius, newY)),
    };
  }

  // Decrement invincibility frames
  if (player.invincibleFrames > 0) {
    player.invincibleFrames -= 1;
  }

  // Move enemies
  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (entity && entity.type === 'enemy') {
      const enemy = entity as EnemyEntity;
      // Frozen enemies don't move; tick down their frozen timer
      if (enemy.frozenFrames > 0) {
        enemy.frozenFrames -= 1;
        return;
      }
      const newX = Math.max(
        enemy.radius,
        Math.min(ARENA_WIDTH - enemy.radius, enemy.position.x + enemy.velocity.x)
      );
      const newY = Math.max(
        enemy.radius,
        Math.min(ARENA_HEIGHT - enemy.radius, enemy.position.y + enemy.velocity.y)
      );
      enemy.position = { x: newX, y: newY };
    }
  });

  return entities;
}
