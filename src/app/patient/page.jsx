"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from "@heroicons/react/20/solid";
import { patients } from "@/data/patients";
import { doctors } from "@/data/doctors";

export default function PatientList() {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filters, setFilters] = useState({ distance: "", revisitRate: "", gender: "", doctorId: "" });
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

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      return (filters.distance === "" || patient.distance <= parseFloat(filters.distance)) && (filters.revisitRate === "" || patient.revisitRate >= parseFloat(filters.revisitRate)) && (filters.gender === "" || patient.gender === filters.gender) && (filters.doctorId === "" || patient.doctorId === parseInt(filters.doctorId));
    });
  }, [filters]);

  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      if (sortColumn === "doctorName") {
        const doctorA = doctors.find((d) => d.id === a.doctorId);
        const doctorB = doctors.find((d) => d.id === b.doctorId);
        return sortDirection === "asc" ? doctorA.name.localeCompare(doctorB.name) : doctorB.name.localeCompare(doctorA.name);
      }
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPatients, sortColumn, sortDirection]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPatients.slice(startIndex, startIndex + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const pageCount = Math.ceil(sortedPatients.length / pageSize);

  const exportCSV = () => {
    const header = Object.keys(patients[0]).join(",");
    const csv = [header, ...sortedPatients.map((patient) => Object.values(patient).join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "patients.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const today = new Date();

  const isOverdue = (patient) => {
    const lastVisit = new Date(patient.lastVisit);
    const nextVisitDate = new Date(patient.visitHistory[0].nextVisitDate);
    return nextVisitDate < today && lastVisit < nextVisitDate;
  };

  const getRevisitRateColor = (rate) => {
    if (rate < 0.3) return "bg-red-600";
    if (rate < 0.5) return "bg-yellow-500";
    return "bg-blue-600";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">患者一覧</h1>

      <div className="mb-4 flex flex-wrap gap-4">
        <input type="number" name="distance" placeholder="最大距離 (km)" onChange={handleFilter} className="border rounded px-2 py-1" />
        <input type="number" name="revisitRate" placeholder="最小再来院率" step="0.01" onChange={handleFilter} className="border rounded px-2 py-1" />
        <select name="gender" onChange={handleFilter} className="border rounded px-2 py-1">
          <option value="">性別</option>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
        </select>
        <select name="doctorId" onChange={handleFilter} className="border rounded px-2 py-1">
          <option value="">担当医師</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <button onClick={exportCSV} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          CSVエクスポート
        </button>
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
              <tr key={patient.id} className={`hover:bg-gray-50 ${isOverdue(patient) ? "bg-red-100" : ""}`}>
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
