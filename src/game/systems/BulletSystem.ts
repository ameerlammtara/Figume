import { Entities, BulletEntity } from '../types';
import { ARENA_WIDTH, ARENA_HEIGHT } from '../constants';

export function BulletSystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const newEntities: Entities = { ...entities };

  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (!entity || entity.type !== 'bullet') return;

    const bullet: BulletEntity = entity;
    const newLifetime = bullet.lifetime - 1;

    // Remove if dead or out of bounds
    if (
      newLifetime <= 0 ||
      bullet.position.x < -20 ||
      bullet.position.x > ARENA_WIDTH + 20 ||
      bullet.position.y < -20 ||
      bullet.position.y > ARENA_HEIGHT + 20
    ) {
      delete newEntities[key];
      return;
    }

    newEntities[key] = {
      ...bullet,
      lifetime: newLifetime,
      position: {
        x: bullet.position.x + bullet.velocity.x,
        y: bullet.position.y + bullet.velocity.y,
      },
    };
  });

  return newEntities;
}
