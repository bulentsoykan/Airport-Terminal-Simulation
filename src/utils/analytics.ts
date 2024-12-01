import { Agent, Zone } from '../types';
import { SimulationRun, BottleneckData, ZoneMetrics, SimulationMetrics } from '../types/analytics';
import { calculateDistance } from './simulation';

export const analyzeSimulationRun = (
  agents: Agent[],
  zones: Zone[],
  startTime: number,
  endTime: number,
  emergencyMode: boolean
): SimulationRun => {
  const completionTimes = agents.map(agent => 
    calculateDistance({ x: agent.x, y: agent.y }, agent.destination) < 5 ? 
      endTime - startTime : 
      Infinity
  );

  const bottlenecks = findBottlenecks(agents, zones);
  
  return {
    id: `run-${Date.now()}`,
    startTime,
    endTime,
    totalAgents: agents.length,
    averageCompletionTime: completionTimes.filter(t => t !== Infinity).reduce((a, b) => a + b, 0) / completionTimes.length,
    bottlenecks,
    emergencyActivated: emergencyMode,
    evacuationTime: emergencyMode ? calculateEvacuationTime(agents, zones) : undefined
  };
};

const findBottlenecks = (agents: Agent[], zones: Zone[]): BottleneckData[] => {
  return zones.map(zone => {
    const agentsInZone = agents.filter(agent => 
      agent.x >= zone.position.x &&
      agent.x <= zone.position.x + zone.width &&
      agent.y >= zone.position.y &&
      agent.y <= zone.position.y + zone.height
    );

    const congestionLevel = agentsInZone.length / zone.capacity;

    return {
      zoneId: zone.id,
      zoneName: zone.name || zone.id,
      congestionLevel,
      peakTime: Date.now() // This would ideally track the actual peak time
    };
  }).filter(data => data.congestionLevel > 0.7); // Only report significant bottlenecks
};

const calculateEvacuationTime = (agents: Agent[], zones: Zone[]): number => {
  const exitZones = zones.filter(zone => zone.type === 'exit');
  const evacuatedAgents = agents.filter(agent => {
    return exitZones.some(exit => 
      calculateDistance(agent, {
        x: exit.position.x + exit.width/2,
        y: exit.position.y + exit.height/2
      }) < 10
    );
  });

  return evacuatedAgents.length === agents.length ? Date.now() : Infinity;
};

export const aggregateMetrics = (runs: SimulationRun[]): SimulationMetrics => {
  const averageCompletionTime = runs.reduce((sum, run) => sum + run.averageCompletionTime, 0) / runs.length;
  
  const emergencyRuns = runs.filter(run => run.emergencyActivated && run.evacuationTime !== undefined);
  const averageEvacuationTime = emergencyRuns.length > 0 ?
    emergencyRuns.reduce((sum, run) => sum + (run.evacuationTime || 0), 0) / emergencyRuns.length :
    0;

  // Aggregate bottlenecks across runs
  const bottleneckMap = new Map<string, BottleneckData[]>();
  runs.forEach(run => {
    run.bottlenecks.forEach(bottleneck => {
      const existing = bottleneckMap.get(bottleneck.zoneId) || [];
      bottleneckMap.set(bottleneck.zoneId, [...existing, bottleneck]);
    });
  });

  const commonBottlenecks = Array.from(bottleneckMap.entries())
    .map(([_, bottlenecks]) => {
      const avgCongestion = bottlenecks.reduce((sum, b) => sum + b.congestionLevel, 0) / bottlenecks.length;
      return {
        ...bottlenecks[0],
        congestionLevel: avgCongestion
      };
    })
    .sort((a, b) => b.congestionLevel - a.congestionLevel)
    .slice(0, 5);

  return {
    runs,
    averageCompletionTime,
    averageEvacuationTime,
    commonBottlenecks,
    zoneMetrics: calculateZoneMetrics(runs)
  };
};

const calculateZoneMetrics = (runs: SimulationRun[]): ZoneMetrics[] => {
  const zoneMap = new Map<string, ZoneMetrics>();

  runs.forEach(run => {
    run.bottlenecks.forEach(bottleneck => {
      const existing = zoneMap.get(bottleneck.zoneId) || {
        id: bottleneck.zoneId,
        name: bottleneck.zoneName,
        averageOccupancy: 0,
        peakOccupancy: 0,
        totalTransits: 0
      };

      zoneMap.set(bottleneck.zoneId, {
        ...existing,
        averageOccupancy: (existing.averageOccupancy + bottleneck.congestionLevel) / 2,
        peakOccupancy: Math.max(existing.peakOccupancy, bottleneck.congestionLevel),
        totalTransits: existing.totalTransits + 1
      });
    });
  });

  return Array.from(zoneMap.values());
};