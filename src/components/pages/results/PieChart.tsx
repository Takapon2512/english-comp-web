'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  score: number;
  maxScore?: number;
  title: string;
  color?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  score,
  maxScore = 100,
  title,
  color = '#64748b'
}) => {
  const percentage = Math.round((score / maxScore) * 100);
  const remaining = 100 - percentage;

  const data = {
    labels: ['達成', '未達成'],
    datasets: [
      {
        data: [percentage, remaining],
        backgroundColor: [
          color,
          '#e2e8f0'
        ],
        borderColor: [
          color,
          '#e2e8f0'
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-20 h-20">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">
          {percentage}
        </span>
      </div>
    </div>
  );
};

export default PieChart;
