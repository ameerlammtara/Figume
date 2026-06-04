import { Entities, PlayerEntity, EnemyEntity, JoystickState } from '../types';
import { ARENA_WIDTH, ARENA_HEIGHT } from '../constants';

export function MovementSystem(entities: Entities, { time }: { time: any }): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const joystick: JoystickState = entities.joystickState;
  const player: PlayerEntity = entities.player;

  // Move player based on joystick
  if (joystick.active) {
    const newX = player.position.x + joystick.direction.x * player.speed;
    const newY = player.position.y + joystick.direction.y * player.speed;

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
