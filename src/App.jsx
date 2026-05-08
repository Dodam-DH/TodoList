import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'todo-app-items';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error('localStorage parse error', error);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const remainingCount = useMemo(
    () => items.filter((item) => !item.done).length,
    [items]
  );

  const handleAdd = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setItems((current) => [
      { id: Date.now(), text: trimmed, done: false },
      ...current,
    ]);
    setText('');
  };

  const toggleDone = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-md shadow-slate-200/70 backdrop-blur-sm">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">할 일 목록</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">간단한 할 일 관리, 완료 체크와 삭제, localStorage 자동 저장을 지원합니다.</p>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleAdd}>
            <label htmlFor="todo-input" className="sr-only">할 일 입력</label>
            <input
              id="todo-input"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="새 할 일을 입력하세요"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              추가
            </button>
          </form>
          <div className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800 shadow-inner shadow-brand-100/60">
            남은 할 일: <strong>{remainingCount}</strong>
          </div>
        </section>

        <section className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500 shadow-sm">
              아직 추가된 할 일이 없습니다.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleDone(item.id)}
                        className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className={`text-base font-medium ${item.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {item.text}
                      </span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
