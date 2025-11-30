'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface RadarChartProps {
  grammarScore: number;
  vocabularyScore: number;
  expressionScore: number;
  structureScore: number;
}

const RadarChart: React.FC<RadarChartProps> = ({
  grammarScore,
  vocabularyScore,
  expressionScore,
  structureScore,
}) => {
  // デバッグ用: 実際のスコア値を確認
  console.log('Chart scores:', { grammarScore, vocabularyScore, expressionScore, structureScore });
  
  const data = {
    labels: ['文法 (Grammar)', '語彙 (Vocabulary)', '表現 (Expression)', '構成 (Structure)'],
    datasets: [
      {
        label: 'スコア',
        data: [grammarScore, vocabularyScore, expressionScore, structureScore],
        backgroundColor: 'rgba(100, 116, 139, 0.2)',
        borderColor: 'rgba(100, 116, 139, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(100, 116, 139, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(100, 116, 139, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
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
          label: function(context: any) {
            return `${context.label}: ${context.parsed.r}点`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(148, 163, 184, 0.3)',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: '#374151',
        },
        ticks: {
          display: true,
          stepSize: 20,
          min: 0,
          max: 100,
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          backdropColor: 'transparent',
        },
        beginAtZero: true,
        min: 0,
        max: 100,
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;
