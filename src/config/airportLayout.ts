import { Zone } from '../types';

// Main terminal dimensions
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TERMINAL_PADDING = 50;

// Create a realistic airport layout
export const airportZones: Zone[] = [
  // Main entrance
  {
    id: 'main-entrance',
    type: 'entry',
    capacity: 50,
    position: { x: 50, y: 280 },
    width: 60,
    height: 40,
    name: 'Main Entrance',
    connections: ['security-1', 'security-2']
  },

  // Security checkpoints
  {
    id: 'security-1',
    type: 'security',
    capacity: 15,
    position: { x: 150, y: 200 },
    width: 80,
    height: 40,
    name: 'Security North',
    connections: ['terminal-north']
  },
  {
    id: 'security-2',
    type: 'security',
    capacity: 15,
    position: { x: 150, y: 360 },
    width: 80,
    height: 40,
    name: 'Security South',
    connections: ['terminal-south']
  },

  // Terminal sections
  {
    id: 'terminal-north',
    type: 'terminal',
    capacity: 200,
    position: { x: 280, y: 50 },
    width: 470,
    height: 200,
    name: 'Terminal A',
    connections: ['gate-a1', 'gate-a2', 'gate-a3', 'gate-a4']
  },
  {
    id: 'terminal-south',
    type: 'terminal',
    capacity: 200,
    position: { x: 280, y: 350 },
    width: 470,
    height: 200,
    name: 'Terminal B',
    connections: ['gate-b1', 'gate-b2', 'gate-b3', 'gate-b4']
  },

  // Gates Terminal A
  {
    id: 'gate-a1',
    type: 'gate',
    capacity: 30,
    position: { x: 350, y: 20 },
    width: 60,
    height: 30,
    name: 'Gate A1'
  },
  {
    id: 'gate-a2',
    type: 'gate',
    capacity: 30,
    position: { x: 450, y: 20 },
    width: 60,
    height: 30,
    name: 'Gate A2'
  },
  {
    id: 'gate-a3',
    type: 'gate',
    capacity: 30,
    position: { x: 550, y: 20 },
    width: 60,
    height: 30,
    name: 'Gate A3'
  },
  {
    id: 'gate-a4',
    type: 'gate',
    capacity: 30,
    position: { x: 650, y: 20 },
    width: 60,
    height: 30,
    name: 'Gate A4'
  },

  // Gates Terminal B
  {
    id: 'gate-b1',
    type: 'gate',
    capacity: 30,
    position: { x: 350, y: 550 },
    width: 60,
    height: 30,
    name: 'Gate B1'
  },
  {
    id: 'gate-b2',
    type: 'gate',
    capacity: 30,
    position: { x: 450, y: 550 },
    width: 60,
    height: 30,
    name: 'Gate B2'
  },
  {
    id: 'gate-b3',
    type: 'gate',
    capacity: 30,
    position: { x: 550, y: 550 },
    width: 60,
    height: 30,
    name: 'Gate B3'
  },
  {
    id: 'gate-b4',
    type: 'gate',
    capacity: 30,
    position: { x: 650, y: 550 },
    width: 60,
    height: 30,
    name: 'Gate B4'
  },

  // Emergency exits
  {
    id: 'emergency-exit-1',
    type: 'exit',
    capacity: 50,
    position: { x: 750, y: 150 },
    width: 30,
    height: 60,
    name: 'Emergency Exit A'
  },
  {
    id: 'emergency-exit-2',
    type: 'exit',
    capacity: 50,
    position: { x: 750, y: 390 },
    width: 30,
    height: 60,
    name: 'Emergency Exit B'
  }
];