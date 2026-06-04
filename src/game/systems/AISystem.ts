import { Entities, EnemyEntity, PlayerEntity } from '../types';
import { createBullet } from '../entities/Bullet';
import { SHOOTER_BULLET_SPEED, SHOOTER_ATTACK_RANGE } from '../constants';

function normalize(dx: number, dy: number): { x: number; y: number } {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: dx / len, y: dy / len };
}

export function AISystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const player: PlayerEntity = entities.player;
  const newEntities: Entities = { ...entities };

  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (!entity || entity.type !== 'enemy') return;

    const enemy: EnemyEntity = { ...entity };
    const dx = player.position.x - enemy.position.x;
    const dy = player.position.y - enemy.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dir = normalize(dx, dy);

    // Decrement shoot cooldown
    if (enemy.shootCooldown > 0) {
      enemy.shootCooldown -= 1;
    }

    if (enemy.enemyType === 'shooter') {
      // Shooter: keep distance, shoot at player
      if (dist > SHOOTER_ATTACK_RANGE * 0.5) {
        // Move toward player
        enemy.velocity = { x: dir.x * enemy.speed, y: dir.y * enemy.speed };
      } else if (dist < SHOOTER_ATTACK_RANGE * 0.3) {
        // Back away
        enemy.velocity = { x: -dir.x * enemy.speed * 0.7, y: -dir.y * enemy.speed * 0.7 };
      } else {
        // Stay put, strafe slightly
        enemy.velocity = { x: dir.y * enemy.speed * 0.3, y: -dir.x * enemy.speed * 0.3 };
      }

      // Shoot at player if in range and cooled down
      if (dist < SHOOTER_ATTACK_RANGE && enemy.shootCooldown === 0) {
        enemy.shootCooldown = enemy.shootCooldownMax;
        const bulletId = `bullet_enemy_${enemy.id}_${Date.now()}`;
        const spawnX = enemy.position.x + dir.x * (enemy.radius + 8);
        const spawnY = enemy.position.y + dir.y * (enemy.radius + 8);
        newEntities[bulletId] = createBullet(
          'enemy',
          spawnX,
          spawnY,
          dir.x * SHOOTER_BULLET_SPEED,
          dir.y * SHOOTER_BULLET_SPEED
        );
        // Update id of the newly created bullet
        newEntities[bulletId].id = bulletId;
      }
    } else {
      // Grunt and Tank: chase player directly
      enemy.velocity = { x: dir.x * enemy.speed, y: dir.y * enemy.speed };
    }

    newEntities[key] = enemy;
  });

  return newEntities;
}
