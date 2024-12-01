import { Agent, Point, Zone } from '../types';

export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const updateAgentPosition = (agent: Agent, zones: Zone[]): Agent => {
  const dx = agent.destination.x - agent.x;
  const dy = agent.destination.y - agent.y;
  const distance = calculateDistance(agent, agent.destination);
  
  if (distance < agent.speed) {
    return { ...agent, x: agent.destination.x, y: agent.destination.y };
  }

  const vx = (dx / distance) * agent.speed;
  const vy = (dy / distance) * agent.speed;

  return {
    ...agent,
    x: agent.x + vx,
    y: agent.y + vy,
  };
};

export const checkZoneCapacity = (zone: Zone, agents: Agent[]): boolean => {
  const agentsInZone = agents.filter(agent => 
    agent.x >= zone.position.x &&
    agent.x <= zone.position.x + zone.width &&
    agent.y >= zone.position.y &&
    agent.y <= zone.position.y + zone.height
  );
  
  return agentsInZone.length < zone.capacity;
};