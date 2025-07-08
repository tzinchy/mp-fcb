import React, { useState, useEffect } from 'react'
import StageCompletionForm from './StageCompletionForm'
import { parseISO, format } from 'date-fns'
import {CircleCheck, Circle} from 'lucide-react'
const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function AffairsTimeline({ problems, setNextPages, apartmentDetails, setStages }) {
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

useEffect(() => {
  if (problems.length > 0) {
    setActiveTab(problems[0].problem_id)
  }
}, [problems])

useEffect(() => {
  setShowForm(false)
}, [activeTab])

const handleSubmit = async (data) => {
  console.log('⏭ Завершение этапа:', {
    currentStageId: lastStage?.stage_id,
    ...data,
  });

  try {
    const response = await fetch(`${backendUrl}/old_apart/set_next_stage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentStageId: lastStage?.stage_id,
        ...data,
      }),
    });

    if (!response.ok) throw new Error('Ошибка при запросе');

    const json = await response.json();
    setStages(json); // ожидается массив проблем с этапами
  } catch (error) {
    console.error('❌ Ошибка при завершении этапа:', error);
  } finally {
    setShowForm(false);
  }
};

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
                ? 'bg-white border border-b-transparent shadow-xl font-semibold text-gray-600'
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
  <div key={stage.stage_history_id} className="mb-10 ml-4 relative">
    {index === activeProblem.stages.length - 1
      ? <Circle color='orange' fill='white' className='absolute left-[-29px]' />
      : <CircleCheck color='green' fill='white' className='absolute left-[-29px]' />
    }

    <div className="text-base font-semibold text-gray-900">{stage.label}</div>

    {stage.created_at && (
      <div className="text-xs text-gray-500">
        {format(parseISO(stage.created_at), 'dd.MM.yyyy HH:mm')}
      </div>
    )}

    {(stage.date || stage.number) && (
      <div className="text-sm text-gray-800 mt-1">
        <span className="font-['Courier_New']">
          Док: №{stage.number || '—'} от {stage.date ? format(parseISO(stage.date), 'dd.MM.yyyy') : '—'}
        </span>
      </div>
    )}

    {index === activeProblem.stages.length - 1 && Array.isArray(stage.next_stage) && stage.next_stage.length > 0 && (
      <>
        <div className="mt-2 text-sm text-gray-500 italic space-y-1">
          {stage.next_stage.map((next, i) => (
            <div key={next.stage_id || i} className="text-xs">
              → Доступно: <span className="text-xs text-blue-600">{next.status_name}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            Завершить «{stage.label}»
          </button>
        </div>
      </>
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
              apartmentDetails={apartmentDetails}
              activeStageHistoryId={lastStage.stage_history_id}
            />
          </div>
        </div>
      )}
    </div>
  )
}