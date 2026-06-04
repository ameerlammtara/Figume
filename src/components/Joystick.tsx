import React, { useRef, useState } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';

interface JoystickProps {
  onMove: (dx: number, dy: number) => void;
  onRelease: () => void;
}

const JOYSTICK_BASE = 80;
const KNOB_RADIUS = 28;
const MAX_DIST = JOYSTICK_BASE - KNOB_RADIUS;

export default function Joystick({ onMove, onRelease }: JoystickProps) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const baseRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = (e: GestureResponderEvent) => {
    const touch = e.nativeEvent;
    baseRef.current = { x: touch.pageX, y: touch.pageY };
    setActive(true);
    setKnobPos({ x: 0, y: 0 });
    return true;
  };

  const handleMove = (e: GestureResponderEvent) => {
    if (!baseRef.current) return;
    const touch = e.nativeEvent;
    let dx = touch.pageX - baseRef.current.x;
    let dy = touch.pageY - baseRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > MAX_DIST) {
      dx = (dx / dist) * MAX_DIST;
      dy = (dy / dist) * MAX_DIST;
    }
    setKnobPos({ x: dx, y: dy });
    const ndx = dx / MAX_DIST;
    const ndy = dy / MAX_DIST;
    onMove(ndx, ndy);
  };

  const handleRelease = () => {
    baseRef.current = null;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    onRelease();
  };

  return (
    <View
      style={styles.touchArea}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleStart}
      onResponderMove={handleMove}
      onResponderRelease={handleRelease}
      onResponderTerminate={handleRelease}
    >
      {/* Base ring */}
      <View style={[styles.base, active && styles.baseActive]}>
        {/* Knob */}
        <View
          style={[
            styles.knob,
            {
              transform: [
                { translateX: knobPos.x },
                { translateY: knobPos.y },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  base: {
    width: JOYSTICK_BASE * 2,
    height: JOYSTICK_BASE * 2,
    borderRadius: JOYSTICK_BASE,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  knob: {
    width: KNOB_RADIUS * 2,
    height: KNOB_RADIUS * 2,
    borderRadius: KNOB_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});
