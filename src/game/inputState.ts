// Shared mutable input state — updated by React touch handlers, read by game systems
export const inputState = {
  joystick: {
    active: false,
    dx: 0,
    dy: 0,
  },
  shoot: {
    active: false,
    autoShoot: false,
    dirX: 0,
    dirY: 1,
  },
  // One-shot ability triggers (consumed by systems)
  abilityB: false,
  abilityA: false,
  abilitySignature: false,
};

// Shared game output state — written by game systems, read by React HUD
export const outputState = {
  health: 100,
  maxHealth: 100,
  wave: 0,
  score: 0,
  waveActive: false,
  waveDelay: 0,
  gameOver: false,
  playerX: 180,
  playerY: 310,
  blinkCd: 0,
  blinkCdMax: 300,
  glacierCd: 0,
  glacierCdMax: 600,
  signatureCharge: 0,
};
