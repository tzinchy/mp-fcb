import AffairsDetails from "./AffairsHistory";
import AffairTableTanstack from "./AffairsTable";
import React, { useState } from "react";

export default function AffairsPage() {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(false);
    // const [apartmentDetails, setApartmentDetails] = useState(null);
const apartmentDetails = selectedRow || null

    return(
<div className="relative flex w-full">
  {/* Левая часть — таблица */}
  <div
    className={`flex-grow transition-all duration-300 ${
      isDetailsVisible ? 'mr-[35vw]' : ''
    }`}
  >
    <div
    className="h-[70px] flex items-center justify-center">
        <h1
        className="text-xl flex items-center justify-center">
            Проблемные
        </h1>
    </div>
    <AffairTableTanstack
  onRowClick={(rowData) => {
    setSelectedRow(rowData)
    setIsDetailsVisible(true)
  }}
/>
  </div>

  {/* Правая часть — модальное окно */}
  <div
    className={`absolute top-0 right-0 h-[calc(100vh-3.67rem)] transition-transform duration-300 ease-in-out ${
      isDetailsVisible ? 'translate-x-0' : 'translate-x-full'
    }`}
    style={{ width: '35vw', WebkitOverflowScrolling: 'touch' }}
  >
    <div className="h-full flex flex-col shadow-lg bg-white">
      <AffairsDetails
        setIsDetailsVisible={setIsDetailsVisible}
        setSelectedRow={setSelectedRow}
        apartmentDetails={apartmentDetails}
        className="flex-1"
      />
    </div>
  </div>
</div>
    )

}