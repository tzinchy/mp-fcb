import React, { useState } from "react";
import AffairsTimeline from "./AffairsTimeline";
import StageCompletionForm from "./StageCompletionForm";

export default function AffairsDetails({
  apartmentDetails,
  apartType = "OldApart",
  setIsDetailsVisible,
  setSelectedRow,
  selectedRowId,
  fetchApartments,
  className = "",
}) {
  const [nextStages, setNextStages] = useState([]);
  const [activeStageName, setActiveStageName] = useState('');

  function handleClose() {
    setIsDetailsVisible(false);
    setSelectedRow(false);
  }

  const stages = [
    {
      problem_id: 1,
      problem_name: "Очередник",
      stages: [
        {
          id: 1,
          label: "Не начато",
          stage_id: 1,
          date: "",
          number: "",
          created_at: "2024-12-02",
          next_stage: [{ 2: "В процессе", stage_id: 2 }],
        },
        {
          id: 2,
          label: "В процессе",
          stage_id: 2,
          date: "2025-01-15",
          number: 45345,
          created_at: "2025-01-03",
          next_stage: [{ 3: "Ожидание ответа от минобороны", stage_id: 3 }],
        },
        {
          id: 3,
          label: "Ожидание ответа от минобороны",
          stage_id: 3,
          date: "",
          number: '',
          created_at: "2025-01-17",
          next_stage: [{ 4: "Ожидание ответа от Росимущества", stage_id: 4 }, { 2: "В процессе", stage_id: 2 }],
        },
      ],
    },
    {
      problem_id: 3,
      problem_name: "Федеральная собственность",
      stages: [
        {
          id: 1,
          label: "Не начато",
          stage_id: 1,
          date: "",
          number: "",
          created_at: "2024-12-06",
          next_stage: [{ 2: "В процессе", stage_id: 2 }],
        },
        {
          id: 2,
          label: "В процессе",
          stage_id: 2,
          date: "",
          number: "",
          created_at: "2025-01-10",
          next_stage: [{ 3: "Ожидание ответа от минобороны", stage_id: 3 }],
        },
      ],
    },
  ];

  return (
    <div
      className={`relative z-20 flex flex-col bg-white rounded transition-all duration-300 shadow-lg ${className}`}
      style={{
        minWidth: "350px",
        maxHeight: "calc(100vh)",
        minHeight: "calc(100vh)",
      }}
    >
      {/* Заголовок */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold truncate">
            {apartType !== "OldApart"
              ? apartmentDetails?.house_address + ", кв. " + apartmentDetails?.apart_number
              : apartmentDetails?.fio || ""}
          </h2>
          <p className="text-sm text-gray-600">
            {apartType === "OldApart"
              ? apartmentDetails
                ? `${apartmentDetails.district}, ${apartmentDetails.municipal_district}, ${apartmentDetails.house_address}, кв. ${apartmentDetails.apart_number}`
                : ""
              : apartmentDetails
              ? `${apartmentDetails.district}, ${apartmentDetails.municipal_district}`
              : ""}
          </p>
        </div>

        <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file-text"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
          <button
            className="h-10 w-10 p-0 border border-gray-300 rounded-full flex items-center justify-center"
            onClick={handleClose}
          >
            <span className="h-6 w-6 text-gray-600">X</span>
          </button>
        </div>
      </div>

      {/* Контент: только таймлайн */}
      <div className="p-4 overflow-y-auto">
        <AffairsTimeline problems={stages} setNextStages={setNextStages} setActiveStageName={setActiveStageName}/>
      </div>
      <div>
      {/* <StageCompletionForm
        nextStages={nextStages}
        // activeStageName={activeStageName}
        onSubmit={(formData) => {
            console.log('👉 отправка на бэкенд:', formData)
            // вызов API тут, например:
            // axios.post('/api/complete_stage', formData)
        }} */}
        {/* /> */}
        </div>
    </div>
  );
}