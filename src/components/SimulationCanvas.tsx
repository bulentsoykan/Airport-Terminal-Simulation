import React, { useRef, useEffect } from 'react';
import { SimulationState, Zone } from '../types';

interface Props {
  simulation: SimulationState;
}

const SimulationCanvas: React.FC<Props> = ({ simulation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw zones
    simulation.zones.forEach(zone => {
      drawZone(ctx, zone, simulation.emergencyMode);
    });

    // Draw agents
    simulation.agents.forEach(agent => {
      drawAgent(ctx, agent);
      if (agent.path.length > 0) {
        drawPath(ctx, agent.path);
      }
    });

    // Draw zone labels
    simulation.zones.forEach(zone => {
      if (zone.name) {
        drawZoneLabel(ctx, zone);
      }
    });
  }, [simulation]);

  const drawZone = (ctx: CanvasRenderingContext2D, zone: Zone, emergencyMode: boolean) => {
    ctx.fillStyle = getZoneColor(zone.type, emergencyMode);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    
    ctx.fillRect(zone.position.x, zone.position.y, zone.width, zone.height);
    ctx.strokeRect(zone.position.x, zone.position.y, zone.width, zone.height);
  };

  const drawAgent = (ctx: CanvasRenderingContext2D, agent: any) => {
    ctx.beginPath();
    ctx.arc(agent.x, agent.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = getAgentColor(agent.behavior);
    ctx.fill();
    ctx.closePath();
  };

  const drawPath = (ctx: CanvasRenderingContext2D, path: any[]) => {
    if (path.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach((point, i) => {
      if (i > 0) {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
    ctx.stroke();
  };

  const drawZoneLabel = (ctx: CanvasRenderingContext2D, zone: Zone) => {
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      zone.name || '',
      zone.position.x + zone.width / 2,
      zone.position.y + zone.height / 2
    );
  };

  const getZoneColor = (type: string, emergencyMode: boolean): string => {
    if (emergencyMode && type === 'exit') {
      return 'rgba(255, 0, 0, 0.4)';
    }
    
    switch (type) {
      case 'entry': return 'rgba(0, 255, 0, 0.2)';
      case 'exit': return 'rgba(255, 0, 0, 0.2)';
      case 'security': return 'rgba(255, 255, 0, 0.2)';
      case 'gate': return 'rgba(0, 150, 255, 0.2)';
      case 'terminal': return 'rgba(200, 200, 200, 0.1)';
      default: return 'rgba(200, 200, 200, 0.2)';
    }
  };

  const getAgentColor = (behavior: string): string => {
    switch (behavior) {
      case 'rushed': return '#ff0000';
      case 'idle': return '#0000ff';
      default: return '#000000';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-300 rounded-lg shadow-lg"
    />
  );
};

export default SimulationCanvas;