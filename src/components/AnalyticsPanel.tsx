import React from 'react';
import { SimulationMetrics, ZoneMetrics } from '../types/analytics';
import { BarChart, Activity, Clock } from 'lucide-react';

interface Props {
  metrics: SimulationMetrics;
}

const AnalyticsPanel: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Simulation Analytics</h2>
        <span className="text-sm text-gray-500">
          Total Runs: {metrics.runs.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-blue-700">Average Completion</h3>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {metrics.averageCompletionTime.toFixed(1)}s
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-700">Evacuation Time</h3>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {metrics.averageEvacuationTime.toFixed(1)}s
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-yellow-700">Bottlenecks</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {metrics.commonBottlenecks.length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Common Bottlenecks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Zone</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Congestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metrics.commonBottlenecks.map(bottleneck => (
                <tr key={bottleneck.zoneId}>
                  <td className="px-4 py-2 text-sm text-gray-800">{bottleneck.zoneName}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min(100, bottleneck.congestionLevel * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {(bottleneck.congestionLevel * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Zone Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          {metrics.zoneMetrics.map(zone => (
            <ZoneMetricsCard key={zone.id} metrics={zone} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ZoneMetricsCard: React.FC<{ metrics: ZoneMetrics }> = ({ metrics }) => (
  <div className="p-4 border rounded-lg">
    <h4 className="font-semibold text-gray-700 mb-2">{metrics.name}</h4>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Average Occupancy:</span>
        <span className="font-medium">{(metrics.averageOccupancy * 100).toFixed(1)}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Peak Occupancy:</span>
        <span className="font-medium">{(metrics.peakOccupancy * 100).toFixed(1)}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Total Transits:</span>
        <span className="font-medium">{metrics.totalTransits}</span>
      </div>
    </div>
  </div>
);

export default AnalyticsPanel;