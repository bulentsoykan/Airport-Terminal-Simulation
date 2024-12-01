import { Point, Zone } from '../types';

export const findPath = (start: Point, end: Point, zones: Zone[]): Point[] => {
  // Simple pathfinding that avoids obstacles
  const path: Point[] = [];
  const current = { ...start };
  
  // Add intermediate points to navigate around zones
  const nearestZone = findNearestZone(start, zones);
  if (nearestZone) {
    // Add points to navigate through connected zones
    const route = findRouteThoughZones(nearestZone, end, zones);
    path.push(...route);
  }
  
  // Add destination
  path.push(end);
  
  return path;
};

const findNearestZone = (point: Point, zones: Zone[]): Zone | null => {
  let nearest: Zone | null = null;
  let minDistance = Infinity;
  
  zones.forEach(zone => {
    const distance = Math.sqrt(
      Math.pow(zone.position.x + zone.width/2 - point.x, 2) +
      Math.pow(zone.position.y + zone.height/2 - point.y, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = zone;
    }
  });
  
  return nearest;
};

const findRouteThoughZones = (startZone: Zone, end: Point, zones: Zone[]): Point[] => {
  const route: Point[] = [];
  let currentZone = startZone;
  
  while (currentZone && currentZone.connections) {
    const nextZoneId = currentZone.connections.find(id => {
      const zone = zones.find(z => z.id === id);
      return zone && isCloserToDestination(zone, currentZone, end);
    });
    
    if (!nextZoneId) break;
    
    const nextZone = zones.find(z => z.id === nextZoneId);
    if (!nextZone) break;
    
    route.push({
      x: nextZone.position.x + nextZone.width/2,
      y: nextZone.position.y + nextZone.height/2
    });
    
    currentZone = nextZone;
  }
  
  return route;
};

const isCloserToDestination = (zone: Zone, currentZone: Zone, end: Point): boolean => {
  const currentDist = Math.sqrt(
    Math.pow(currentZone.position.x - end.x, 2) +
    Math.pow(currentZone.position.y - end.y, 2)
  );
  
  const nextDist = Math.sqrt(
    Math.pow(zone.position.x - end.x, 2) +
    Math.pow(zone.position.y - end.y, 2)
  );
  
  return nextDist < currentDist;
};