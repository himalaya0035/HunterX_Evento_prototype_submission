import React from 'react'
import { Area,AreaChart,XAxis,YAxis,CartesianGrid,Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts'

function RechartPieChart() {
    const data = [
        {
          "name": "Page A",
          "uv": 4000,
          "pv": 2400,
          "amt": 2400
        },
        {
          "name": "Page B",
          "uv": 3000,
          "pv": 1398,
          "amt": 2210
        },
        {
          "name": "Page C",
          "uv": 2000,
          "pv": 3000,
          "amt": 2290
        }
      ]

    return (

      <AreaChart width={400} height={165} data={data}
      margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="name" dy={10}   tick={{fontSize: 12, fill: 'White'}} />
      <YAxis   dx={-15} tick={{fontSize: 12, fill: 'White'}} />
      <Tooltip />
      <Area type="monotone" dataKey="pv" stroke="#8884d8" fillOpacity={1} fill="url(#colorPv)" />
    </AreaChart>

    )
}

export default RechartPieChart