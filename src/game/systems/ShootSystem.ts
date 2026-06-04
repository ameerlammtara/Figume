import { Entities, PlayerEntity } from '../types';
import { createBullet } from '../entities/Bullet';
import { PLAYER_BULLET_SPEED } from '../constants';
import { inputState } from '../inputState';

export function ShootSystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const newEntities: Entities = { ...entities };
  const player: PlayerEntity = { ...entities.player };

  // Decrement shoot cooldown
  if (player.shootCooldown > 0) {
    player.shootCooldown -= 1;
  }

  const shouldShoot =
    (inputState.shoot.active || inputState.shoot.autoShoot) &&
    player.shootCooldown === 0;

  if (shouldShoot) {
    const dirX = inputState.shoot.dirX;
    const dirY = inputState.shoot.dirY;
    const spawnX = player.position.x + dirX * (player.radius + 10);
    const spawnY = player.position.y + dirY * (player.radius + 10);
    const bulletId = `bp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    newEntities[bulletId] = createBullet(
      'player',
      spawnX,
      spawnY,
      dirX * PLAYER_BULLET_SPEED,
      dirY * PLAYER_BULLET_SPEED
    );
    newEntities[bulletId].id = bulletId;
    player.shootCooldown = player.shootCooldownMax;
  }

  newEntities.player = player;
  return newEntities;
}
