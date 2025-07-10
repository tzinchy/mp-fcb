import React, { useState, useEffect, useRef } from "react";
import AffairsDetails from "./AffairsHistory";
import AffairTableTanstack from "./AffairsTable";
import { AddAffairModal } from "./AddAffairModal";
const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function AffairsPage() {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [problemsOptions, setProblemsOptions] = useState([]);
  const apartmentDetails = selectedRow || null;

  const tableRef = useRef();

  const handleReloadTable = () => {
    tableRef.current?.reload(); // вызов метода reload у таблицы
  };



  useEffect(() => {
    fetch(`${backendUrl}/main/all_problems`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          value: item.problem_id,
          label: item.problem,
        }));
        setProblemsOptions(formatted);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке проблем:", error);
      });
  }, []);

  return (
    <div className="relative flex w-full">
      {/* Левая часть — таблица */}
      <div
        className={`flex-grow transition-all duration-300 ${
          isDetailsVisible ? "mr-[35vw]" : ""
        }`}
      >
        <div className="h-[70px] flex items-center justify-between px-6">
          <h1 className="text-xl">Проблемные</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Добавить запись
          </button>
        </div>
<AffairTableTanstack
  ref={tableRef}
  onRowClick={(rowData) => {
    setSelectedRow(rowData);
    setIsDetailsVisible(true);
  }}
/>
      </div>

      {/* Правая часть — детали */}
      <div
        className={`absolute top-0 right-0 h-[calc(100vh-3.67rem)] transition-transform duration-300 ease-in-out ${
          isDetailsVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "35vw", WebkitOverflowScrolling: "touch" }}
      >
        <div className="h-full flex flex-col shadow-lg bg-white">
          <AffairsDetails
            onAfterStageComplete={handleReloadTable}
            setIsDetailsVisible={setIsDetailsVisible}
            setSelectedRow={setSelectedRow}
            apartmentDetails={apartmentDetails}
            className="flex-1"
          />
        </div>
      </div>

      {/* Модальное окно добавления */}
      {isAddModalOpen && (
        <AddAffairModal
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          onAfterSubmit={handleReloadTable}
          problemsOptions={problemsOptions}
onSubmit={async (data) => {
  try {
    const response = await fetch(`${backendUrl}/old_apart/create_old_apart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка: ${response.status} — ${errorText}`);
    }

    const result = await response.json();
    console.log("Успешно добавлено:", result);

    handleReloadTable(); // 🔥 обновить таблицу после добавления
    setIsAddModalOpen(false);
  } catch (error) {
    console.error("Ошибка при добавлении дела:", error);
    alert("Не удалось добавить запись. Проверьте данные и соединение.");
  }
}}
        />
      )}
    </div>
  );
}