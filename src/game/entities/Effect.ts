import { EffectEntity, EffectKind } from '../types';
import {
  SLASH_LIFETIME,
  GLACIER_LIFETIME,
  GLACIER_RADIUS,
  GLACIER_TICK_DAMAGE,
  FROSTFLASH_LIFETIME,
} from '../constants';
import SlashEffectRenderer from '../../components/renderers/SlashEffectRenderer';
import GlacierFieldRenderer from '../../components/renderers/GlacierFieldRenderer';
import FrostFlashRenderer from '../../components/renderers/FrostFlashRenderer';

let effectIdCounter = 0;

function nextEffectId(kind: EffectKind): string {
  effectIdCounter += 1;
  return `effect_${kind}_${effectIdCounter}`;
}

export function createSlash(x: number, y: number, angle: number): EffectEntity {
  return {
    type: 'effect',
    effectKind: 'slash',
    position: { x, y },
    angle,
    lifetime: SLASH_LIFETIME,
    maxLifetime: SLASH_LIFETIME,
    id: nextEffectId('slash'),
    renderer: SlashEffectRenderer,
  };
}

export function createGlacier(x: number, y: number): EffectEntity {
  return {
    type: 'effect',
    effectKind: 'glacier',
    position: { x, y },
    radius: GLACIER_RADIUS,
    tickDamage: GLACIER_TICK_DAMAGE,
    lifetime: GLACIER_LIFETIME,
    maxLifetime: GLACIER_LIFETIME,
    id: nextEffectId('glacier'),
    renderer: GlacierFieldRenderer,
  };
}

export function createFrostFlash(x: number, y: number): EffectEntity {
  return {
    type: 'effect',
    effectKind: 'frostflash',
    position: { x, y },
    lifetime: FROSTFLASH_LIFETIME,
    maxLifetime: FROSTFLASH_LIFETIME,
    id: nextEffectId('frostflash'),
    renderer: FrostFlashRenderer,
  };
}

export function resetEffectIdCounter() {
  effectIdCounter = 0;
}
