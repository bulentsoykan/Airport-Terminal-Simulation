export interface SimulationRun {
  id: string;
  startTime: number;
  endTime: number;
  totalAgents: number;
  averageCompletionTime: number;
  bottlenecks: BottleneckData[];
  emergencyActivated: boolean;
  evacuationTime?: number;
}

export interface BottleneckData {
  zoneId: string;
  zoneName: string;
  congestionLevel: number;
  peakTime: number;
}

export interface ZoneMetrics {
  id: string;
  name: string;
  averageOccupancy: number;
  peakOccupancy: number;
  totalTransits: number;
}

export interface SimulationMetrics {
  runs: SimulationRun[];
  averageCompletionTime: number;
  averageEvacuationTime: number;
  commonBottlenecks: BottleneckData[];
  zoneMetrics: ZoneMetrics[];
}