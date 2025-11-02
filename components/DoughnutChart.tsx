"use client"
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts } : DoughnutChartProps) =>{

    const accountNames = accounts.map((a)=> a.name);
    const balances = accounts.map((a)=> a.currentBalance)

    const data={
        datasets: [
            {
                label: 'Banks',
                data: balances,
                backgroundColor: [
                    '#6B7280',
                    '#9CA3AF',
                    '#D1D5DB',
                ],
            }
        ],
        labels: accountNames
    }

    return <Doughnut 
        data={data} 
        options={{
            cutout: '60%',
            plugins: {
                legend:{
                    display: false
                }
            }
        }}
        />
}

export default DoughnutChart
