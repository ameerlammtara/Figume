export type EntityType = 'player' | 'enemy' | 'bullet';
export type EnemyType = 'grunt' | 'shooter' | 'tank';
export type BulletOwner = 'player' | 'enemy';

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

export type GameEntity = PlayerEntity | EnemyEntity | BulletEntity;

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
