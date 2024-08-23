// src/data/patients.js
import { doctors } from "./doctors";

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateVisitHistory = (patientId, count) => {
  const history = [];
  const diseases = ["高血圧", "糖尿病", "関節炎", "喘息", "高脂血症", "甲状腺機能低下症", "前立腺肥大", "鉄欠乏性貧血", "慢性閉塞性肺疾患", "線維筋痛症"];
  const today = new Date();
  let lastVisitDate = new Date(today.getFullYear(), today.getMonth() - 24, today.getDate()); // 2年前から開始

  for (let i = 0; i < count; i++) {
    const visitDate = generateRandomDate(lastVisitDate, today);
    const nextVisitDate = generateRandomDate(visitDate, new Date(visitDate.getFullYear() + 2, visitDate.getMonth(), visitDate.getDate()));

    history.push({
      patientId,
      visitDate: visitDate.toISOString().split("T")[0],
      disease: diseases[Math.floor(Math.random() * diseases.length)],
      nextVisitDate: nextVisitDate.toISOString().split("T")[0],
    });

    lastVisitDate = visitDate;
  }

  return history.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate)); // 新しい順にソート
};

const generatePatients = (count) => {
  const patients = [];
  const bloodTypes = ["A", "B", "O", "AB"];
  const genders = ["男性", "女性"];

  for (let i = 1; i <= count; i++) {
    const age = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    const visitHistoryCount = Math.floor(Math.random() * 5) + 1; // 1-5回の来院履歴
    const visitHistory = generateVisitHistory(i, visitHistoryCount);
    const lastVisit = visitHistory[0].visitDate;

    patients.push({
      id: i,
      name: `患者${i}`,
      age: age,
      gender: genders[Math.floor(Math.random() * genders.length)],
      lastVisit: lastVisit,
      revisitRate: Math.random().toFixed(2),
      disease: visitHistory[0].disease,
      distance: (Math.random() * 10).toFixed(1),
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      weight: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
      height: Math.floor(Math.random() * (190 - 150 + 1)) + 150,
      visitHistory: visitHistory,
      doctorId: doctors[Math.floor(Math.random() * doctors.length)].id, // 担当医師のIDを追加
    });
  }
  return patients;
};

export const patients = generatePatients(100);
