import React from 'react';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onEmergencyMode: () => void;
  emergencyMode: boolean;
  currentRun: number;
  totalRuns: number;
}

const SimulationControls: React.FC<Props> = ({
  isPaused,
  onTogglePause,
  onReset,
  onSpeedChange,
  onEmergencyMode,
  emergencyMode,
  currentRun,
  totalRuns,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={onTogglePause}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
        {isPaused ? 'Start' : 'Pause'}
      </button>
      
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <RotateCcw size={20} />
        Reset
      </button>
      
      <button
        onClick={onEmergencyMode}
        className={`flex items-center gap-2 px-4 py-2 text-white rounded-md ${
          emergencyMode ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600'
        }`}
      >
        <AlertTriangle size={20} />
        {emergencyMode ? 'Cancel Emergency' : 'Trigger Emergency'}
      </button>
      
      <div className="flex items-center gap-2">
        <label htmlFor="speed" className="text-sm text-gray-600">
          Speed:
        </label>
        <select
          id="speed"
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="px-2 py-1 border rounded-md"
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="2">2x</option>
          <option value="4">4x</option>
        </select>
      </div>

      <div className="ml-auto text-sm text-gray-600">
        Run {currentRun} of {totalRuns}
      </div>
    </div>
  );
};

export default SimulationControls;