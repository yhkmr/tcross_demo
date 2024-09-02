"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { patients } from "@/data/patients";
import { doctors } from "@/data/doctors";

export default function AtRiskPatientList() {
  const [sortColumn, setSortColumn] = useState("revisitRate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const atRiskPatients = useMemo(() => {
    return patients.filter((patient) => patient.revisitRate < 0.3);
  }, []);

  const sortedPatients = useMemo(() => {
    return [...atRiskPatients].sort((a, b) => {
      if (sortColumn === "doctorName") {
        const doctorA = doctors.find((d) => d.id === a.doctorId);
        const doctorB = doctors.find((d) => d.id === b.doctorId);
        return sortDirection === "asc" ? doctorA.name.localeCompare(doctorB.name) : doctorB.name.localeCompare(doctorA.name);
      }
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [atRiskPatients, sortColumn, sortDirection]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPatients.slice(startIndex, startIndex + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const pageCount = Math.ceil(sortedPatients.length / pageSize);

  const getRevisitRateColor = (rate) => {
    if (rate < 0.1) return "bg-red-600";
    if (rate < 0.2) return "bg-orange-500";
    return "bg-yellow-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">予測離脱患者一覧</h1>

      <div className="mb-4 flex flex-wrap gap-4">
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border rounded px-2 py-1">
          <option value={10}>10件表示</option>
          <option value={20}>20件表示</option>
          <option value={30}>30件表示</option>
          <option value={50}>50件表示</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["name", "age", "gender", "lastVisit", "revisitRate", "disease", "distance", "doctorName"].map((column) => (
                <th key={column} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(column)}>
                  <div className="flex items-center">
                    {column === "name" ? "氏名" : column === "age" ? "年齢" : column === "gender" ? "性別" : column === "lastVisit" ? "最終来院日" : column === "revisitRate" ? "再来院率" : column === "disease" ? "疾患" : column === "distance" ? "距離" : "担当医師"}
                    {sortColumn === column && (sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />)}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                詳細
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPatients.map((patient) => (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {patient.lastVisit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className={`h-2.5 rounded-full ${getRevisitRateColor(patient.revisitRate)}`} style={{ width: `${patient.revisitRate * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{(patient.revisitRate * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.disease}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.distance} km</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctors.find((d) => d.id === patient.doctorId)?.name}</td>
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

      <div className="mt-4 flex justify-between items-center">
        <div>
          全{sortedPatients.length}件中 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedPatients.length)}件を表示
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            let pageNum;
            if (pageCount <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= pageCount - 2) {
              pageNum = pageCount - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-3 py-1 rounded ${currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                {pageNum}
              </button>
            );
          })}
          <button onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
