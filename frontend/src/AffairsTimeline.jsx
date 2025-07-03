import React, { useState, useEffect } from 'react'
import StageCompletionForm from './StageCompletionForm'

export default function AffairsTimeline({ problems, setNextPages }) {
  const [activeTab, setActiveTab] = useState(
    problems.length > 0 ? problems[0].problem_id : null
  )
  const [showForm, setShowForm] = useState(false)
  const [currentNextStages, setCurrentNextStages] = useState([])
  const [activeStageName, setActiveStageName] = useState('')

  const activeProblem = problems.find(p => p.problem_id === activeTab)
  const lastStage = activeProblem?.stages.at(-1)

  useEffect(() => {
    if (lastStage) {
      setCurrentNextStages(lastStage.next_stage || [])
      setActiveStageName(lastStage.label)
      setNextPages?.(lastStage.next_stage || [])
    }
  }, [lastStage])

  const handleSubmit = (data) => {
    console.log('⏭ Завершение этапа:', {
      currentStageId: lastStage?.stage_id,
      ...data,
    })
    setShowForm(false)
  }

  return (
    <div className="p-6">
      {/* Вкладки */}
      <div className="flex space-x-2 border-b mb-4">
        {problems.map(problem => (
          <button
            key={problem.problem_id}
            onClick={() => setActiveTab(problem.problem_id)}
            className={`px-4 py-2 text-sm rounded-t ${
              activeTab === problem.problem_id
                ? 'bg-white border border-b-transparent font-semibold text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {problem.problem_name}
          </button>
        ))}
      </div>

      {/* Таймлайн */}
      {activeProblem && (
        <div className="relative border-l-2 border-gray-300 ml-6">
          {activeProblem.stages.map((stage, index) => (
            <div key={stage.id} className="mb-10 ml-4 relative">
              <div className="absolute -left-5 top-1 w-3 h-3 bg-blue-600 rounded-full shadow"></div>

              <div className="text-base font-semibold text-gray-900">{stage.label}</div>

              {stage.created_at && (
                <div className="text-sm text-gray-700">{stage.created_at}</div>
              )}

              {(stage.date || stage.number) && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">
                    Док. №: {stage.number || '—'} от {stage.date || '—'}
                  </span>
                </div>
              )}

              {/* Только если последний этап */}
              {index === activeProblem.stages.length - 1 && stage.next_stage && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                  >
                    Завершить «{stage.label}»
                  </button>
                </div>
              )}

              {index < activeProblem.stages.length - 1 && (
                <div className="absolute left-[-6px] top-5 w-px h-10 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Модалка */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">
              Завершение: {activeStageName}
            </h3>
            <StageCompletionForm
              nextStages={currentNextStages}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  )
}