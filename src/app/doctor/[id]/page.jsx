"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { doctors } from "@/data/doctors";
import { patients } from "@/data/patients";
import { UserIcon, StarIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function DoctorDetail() {
  const params = useParams();
  const id = parseInt(params.id);
  const doctor = doctors.find((d) => d.id === id);
  const doctorPatients = patients.filter((p) => p.doctorId === id);

  if (!doctor) {
    return <div>医師が見つかりません</div>;
  }

  // 平均患者継続率を計算
  const averageRetentionRate = ((doctorPatients.reduce((sum, patient) => sum + parseFloat(patient.revisitRate), 0) / doctorPatients.length) * 100).toFixed(1);

  // 患者満足度スコアを計算 (仮のロジック)
  const satisfactionScore = Math.floor(Math.random() * 31) + 70; // 70-100の範囲でランダムな値

  // 予測離脱患者を抽出
  const atRiskPatients = doctorPatients
    .filter((patient) => patient.revisitRate < 0.3)
    .sort((a, b) => a.revisitRate - b.revisitRate)
    .slice(0, 10);

  const getRevisitRateColor = (rate) => {
    if (rate < 0.1) return "bg-red-600";
    if (rate < 0.2) return "bg-orange-500";
    return "bg-yellow-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/doctor" className="text-blue-600 hover:text-blue-900 mb-4 inline-block">
        ← 医師一覧に戻る
      </Link>
      <h1 className="text-3xl font-bold mb-6">{doctor.name} 医師の詳細情報</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">医師情報</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">名前</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctor.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">専門</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctor.specialization}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">担当患者数</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorPatients.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">平均患者継続率</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">患者の再来院率の平均</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold text-gray-900">{averageRetentionRate}%</div>
              <div className="mt-1 relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div style={{ width: `${averageRetentionRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-400 mr-4" />
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">患者満足度スコア</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">患者からの評価 (100点満点)</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold text-gray-900">{satisfactionScore}</div>
              <div className="mt-1 relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                  <div style={{ width: `${satisfactionScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">担当患者リスト</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齢</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性別</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終来院日</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctorPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.lastVisit}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/patient/${patient.id}`} className="text-indigo-600 hover:text-indigo-900">
                    詳細を見る
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4">予測離脱患者一覧（上位10名）</h2>
      {atRiskPatients.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齢</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終来院日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">再来院率</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {atRiskPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className={`h-2.5 rounded-full ${getRevisitRateColor(patient.revisitRate)}`} style={{ width: `${patient.revisitRate * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500">{(patient.revisitRate * 100).toFixed(1)}%</span>
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
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700">該当患者がありません</p>
        </div>
      )}
    </div>
  );
}
