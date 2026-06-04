import { BulletEntity, BulletOwner } from '../types';
import {
  PLAYER_BULLET_DAMAGE, PLAYER_BULLET_LIFETIME, PLAYER_BULLET_RADIUS,
  ENEMY_BULLET_DAMAGE, ENEMY_BULLET_LIFETIME, ENEMY_BULLET_RADIUS,
} from '../constants';
import BulletRenderer from '../../components/renderers/BulletRenderer';

let bulletIdCounter = 0;

export function createBullet(
  owner: BulletOwner,
  x: number,
  y: number,
  vx: number,
  vy: number
): BulletEntity {
  bulletIdCounter += 1;
  const id = `bullet_${bulletIdCounter}`;
  const isPlayer = owner === 'player';

  return {
    type: 'bullet',
    owner,
    position: { x, y },
    velocity: { x: vx, y: vy },
    radius: isPlayer ? PLAYER_BULLET_RADIUS : ENEMY_BULLET_RADIUS,
    damage: isPlayer ? PLAYER_BULLET_DAMAGE : ENEMY_BULLET_DAMAGE,
    lifetime: isPlayer ? PLAYER_BULLET_LIFETIME : ENEMY_BULLET_LIFETIME,
    id,
    renderer: BulletRenderer,
  };
}

export function resetBulletIdCounter() {
  bulletIdCounter = 0;
}
