import React, { useState, useEffect } from "react";
import AffairsTimeline from "./AffairsTimeline";
import StageCompletionForm from "./StageCompletionForm";
const backendUrl = import.meta.env.VITE_BACKEND_URL

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
  const [stages, setStages] = useState([]);

  useEffect(() => {
  if (!apartmentDetails?.affair_id) return;

  fetch(`${backendUrl}/old_apart/${apartmentDetails.affair_id}/get_stages`)
    .then(res => res.json())
    .then(json => {
      setStages(json); // ожидается массив проблем с этапами
    })
    .catch(console.error);
}, [apartmentDetails?.affair_id]);

  function handleClose() {
    setIsDetailsVisible(false);
    setSelectedRow(false);
  }

//   const stages = [
//   {
//     "problem_id": 1,
//     "problem_name": "Очередник",
//     "stages": [
//       {
//         "id": 1,
//         "date": "2025-07-03",
//         "label": "Первый этап",
//         "number": "test1",
//         "stage_id": 1,
//         "created_at": "2025-07-03T13:25:57.834032+03:00",
//         "next_stage": [
//           {
//             "stage_id": 2
//           }
//         ],
//         "updated_at": "2025-07-03T13:25:57.834032+03:00",
//         "stage_status": "Не начато"
//       }
//     ]
//   },
//   {
//     "problem_id": 2,
//     "problem_name": "Много судов",
//     "stages": [
//       {
//         "id": 2,
//         "date": "2025-07-03",
//         "label": "Первый этап ",
//         "number": "test1",
//         "stage_id": 2,
//         "created_at": "2025-07-03T13:25:57.834032+03:00",
//         "next_stage": [
//           {
//             "stage_id": 3
//           }
//         ],
//         "updated_at": "2025-07-03T13:25:57.834032+03:00",
//         "stage_status": "Не начато"
//       }
//     ]
//   }
// ]

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