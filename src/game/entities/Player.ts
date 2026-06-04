import { PlayerEntity } from '../types';
import {
  PLAYER_HEALTH,
  PLAYER_SPEED,
  PLAYER_RADIUS,
  PLAYER_SHOOT_COOLDOWN,
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
    renderer: PlayerRenderer,
  };
}
