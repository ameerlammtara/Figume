export type EntityType = 'player' | 'enemy' | 'bullet' | 'effect';
export type EnemyType = 'grunt' | 'shooter' | 'tank';
export type BulletOwner = 'player' | 'enemy';
export type EffectKind = 'slash' | 'glacier' | 'frostflash';

export interface Vec2 {
  x: number;
  y: number;
}

export interface PlayerEntity {
  type: 'player';
  position: Vec2;
  velocity: Vec2;
  health: number;
  maxHealth: number;
  speed: number;
  radius: number;
  shootCooldown: number;
  shootCooldownMax: number;
  invincibleFrames: number;
  // Noah's kit cooldowns / state
  meleeCooldown: number;
  meleeCooldownMax: number;
  blinkCooldown: number;
  blinkCooldownMax: number;
  glacierCooldown: number;
  glacierCooldownMax: number;
  signatureCharge: number; // 0-100
  signatureShatterTimer: number; // 0 = inactive
  renderer: React.ComponentType<any>;
}

export interface EnemyEntity {
  type: 'enemy';
  enemyType: EnemyType;
  position: Vec2;
  velocity: Vec2;
  health: number;
  maxHealth: number;
  speed: number;
  radius: number;
  damage: number;
  shootCooldown: number;
  shootCooldownMax: number;
  attackRange: number;
  frozenFrames: number;
  id: string;
  renderer: React.ComponentType<any>;
}

export interface BulletEntity {
  type: 'bullet';
  owner: BulletOwner;
  position: Vec2;
  velocity: Vec2;
  radius: number;
  damage: number;
  lifetime: number;
  id: string;
  renderer: React.ComponentType<any>;
}

export interface EffectEntity {
  type: 'effect';
  effectKind: EffectKind;
  position: Vec2;
  angle?: number;
  radius?: number;
  tickDamage?: number;
  lifetime: number;
  maxLifetime: number;
  id: string;
  renderer: React.ComponentType<any>;
}

export type GameEntity = PlayerEntity | EnemyEntity | BulletEntity | EffectEntity;

export interface GameState {
  type: 'gameState';
  wave: number;
  score: number;
  gameOver: boolean;
  waveDelay: number;
  waveActive: boolean;
  enemiesSpawnedThisWave: number;
  totalEnemiesThisWave: number;
}

export interface JoystickState {
  type: 'joystickState';
  active: boolean;
  direction: Vec2; // normalized -1 to 1
}

export interface ShootState {
  type: 'shootState';
  direction: Vec2;
  active: boolean;
  autoShoot: boolean;
}

export interface Entities {
  [key: string]: any;
  gameState: GameState;
  joystickState: JoystickState;
  shootState: ShootState;
  player: PlayerEntity;
}
