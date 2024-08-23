"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { patients } from "@/data/patients";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [ageData, setAgeData] = useState({});
  const recentPatients = patients.slice(0, 5); // 最新の5人の患者を取得

  useEffect(() => {
    // 年齢層別患者数（統計の一部抜粋）
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
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 患者一覧の一部抜粋 */}
        <div className="bg-white p-6 rounded-lg shadow col-span-full">
          <h2 className="text-xl font-semibold mb-4">最近の患者</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    名前
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年齢
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終来院日
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    次回予約
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    詳細
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-700">{patient.name[0]}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}歳</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {patient.visitHistory[0].nextVisitDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/patient/${patient.id}`} className="text-indigo-600 hover:text-indigo-900">
                        詳細を見る
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/patient" className="text-blue-600 hover:underline mt-4 inline-block">
            すべての患者を見る →
          </Link>
        </div>

        {/* 統計の一部抜粋 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">年齢層別患者数</h2>
          {ageData.labels && <Bar data={ageData} />}
          <Link href="/statistics" className="text-blue-600 hover:underline mt-4 inline-block">
            詳細な統計を見る →
          </Link>
        </div>

        {/* お知らせ */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">お知らせ</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span>システムメンテナンスのお知らせ（2024/8/15 深夜）</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>新機能：患者さまへのリマインダー機能を追加しました</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              <span>医療セミナーのご案内（2024/9/1 開催）</span>
            </li>
          </ul>
        </div>

        {/* タスク */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">今日のタスク</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span>9:00 - 佐藤さんの診察</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span>11:00 - スタッフミーティング</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>14:00 - 新しい医療機器のトレーニング</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              <span>16:00 - 田中さんの検査結果確認</span>
            </li>
          </ul>
          <Link href="/tasks" className="text-blue-600 hover:underline mt-4 inline-block">
            すべてのタスクを見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
