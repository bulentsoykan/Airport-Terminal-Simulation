import React, { useState, useEffect, useCallback } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import SimulationControls from './components/SimulationControls';
import AnalyticsPanel from './components/AnalyticsPanel';
import { SimulationState, Agent } from './types';
import { SimulationRun, SimulationMetrics } from './types/analytics';
import { updateAgentPosition } from './utils/simulation';
import { findPath } from './utils/pathfinding';
import { analyzeSimulationRun, aggregateMetrics } from './utils/analytics';
import { airportZones } from './config/airportLayout';

const generateInitialAgents = (count: number): Agent[] => {
  const gates = airportZones.filter(zone => zone.type === 'gate');
  const entrance = airportZones.find(zone => zone.id === 'main-entrance')!;
  
  return Array.from({ length: count }, (_, i) => {
    const randomGate = gates[Math.floor(Math.random() * gates.length)];
    const destination = {
      x: randomGate.position.x + randomGate.width / 2,
      y: randomGate.position.y + randomGate.height / 2
    };
    
    return {
      id: `agent-${i}`,
      x: entrance.position.x + entrance.width / 2,
      y: entrance.position.y + entrance.height / 2,
      speed: 0.5 + Math.random(),
      destination,
      behavior: Math.random() > 0.8 ? 'rushed' : 'normal',
      currentGate: randomGate.id,
      path: findPath(
        { x: entrance.position.x + entrance.width / 2, y: entrance.position.y + entrance.height / 2 },
        destination,
        airportZones
      ),
      startTime: Date.now()
    };
  });
};

function App() {
  const [simulation, setSimulation] = useState<SimulationState>({
    agents: generateInitialAgents(20),
    zones: airportZones,
    time: 0,
    paused: true,
    emergencyMode: false,
    currentRun: 1,
    totalRuns: 5,
    autoRestart: true
  });

  const [speed, setSpeed] = useState(1);
  const [simulationRuns, setSimulationRuns] = useState<SimulationRun[]>([]);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    runs: [],
    averageCompletionTime: 0,
    averageEvacuationTime: 0,
    commonBottlenecks: [],
    zoneMetrics: []
  });

  const checkSimulationComplete = useCallback((agents: Agent[]): boolean => {
    return agents.every(agent => {
      const distanceToDestination = Math.sqrt(
        Math.pow(agent.destination.x - agent.x, 2) +
        Math.pow(agent.destination.y - agent.y, 2)
      );
      return distanceToDestination < 5;
    });
  }, []);

  const updateSimulation = useCallback(() => {
    if (simulation.paused) return;

    setSimulation(prev => {
      const updatedAgents = prev.agents.map(agent => updateAgentPosition(agent, prev.zones));
      
      // Check if simulation run is complete
      if (checkSimulationComplete(updatedAgents)) {
        const run = analyzeSimulationRun(
          updatedAgents,
          prev.zones,
          prev.time,
          Date.now(),
          prev.emergencyMode
        );
        
        setSimulationRuns(runs => {
          const newRuns = [...runs, run];
          setMetrics(aggregateMetrics(newRuns));
          return newRuns;
        });

        // Start new run if not finished all runs
        if (prev.currentRun < prev.totalRuns && prev.autoRestart) {
          return {
            ...prev,
            agents: generateInitialAgents(20),
            time: 0,
            emergencyMode: false,
            currentRun: prev.currentRun + 1
          };
        }
        
        return { ...prev, paused: true };
      }

      return {
        ...prev,
        time: prev.time + 1,
        agents: updatedAgents
      };
    });
  }, [simulation.paused, checkSimulationComplete]);

  useEffect(() => {
    const interval = setInterval(updateSimulation, 16 / speed);
    return () => clearInterval(interval);
  }, [updateSimulation, speed]);

  const handleTogglePause = () => {
    setSimulation(prev => ({ ...prev, paused: !prev.paused }));
  };

  const handleReset = () => {
    setSimulation({
      agents: generateInitialAgents(20),
      zones: airportZones,
      time: 0,
      paused: true,
      emergencyMode: false,
      currentRun: 1,
      totalRuns: 5,
      autoRestart: true
    });
    setSimulationRuns([]);
    setMetrics({
      runs: [],
      averageCompletionTime: 0,
      averageEvacuationTime: 0,
      commonBottlenecks: [],
      zoneMetrics: []
    });
  };

  const toggleEmergencyMode = () => {
    setSimulation(prev => {
      const emergencyMode = !prev.emergencyMode;
      
      if (emergencyMode) {
        const agents = prev.agents.map(agent => {
          const nearestExit = airportZones
            .filter(zone => zone.type === 'exit')
            .reduce((nearest, exit) => {
              const distance = Math.sqrt(
                Math.pow(exit.position.x - agent.x, 2) +
                Math.pow(exit.position.y - agent.y, 2)
              );
              return distance < nearest.distance ? { zone: exit, distance } : nearest;
            }, { zone: null, distance: Infinity }).zone;

          if (nearestExit) {
            return {
              ...agent,
              destination: {
                x: nearestExit.position.x + nearestExit.width / 2,
                y: nearestExit.position.y + nearestExit.height / 2
              },
              behavior: 'rushed',
              path: findPath(
                { x: agent.x, y: agent.y },
                {
                  x: nearestExit.position.x + nearestExit.width / 2,
                  y: nearestExit.position.y + nearestExit.height / 2
                },
                airportZones
              )
            };
          }
          return agent;
        });

        return { ...prev, emergencyMode, agents };
      }

      return { ...prev, emergencyMode };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Airport Terminal Simulation
        </h1>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <SimulationControls
              isPaused={simulation.paused}
              onTogglePause={handleTogglePause}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onEmergencyMode={toggleEmergencyMode}
              emergencyMode={simulation.emergencyMode}
              currentRun={simulation.currentRun}
              totalRuns={simulation.totalRuns}
            />
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <SimulationCanvas simulation={simulation} />
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Time: {simulation.time}</p>
                <p>Active Agents: {simulation.agents.length}</p>
                <p>Mode: {simulation.emergencyMode ? 'Emergency Evacuation' : 'Normal Operation'}</p>
                <p>Run: {simulation.currentRun} of {simulation.totalRuns}</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <AnalyticsPanel metrics={metrics} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;