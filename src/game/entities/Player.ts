import { PlayerEntity } from '../types';
import {
  PLAYER_HEALTH,
  PLAYER_SPEED,
  PLAYER_RADIUS,
  PLAYER_SHOOT_COOLDOWN,
  MELEE_COOLDOWN,
  BLINK_COOLDOWN,
  GLACIER_COOLDOWN,
} from '../constants';
import PlayerRenderer from '../../components/renderers/PlayerRenderer';

export function createPlayer(x: number, y: number): PlayerEntity {
  return {
    type: 'player',
    position: { x, y },
    velocity: { x: 0, y: 0 },
    health: PLAYER_HEALTH,
    maxHealth: PLAYER_HEALTH,
    speed: PLAYER_SPEED,
    radius: PLAYER_RADIUS,
    shootCooldown: 0,
    shootCooldownMax: PLAYER_SHOOT_COOLDOWN,
    invincibleFrames: 0,
    meleeCooldown: 0,
    meleeCooldownMax: MELEE_COOLDOWN,
    blinkCooldown: 0,
    blinkCooldownMax: BLINK_COOLDOWN,
    glacierCooldown: 0,
    glacierCooldownMax: GLACIER_COOLDOWN,
    signatureCharge: 0,
    signatureShatterTimer: 0,
    renderer: PlayerRenderer,
  };
}
