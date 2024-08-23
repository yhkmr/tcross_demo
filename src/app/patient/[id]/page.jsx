"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { patients } from "@/data/patients";
import { doctors } from "@/data/doctors";

const dropoutReasons = ["距離が遠い", "交通機関", "医師とのミスマッチ", "スタッフの対応遅れ", "リマインド不足"];

export default function PatientDetail() {
  const params = useParams();
  const id = parseInt(params.id);
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return <div>患者が見つかりません</div>;
  }

  const doctor = doctors.find((d) => d.id === patient.doctorId);

  const getSimilarPatients = (key, value, limit = 5) => {
    return patients
      .filter((p) => p.id !== patient.id)
      .sort((a, b) => Math.abs(a[key] - value) - Math.abs(b[key] - value))
      .slice(0, limit);
  };

  const nearbyPatients = getSimilarPatients("distance", patient.distance);
  const sameGenderPatients = patients.filter((p) => p.gender === patient.gender && p.id !== patient.id).slice(0, 5);
  const sameAgePatients = getSimilarPatients("age", patient.age);

  // 脱落可能性の理由をランダムに3つ選択
  const selectedReasons = dropoutReasons
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((reason) => ({
      reason,
      percentage: Math.floor(Math.random() * 100),
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/patient" className="text-blue-600 hover:text-blue-900 mb-4 inline-block">
        ← 一覧に戻る
      </Link>
      <h1 className="text-3xl font-bold mb-6">{patient.name}さんの詳細情報</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">患者情報</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">氏名</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">年齢</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.age}歳</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">性別</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.gender}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">最終来院日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.lastVisit}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">主な疾患</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.disease}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">自宅までの距離</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.distance} km</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">血液型</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.bloodType}型</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">体重</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.weight} kg</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">身長</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.height} cm</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">1ヶ月以内の再来院率</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="w-64 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${patient.revisitRate * 100}%` }}></div>
                  </div>
                  <span>{(patient.revisitRate * 100).toFixed(1)}%</span>
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">担当医師</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link href={`/doctor/${doctor.id}`} className="text-blue-600 hover:text-blue-900">
                  {doctor.name} ({doctor.specialization})
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">脱落可能性</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <ul className="divide-y divide-gray-200">
          {selectedReasons.map((item, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{item.reason}</p>
                <p className="text-sm text-gray-500">{item.percentage}%</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">来院履歴</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来院日</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">疾患</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">次回来院予定日</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当医師</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patient.visitHistory.map((visit, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{visit.visitDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visit.disease}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visit.nextVisitDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/doctor/${doctor.id}`} className="text-blue-600 hover:text-blue-900">
                    {doctor.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">関連患者</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">近隣の患者</h3>
          <ul className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
            {nearbyPatients.map((p) => (
              <li key={p.id} className="px-4 py-3 hover:bg-gray-50">
                <Link href={`/patient/${p.id}`} className="text-blue-600 hover:text-blue-900">
                  {p.name} ({p.distance}km)
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">同性の患者</h3>
          <ul className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
            {sameGenderPatients.map((p) => (
              <li key={p.id} className="px-4 py-3 hover:bg-gray-50">
                <Link href={`/patient/${p.id}`} className="text-blue-600 hover:text-blue-900">
                  {p.name} ({p.age}歳)
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">近い年齢の患者</h3>
          <ul className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
            {sameAgePatients.map((p) => (
              <li key={p.id} className="px-4 py-3 hover:bg-gray-50">
                <Link href={`/patient/${p.id}`} className="text-blue-600 hover:text-blue-900">
                  {p.name} ({p.age}歳)
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
