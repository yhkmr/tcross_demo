"use client";

import { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { patients } from "@/data/patients";
import { UsersIcon, CalendarIcon, ChartBarIcon } from "@heroicons/react/24/outline";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function Statistics() {
  const [ageData, setAgeData] = useState({});
  const [genderData, setGenderData] = useState({});
  const [visitData, setVisitData] = useState({});

  useEffect(() => {
    // 年齢層別患者数
    const ageGroups = {
      "0-20": 0,
      "21-40": 0,
      "41-60": 0,
      "61-80": 0,
      "81+": 0,
    };
    patients.forEach((patient) => {
      if (patient.age <= 20) ageGroups["0-20"]++;
      else if (patient.age <= 40) ageGroups["21-40"]++;
      else if (patient.age <= 60) ageGroups["41-60"]++;
      else if (patient.age <= 80) ageGroups["61-80"]++;
      else ageGroups["81+"]++;
    });
    setAgeData({
      labels: Object.keys(ageGroups),
      datasets: [
        {
          label: "年齢層別患者数",
          data: Object.values(ageGroups),
          backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
        },
      ],
    });

    // 性別患者数
    const genderCount = { 男性: 0, 女性: 0 };
    patients.forEach((patient) => {
      genderCount[patient.gender]++;
    });
    setGenderData({
      labels: Object.keys(genderCount),
      datasets: [
        {
          data: Object.values(genderCount),
          backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        },
      ],
    });

    // 月別来院数（直近12ヶ月）
    const visitCounts = {};
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      visitCounts[d.toISOString().slice(0, 7)] = 0;
    }
    patients.forEach((patient) => {
      patient.visitHistory.forEach((visit) => {
        const visitMonth = visit.visitDate.slice(0, 7);
        if (visitCounts.hasOwnProperty(visitMonth)) {
          visitCounts[visitMonth]++;
        }
      });
    });
    setVisitData({
      labels: Object.keys(visitCounts),
      datasets: [
        {
          label: "月別来院数",
          data: Object.values(visitCounts),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
      ],
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className="rounded-full bg-blue-100 p-3 mr-4">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">統計情報</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="総患者数" value={patients.length} icon={UsersIcon} />
        <StatCard title="今月の来院数" value={visitData.datasets?.[0].data.slice(-1)[0] || 0} icon={CalendarIcon} />
        <StatCard title="平均再来院率" value={`${((patients.reduce((sum, p) => sum + p.revisitRate, 0) / patients.length) * 100).toFixed(1)}%`} icon={ChartBarIcon} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">年齢層別患者数</h2>
          {ageData.labels && (
            <Bar
              data={ageData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "年齢層別患者数",
                  },
                },
              }}
            />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">性別患者数</h2>
          {genderData.labels && (
            <Pie
              data={genderData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "性別患者数",
                  },
                },
              }}
            />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">月別来院数（直近12ヶ月）</h2>
          {visitData.labels && (
            <Line
              data={visitData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "月別来院数",
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
