import { Entities, EffectEntity, EnemyEntity } from '../types';
import { GLACIER_FREEZE_REFRESH } from '../constants';
import { enemyScore } from './MeleeSystem';
import { SIGNATURE_CHARGE_PER_KILL } from '../constants';

export function EffectSystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) return entities;

  const newEntities: Entities = { ...entities };
  const player = { ...newEntities.player };
  let score = newEntities.gameState.score;

  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (!entity || entity.type !== 'effect') return;

    const effect: EffectEntity = { ...entity };

    // Glacier field: freeze + tick damage enemies in radius
    if (effect.effectKind === 'glacier' && effect.lifetime > 0) {
      const r = effect.radius ?? 70;
      const tick = effect.tickDamage ?? 0;
      Object.keys(newEntities).forEach((ek) => {
        const enemy = newEntities[ek];
        if (!enemy || enemy.type !== 'enemy') return;
        const dx = enemy.position.x - effect.position.x;
        const dy = enemy.position.y - effect.position.y;
        if (dx * dx + dy * dy > r * r) return;

        const updated: EnemyEntity = { ...enemy };
        updated.frozenFrames = GLACIER_FREEZE_REFRESH;
        updated.health -= tick;
        if (updated.health <= 0) {
          score += enemyScore(updated);
          player.signatureCharge = Math.min(100, player.signatureCharge + SIGNATURE_CHARGE_PER_KILL);
          delete newEntities[ek];
        } else {
          newEntities[ek] = updated;
        }
      });
    }

    // Tick lifetime
    effect.lifetime -= 1;
    if (effect.lifetime <= 0) {
      delete newEntities[key];
    } else {
      newEntities[key] = effect;
    }
  });

  newEntities.player = player;
  newEntities.gameState = { ...newEntities.gameState, score };
  return newEntities;
}
