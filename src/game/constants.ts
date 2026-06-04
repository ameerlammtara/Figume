export const ARENA_WIDTH = 360;
export const ARENA_HEIGHT = 620;

export const PLAYER_SPEED = 3.5;
export const PLAYER_HEALTH = 100;
export const PLAYER_RADIUS = 22;
export const PLAYER_SHOOT_COOLDOWN = 18; // frames
export const PLAYER_BULLET_SPEED = 7;
export const PLAYER_BULLET_DAMAGE = 20;
export const PLAYER_BULLET_LIFETIME = 70;
export const PLAYER_BULLET_RADIUS = 7;
export const PLAYER_INVINCIBLE_FRAMES = 20;

// Enemy constants
export const GRUNT_HEALTH = 30;
export const GRUNT_SPEED = 1.4;
export const GRUNT_RADIUS = 18;
export const GRUNT_DAMAGE = 15;
export const GRUNT_ATTACK_RANGE = 0; // melee only

export const SHOOTER_HEALTH = 50;
export const SHOOTER_SPEED = 1.1;
export const SHOOTER_RADIUS = 18;
export const SHOOTER_DAMAGE = 12;
export const SHOOTER_ATTACK_RANGE = 200;
export const SHOOTER_SHOOT_COOLDOWN = 80;
export const SHOOTER_BULLET_SPEED = 4.5;

export const TANK_HEALTH = 100;
export const TANK_SPEED = 0.7;
export const TANK_RADIUS = 28;
export const TANK_DAMAGE = 30;
export const TANK_ATTACK_RANGE = 0; // melee only

export const ENEMY_BULLET_DAMAGE = 12;
export const ENEMY_BULLET_LIFETIME = 90;
export const ENEMY_BULLET_RADIUS = 6;

export const WAVE_DELAY_FRAMES = 120; // 2 seconds at 60fps

export const SCORE_PER_GRUNT = 10;
export const SCORE_PER_SHOOTER = 20;
export const SCORE_PER_TANK = 50;

// Noah the Frost Blade — ability kit
export const MELEE_RANGE = 58;
export const MELEE_DAMAGE = 22;
export const MELEE_COOLDOWN = 22;
export const MELEE_ARC_DEG = 70; // half-arc tolerance in degrees

export const BLINK_RANGE = 200;
export const BLINK_DAMAGE = 45;
export const BLINK_COOLDOWN = 300; // ~5s
export const BLINK_INVINCIBLE = 25;
export const BLINK_MAX_TARGETS = 3;

export const GLACIER_THROW_DIST = 110;
export const GLACIER_RADIUS = 70;
export const GLACIER_LIFETIME = 180; // ~3s
export const GLACIER_TICK_DAMAGE = 2;
export const GLACIER_COOLDOWN = 600; // ~10s
export const GLACIER_FREEZE_REFRESH = 30; // frozenFrames refreshed each tick inside field

export const SIGNATURE_CHARGE_PER_KILL = 10;
export const SIGNATURE_FREEZE_FRAMES = 120;
export const SIGNATURE_SHATTER_DELAY = 45;

export const SLASH_LIFETIME = 8;
export const FROSTFLASH_LIFETIME = 45;
