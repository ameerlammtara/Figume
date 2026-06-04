import { Entities, PlayerEntity, EnemyEntity, BulletEntity } from '../types';
import {
  PLAYER_INVINCIBLE_FRAMES,
  SCORE_PER_GRUNT, SCORE_PER_SHOOTER, SCORE_PER_TANK,
} from '../constants';

function circlesOverlap(
  ax: number, ay: number, ar: number,
  bx: number, by: number, br: number
): boolean {
  const dx = ax - bx;
  const dy = ay - by;
  const distSq = dx * dx + dy * dy;
  const minDist = ar + br;
  return distSq < minDist * minDist;
}

const SCORE_MAP: Record<string, number> = {
  grunt: SCORE_PER_GRUNT,
  shooter: SCORE_PER_SHOOTER,
  tank: SCORE_PER_TANK,
};

export function CollisionSystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const newEntities: Entities = { ...entities };
  const player: PlayerEntity = { ...entities.player };
  let score = gameState.score;

  const bulletKeys = Object.keys(entities).filter((k) => entities[k]?.type === 'bullet');
  const enemyKeys = Object.keys(entities).filter((k) => entities[k]?.type === 'enemy');

  // Player bullets vs enemies
  bulletKeys.forEach((bKey) => {
    const bullet: BulletEntity = entities[bKey];
    if (!bullet || bullet.owner !== 'player') return;

    enemyKeys.forEach((eKey) => {
      const enemy: EnemyEntity = entities[eKey];
      if (!enemy || !newEntities[eKey] || !newEntities[bKey]) return;

      if (
        circlesOverlap(
          bullet.position.x, bullet.position.y, bullet.radius,
          enemy.position.x, enemy.position.y, enemy.radius
        )
      ) {
        const updatedEnemy: EnemyEntity = { ...newEntities[eKey] };
        updatedEnemy.health -= bullet.damage;

        if (updatedEnemy.health <= 0) {
          score += SCORE_MAP[updatedEnemy.enemyType] || 10;
          delete newEntities[eKey];
        } else {
          newEntities[eKey] = updatedEnemy;
        }

        delete newEntities[bKey];
      }
    });
  });

  // Enemy bullets vs player
  bulletKeys.forEach((bKey) => {
    const bullet: BulletEntity = entities[bKey];
    if (!bullet || bullet.owner !== 'enemy') return;
    if (!newEntities[bKey]) return;
    if (player.invincibleFrames > 0) return;

    if (
      circlesOverlap(
        bullet.position.x, bullet.position.y, bullet.radius,
        player.position.x, player.position.y, player.radius
      )
    ) {
      player.health -= bullet.damage;
      player.invincibleFrames = PLAYER_INVINCIBLE_FRAMES;
      delete newEntities[bKey];
    }
  });

  // Enemies vs player melee
  enemyKeys.forEach((eKey) => {
    const enemy: EnemyEntity = newEntities[eKey];
    if (!enemy) return;
    if (player.invincibleFrames > 0) return;

    if (
      circlesOverlap(
        enemy.position.x, enemy.position.y, enemy.radius,
        player.position.x, player.position.y, player.radius
      )
    ) {
      if (enemy.attackRange === 0) {
        // Melee enemy
        player.health -= enemy.damage * 0.05; // damage per frame during overlap
        player.invincibleFrames = 8;
      }
    }
  });

  // Push overlapping enemies apart
  for (let i = 0; i < enemyKeys.length; i++) {
    for (let j = i + 1; j < enemyKeys.length; j++) {
      const eA: EnemyEntity = newEntities[enemyKeys[i]];
      const eB: EnemyEntity = newEntities[enemyKeys[j]];
      if (!eA || !eB) continue;

      const dx = eA.position.x - eB.position.x;
      const dy = eA.position.y - eB.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = eA.radius + eB.radius;

      if (dist < minDist && dist > 0) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        newEntities[enemyKeys[i]] = {
          ...eA,
          position: {
            x: eA.position.x + nx * overlap,
            y: eA.position.y + ny * overlap,
          },
        };
        newEntities[enemyKeys[j]] = {
          ...eB,
          position: {
            x: eB.position.x - nx * overlap,
            y: eB.position.y - ny * overlap,
          },
        };
      }
    }
  }

  // Check game over
  if (player.health <= 0) {
    player.health = 0;
    newEntities.gameState = { ...gameState, score, gameOver: true };
  } else {
    newEntities.gameState = { ...gameState, score };
  }

  newEntities.player = player;
  return newEntities;
}
