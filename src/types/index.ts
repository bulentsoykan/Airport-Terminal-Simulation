export interface Agent {
  id: string;
  x: number;
  y: number;
  speed: number;
  destination: Point;
  behavior: 'normal' | 'rushed' | 'idle';
  currentGate?: string;
  path: Point[];
  startTime?: number;
  completionTime?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  type: 'entry' | 'exit' | 'security' | 'gate' | 'path' | 'terminal';
  capacity: number;
  position: Point;
  width: number;
  height: number;
  name?: string;
  connections?: string[];
}

export interface SimulationState {
  agents: Agent[];
  zones: Zone[];
  time: number;
  paused: boolean;
  emergencyMode: boolean;
  currentRun: number;
  totalRuns: number;
  autoRestart: boolean;
}