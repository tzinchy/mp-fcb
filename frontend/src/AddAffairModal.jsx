import { useState } from "react";

export function AddAffairModal({ problemsOptions, isOpen, setIsOpen, onSubmit }) {
//   const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    affair_id: "",
    kpu: "",
    fio: "",
    district: "",
    municipal_district: "",
    house_address: "",
    unom: "",
    apart_number: "",
    room_apart_number: "",
    problems: []
  });

  const handleUrlChange = (e) => {
    const url = e.target.value;
    const params = new URLSearchParams(url.split("?")[1]);
    const affair_id = Number(params.get("ObjId")) || 0;
    setForm(prev => ({ ...prev, affair_id }));
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    setIsOpen(false); // Закрыть после сохранения
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-xl p-6 w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-bold">Добавление записи</h2>

            <div>
              <label>Ссылка:</label>
              <input
                type="text"
                value={form.url}
                onChange={handleUrlChange}
                className="w-full border px-2 py-1"
              />
              {form.affair_id && (
                <p className="text-sm text-gray-500">ID: {form.affair_id}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Номер КПУ" value={form.kpu} onChange={(e) => handleChange("kpu", e.target.value)} className="border px-2 py-1" />
              <input type="text" placeholder="Фамилия И.О." value={form.fio} onChange={(e) => handleChange("fio", e.target.value)} className="border px-2 py-1" />
              <input type="text" placeholder="Округ" value={form.district} onChange={(e) => handleChange("district", e.target.value)} className="border px-2 py-1" />
              <input type="text" placeholder="Район" value={form.municipal_district} onChange={(e) => handleChange("municipal_district", e.target.value)} className="border px-2 py-1" />
              <input type="text" placeholder="Адрес" value={form.house_address} onChange={(e) => handleChange("house_address", e.target.value)} className="border px-2 py-1" />
              <input type="number" placeholder="UNOM" value={form.unom} onChange={(e) => handleChange("unom", Number(e.target.value))} className="border px-2 py-1" />
              <input type="text" placeholder="Номер квартиры" value={form.apart_number} onChange={(e) => handleChange("apart_number", e.target.value)} className="border px-2 py-1" />
              <input type="text" placeholder="Номер комнаты" value={form.room_apart_number} onChange={(e) => handleChange("room_apart_number", e.target.value)} className="border px-2 py-1" />
            </div>

<div>
  <label>Проблема:</label>
  <select
    className="w-full border px-2 py-1"
    value={form.problems.map(String)} // преобразуем числа в строки для <option value>
    onChange={(e) => {
      const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
      handleChange("problems", selected);
    }}
  >
    <option key="-" value="-">
        -
    </option>
    {problemsOptions.map((prob) => (
      <option key={prob.value} value={prob.value}>
        {prob.label}
      </option>
    ))}
  </select>
</div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded">
                Отмена
              </button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}