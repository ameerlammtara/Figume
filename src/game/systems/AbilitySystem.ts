import { Entities, PlayerEntity, EnemyEntity } from '../types';
import {
  ARENA_WIDTH,
  ARENA_HEIGHT,
  BLINK_RANGE,
  BLINK_DAMAGE,
  BLINK_INVINCIBLE,
  BLINK_MAX_TARGETS,
  GLACIER_THROW_DIST,
  SIGNATURE_CHARGE_PER_KILL,
  SIGNATURE_FREEZE_FRAMES,
  SIGNATURE_SHATTER_DELAY,
} from '../constants';
import { inputState } from '../inputState';
import { createSlash, createGlacier, createFrostFlash } from '../entities/Effect';
import { enemyScore } from './MeleeSystem';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function AbilitySystem(entities: Entities): Entities {
  const gameState = entities.gameState;
  if (gameState.gameOver) {
    // Still consume any pending triggers so they don't fire on resume
    inputState.abilityB = false;
    inputState.abilityA = false;
    inputState.abilitySignature = false;
    return entities;
  }

  const newEntities: Entities = { ...entities };
  const player: PlayerEntity = { ...entities.player };
  let score = newEntities.gameState.score;

  // Decrement ability cooldowns
  if (player.blinkCooldown > 0) player.blinkCooldown -= 1;
  if (player.glacierCooldown > 0) player.glacierCooldown -= 1;

  const aimLen =
    Math.sqrt(inputState.shoot.dirX ** 2 + inputState.shoot.dirY ** 2) || 1;
  const ax = inputState.shoot.dirX / aimLen;
  const ay = inputState.shoot.dirY / aimLen;

  // ---- LEVEL B: Blink Slash ----
  if (inputState.abilityB) {
    inputState.abilityB = false;
    if (player.blinkCooldown === 0) {
      const targets = Object.keys(newEntities)
        .filter((k) => newEntities[k]?.type === 'enemy')
        .map((k) => {
          const e: EnemyEntity = newEntities[k];
          const dx = e.position.x - player.position.x;
          const dy = e.position.y - player.position.y;
          return { key: k, dist: Math.sqrt(dx * dx + dy * dy) };
        })
        .filter((t) => t.dist <= BLINK_RANGE)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, BLINK_MAX_TARGETS);

      if (targets.length > 0) {
        let lastPos = { ...player.position };
        targets.forEach((t) => {
          const enemy: EnemyEntity | undefined = newEntities[t.key];
          if (!enemy) return;
          lastPos = { ...enemy.position };
          const slashId = `slash_b_${t.key}_${Date.now()}`;
          const slash = createSlash(enemy.position.x, enemy.position.y, Math.atan2(ay, ax));
          slash.id = slashId;
          newEntities[slashId] = slash;

          const updated: EnemyEntity = { ...enemy };
          updated.health -= BLINK_DAMAGE;
          if (updated.health <= 0) {
            score += enemyScore(updated);
            player.signatureCharge = Math.min(100, player.signatureCharge + SIGNATURE_CHARGE_PER_KILL);
            delete newEntities[t.key];
          } else {
            newEntities[t.key] = updated;
          }
        });

        player.position = {
          x: clamp(lastPos.x, player.radius, ARENA_WIDTH - player.radius),
          y: clamp(lastPos.y, player.radius, ARENA_HEIGHT - player.radius),
        };
        player.invincibleFrames = Math.max(player.invincibleFrames, BLINK_INVINCIBLE);
        player.blinkCooldown = player.blinkCooldownMax;
      }
      // If no targets, cooldown is NOT started (not wasted)
    }
  }

  // ---- LEVEL A: Glacier Field ----
  if (inputState.abilityA) {
    inputState.abilityA = false;
    if (player.glacierCooldown === 0) {
      const tx = clamp(player.position.x + ax * GLACIER_THROW_DIST, 20, ARENA_WIDTH - 20);
      const ty = clamp(player.position.y + ay * GLACIER_THROW_DIST, 20, ARENA_HEIGHT - 20);
      const fieldId = `glacier_${Date.now()}`;
      const field = createGlacier(tx, ty);
      field.id = fieldId;
      newEntities[fieldId] = field;
      player.glacierCooldown = player.glacierCooldownMax;
    }
  }

  // ---- SIGNATURE: Absolute Zero (trigger) ----
  if (inputState.abilitySignature) {
    inputState.abilitySignature = false;
    if (player.signatureCharge >= 100 && player.signatureShatterTimer === 0) {
      player.signatureCharge = 0;
      player.signatureShatterTimer = SIGNATURE_SHATTER_DELAY;

      // Freeze all enemies
      Object.keys(newEntities).forEach((k) => {
        const e = newEntities[k];
        if (e?.type === 'enemy') {
          newEntities[k] = { ...e, frozenFrames: SIGNATURE_FREEZE_FRAMES };
        }
      });

      // Fullscreen frost flash
      const flashId = `frostflash_${Date.now()}`;
      const flash = createFrostFlash(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
      flash.id = flashId;
      newEntities[flashId] = flash;
    }
  }

  // ---- SIGNATURE: delayed shatter ----
  if (player.signatureShatterTimer > 0) {
    player.signatureShatterTimer -= 1;
    if (player.signatureShatterTimer === 0) {
      Object.keys(newEntities).forEach((k) => {
        const e = newEntities[k];
        if (e?.type === 'enemy') {
          score += enemyScore(e as EnemyEntity);
          // Shatter visual
          const slashId = `shatter_${k}_${Date.now()}`;
          const slash = createSlash(e.position.x, e.position.y, Math.random() * Math.PI * 2);
          slash.id = slashId;
          newEntities[slashId] = slash;
          delete newEntities[k];
        }
      });
    }
  }

  newEntities.gameState = { ...newEntities.gameState, score };
  newEntities.player = player;
  return newEntities;
}
