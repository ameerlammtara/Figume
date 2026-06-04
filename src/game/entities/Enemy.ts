import { EnemyEntity, EnemyType } from '../types';
import {
  GRUNT_HEALTH, GRUNT_SPEED, GRUNT_RADIUS, GRUNT_DAMAGE, GRUNT_ATTACK_RANGE,
  SHOOTER_HEALTH, SHOOTER_SPEED, SHOOTER_RADIUS, SHOOTER_DAMAGE, SHOOTER_ATTACK_RANGE, SHOOTER_SHOOT_COOLDOWN,
  TANK_HEALTH, TANK_SPEED, TANK_RADIUS, TANK_DAMAGE, TANK_ATTACK_RANGE,
} from '../constants';
import EnemyRenderer from '../../components/renderers/EnemyRenderer';

let enemyIdCounter = 0;

export function createEnemy(type: EnemyType, x: number, y: number): EnemyEntity {
  enemyIdCounter += 1;
  const id = `enemy_${enemyIdCounter}`;

  switch (type) {
    case 'grunt':
      return {
        type: 'enemy',
        enemyType: 'grunt',
        position: { x, y },
        velocity: { x: 0, y: 0 },
        health: GRUNT_HEALTH,
        maxHealth: GRUNT_HEALTH,
        speed: GRUNT_SPEED,
        radius: GRUNT_RADIUS,
        damage: GRUNT_DAMAGE,
        shootCooldown: 0,
        shootCooldownMax: 9999,
        attackRange: GRUNT_ATTACK_RANGE,
        frozenFrames: 0,
        id,
        renderer: EnemyRenderer,
      };
    case 'shooter':
      return {
        type: 'enemy',
        enemyType: 'shooter',
        position: { x, y },
        velocity: { x: 0, y: 0 },
        health: SHOOTER_HEALTH,
        maxHealth: SHOOTER_HEALTH,
        speed: SHOOTER_SPEED,
        radius: SHOOTER_RADIUS,
        damage: SHOOTER_DAMAGE,
        shootCooldown: 0,
        shootCooldownMax: SHOOTER_SHOOT_COOLDOWN,
        attackRange: SHOOTER_ATTACK_RANGE,
        frozenFrames: 0,
        id,
        renderer: EnemyRenderer,
      };
    case 'tank':
      return {
        type: 'enemy',
        enemyType: 'tank',
        position: { x, y },
        velocity: { x: 0, y: 0 },
        health: TANK_HEALTH,
        maxHealth: TANK_HEALTH,
        speed: TANK_SPEED,
        radius: TANK_RADIUS,
        damage: TANK_DAMAGE,
        shootCooldown: 0,
        shootCooldownMax: 9999,
        attackRange: TANK_ATTACK_RANGE,
        frozenFrames: 0,
        id,
        renderer: EnemyRenderer,
      };
  }
}

export function resetEnemyIdCounter() {
  enemyIdCounter = 0;
}
