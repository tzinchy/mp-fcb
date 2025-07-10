import React, { useState } from 'react'

export default function StageCompletionForm({
  nextStages = [],
  onSubmit,
  onAfterSubmit, // 👈 добавляем
  activeStageName,
  apartmentDetails,
  activeStageHistoryId
}) {
  const [docNumber, setDocNumber] = useState('')
  const [docDate, setDocDate] = useState('')
  const [note, setNote] = useState('')
  const [selectedStage, setSelectedStage] = useState(() => {
    console.log(nextStages)
    if (nextStages.length === 1) return nextStages[0].stage_id
    return ''
  })

  const handleSubmit = async () => {
    if (!docNumber || !docDate || !selectedStage) {
      alert('Пожалуйста, заполните все обязательные поля.')
      return
    }

    try {
      await onSubmit({
        affair_id: apartmentDetails.affair_id,
        doc_number: docNumber,
        doc_date: docDate,
        note,
        next_stage_id: Number(selectedStage),
        current_stage_history_id: activeStageHistoryId
      })

      // 🔥 после успешной отправки
      onAfterSubmit?.()
    } catch (err) {
      console.error('Ошибка завершения этапа:', err)
    }
  }

  return (
    <div className="border rounded p-2 mt-6 bg-gray-50 space-y-2">
        <div>
            Завершить {activeStageName}
        </div>
      <div>
        <label className="block text-sm font-medium mb-1">Номер документа</label>
        <input
          type="text"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Дата документа</label>
        <input
          type="date"
          value={docDate}
          onChange={(e) => setDocDate(e.target.value)}
          className="w-full border rounded px-3 py-1 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Примечание (необязательно)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full border rounded px-3 py-1 text-sm resize-none"
        />
      </div>

      {nextStages.length > 1 && (
        <div>
          <label className="block text-sm font-medium mb-1">Следующий этап</label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full border rounded px-3 py-1 text-sm"
          >
            <option value="">Выберите этап</option>
{nextStages.map((option, idx) => (
  <option key={idx} value={option.stage_id}>
    {option.stage_name}
  </option>
))}
          </select>
        </div>
      )}

      {nextStages.length === 1 && (
        <p className="text-sm text-gray-600 italic">
          Следующий этап: {nextStages[0].stage_name}
        </p>
      )}

      <div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Подтвердить
        </button>
      </div>
    </div>
  )
}