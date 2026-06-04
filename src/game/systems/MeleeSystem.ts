import { Entities, PlayerEntity, EnemyEntity } from '../types';
import {
  MELEE_RANGE,
  MELEE_DAMAGE,
  MELEE_ARC_DEG,
  SCORE_PER_GRUNT,
  SCORE_PER_SHOOTER,
  SCORE_PER_TANK,
  SIGNATURE_CHARGE_PER_KILL,
} from '../constants';
import { inputState } from '../inputState';
import { createSlash } from '../entities/Effect';

const SCORE_MAP: Record<string, number> = {
  grunt: SCORE_PER_GRUNT,
  shooter: SCORE_PER_SHOOTER,
  tank: SCORE_PER_TANK,
};

export function enemyScore(enemy: EnemyEntity): number {
  return SCORE_MAP[enemy.enemyType] || 10;
}

export function MeleeSystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const newEntities: Entities = { ...entities };
  const player: PlayerEntity = { ...entities.player };

  // Decrement melee cooldown
  if (player.meleeCooldown > 0) {
    player.meleeCooldown -= 1;
  }

  const wantsAttack = inputState.shoot.active || inputState.shoot.autoShoot;

  if (wantsAttack && player.meleeCooldown === 0) {
    player.meleeCooldown = player.meleeCooldownMax;

    const aimX = inputState.shoot.dirX;
    const aimY = inputState.shoot.dirY;
    const aimLen = Math.sqrt(aimX * aimX + aimY * aimY) || 1;
    const ax = aimX / aimLen;
    const ay = aimY / aimLen;
    const arcCos = Math.cos((MELEE_ARC_DEG * Math.PI) / 180);

    let score = newEntities.gameState.score;
    let charge = player.signatureCharge;

    Object.keys(entities).forEach((key) => {
      const enemy = entities[key];
      if (!enemy || enemy.type !== 'enemy' || !newEntities[key]) return;

      const dx = enemy.position.x - player.position.x;
      const dy = enemy.position.y - player.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > MELEE_RANGE + enemy.radius) return;

      // Within arc: dot product of aim vs direction-to-enemy
      const elen = dist || 1;
      const dot = (dx / elen) * ax + (dy / elen) * ay;
      if (dot < arcCos) return;

      const updated: EnemyEntity = { ...newEntities[key] };
      updated.health -= MELEE_DAMAGE;
      if (updated.health <= 0) {
        score += enemyScore(updated);
        charge = Math.min(100, charge + SIGNATURE_CHARGE_PER_KILL);
        delete newEntities[key];
      } else {
        newEntities[key] = updated;
      }
    });

    player.signatureCharge = charge;
    newEntities.gameState = { ...newEntities.gameState, score };

    // Spawn a slash effect toward aim
    const slashId = `slash_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const slash = createSlash(
      player.position.x + ax * (player.radius + 8),
      player.position.y + ay * (player.radius + 8),
      Math.atan2(ay, ax)
    );
    slash.id = slashId;
    newEntities[slashId] = slash;
  }

  newEntities.player = player;
  return newEntities;
}
