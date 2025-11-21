import React from 'react'
import {useState, useEffect} from 'react'

const App = () => {
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [task, setTask] = useState(() => {
    try {
      const raw = localStorage.getItem('notes')
      const parsed = raw ? JSON.parse(raw) : []
      return parsed.map((item) => ({
        ...item,
        id: item.id || `${Date.now()}-${Math.random()}`,
      }))
    } catch (e) {
      return []
    }
  })
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDetail, setEditDetail] = useState('')

  const submitHandler = (e) => {
    e.preventDefault();
     const copyTask=[...task]
     copyTask.push({
       title,
       detail,
       createdAt: new Date().toISOString(),
       pinned: false,
       id: `${Date.now()}-${Math.random()}`,
     })
     setTask(copyTask)
     console.log(task)
     
     setTitle('')
     setDetail('')
  }

  const deleteNote = (id) => {
    const copyTask = [...task]
    const i = copyTask.findIndex((t) => t.id === id)
    if (i !== -1) copyTask.splice(i, 1)
    setTask(copyTask)
    console.log('Note deleted. Remaining:', copyTask)
  }

  const togglePin = (id) => {
    const copyTask = [...task]
    const i = copyTask.findIndex((t) => t.id === id)
    if (i !== -1) {
      copyTask[i].pinned = !copyTask[i].pinned
      setTask(copyTask)
      console.log(`Toggled pin for id ${id}:`, copyTask[i])
    }
  }

  const startEdit = (id) => {
    const i = task.findIndex((t) => t.id === id)
    if (i !== -1) {
      setEditId(id)
      setEditTitle(task[i].title)
      setEditDetail(task[i].detail)
    }
  }

  const saveEdit = (id) => {
    const copyTask = [...task]
    const i = copyTask.findIndex((t) => t.id === id)
    if (i !== -1) {
      copyTask[i].title = editTitle
      copyTask[i].detail = editDetail
      setTask(copyTask)
      setEditId(null)
      console.log('Note updated:', copyTask[i])
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(task))
    } catch (e) {
      console.warn('Failed to save notes to localStorage', e)
    }
  }, [task])

  const cancelEdit = () => {
    setEditId(null)
    setEditTitle('')
    setEditDetail('')
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col lg:flex-row'>
      {/* Top-left logo (place your logo file at `public/logo.png`) */}
     
      {/* Left Panel: Add Notes Form - Fixed */}
      <div  className='lg:w-2/5 w-full bg-slate-800 shadow-2xl p-8 lg:border-r border-slate-700 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto'>
        <div className='max-w-md mx-auto'>
          <div className='h-18 w-18 object-cover absolute left-6 -mt-4 mb-4'>
           <img   src="https://img.icons8.com/bubbles/100/apple-notes.png" alt="note"/>
           </div>
          <h1  className='text-4xl font-bold text-white mb-2 px-16'>My Notes</h1>
          <p className='text-slate-400 mb-8'>Create and organize your thoughts</p>
          
          <form onSubmit={(e) => submitHandler(e)} className='space-y-6'>
            {/* Title Input */}
            <div>
              <label className='block text-sm font-semibold text-slate-300 mb-2'>Note Title</label>
              <input
                type='text'
                placeholder='Enter a title...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className='block text-sm font-semibold text-slate-300 mb-2'>Note Content</label>
              <textarea
                placeholder='Write your note here...'
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className='w-full h-40 px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none'
              />
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg'
            >
              + Add Note
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Notes Grid - Scrollable */}
      <div className='lg:w-3/5 w-full p-8 overflow-y-auto lg:h-screen'>
        <div className='max-w-5xl'>
          <h2 className='text-3xl font-bold text-white mb-2'>Recent Notes</h2>
          <p className='text-slate-400 mb-8'>{task.length} note{task.length !== 1 ? 's' : ''}</p>

          {task.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-center'>
              <div className='text-6xl mb-4'>📝</div>
              <p className='text-slate-400 text-lg'>No notes yet. Create one to get started!</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[
                ...task
              ].sort((a, b) => {
                if ((a.pinned === b.pinned)) return new Date(b.createdAt) - new Date(a.createdAt)
                return a.pinned ? -1 : 1
              }).map((elem) => (
                <div
                  key={elem.id}
                  className='group bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 hover:border-blue-500 transform hover:scale-105'
                >
                  {/* Note Title */}
                  <h3 className='text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition'>
                    {elem.title || 'Untitled'}
                  </h3>

                  <div className='flex items-center justify-between mb-3'>
                    <small className='text-slate-400 text-xs'>
                      {elem.createdAt ? new Date(elem.createdAt).toLocaleString() : ''}
                    </small>
                    <button
                      type='button'
                      onClick={() => togglePin(elem.id)}
                      className={`text-xs px-2 py-1 rounded ${elem.pinned ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-slate-200'}`}
                    >
                      {elem.pinned ? '📌 Pinned' : '📍 Pin'}
                    </button>
                  </div>

                  {/* Note Content */}
                  <p className='text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed'>
                    {elem.detail || 'No content'}
                  </p>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <button
                      type='button'
                      onClick={() => startEdit(elem.id)}
                      className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95'
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => deleteNote(elem.id)}
                      className='flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95'
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - Overlay */}
      {editId !== null && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md border border-slate-600'>
            <h2 className='text-2xl font-bold text-white mb-6'>Edit Note</h2>
            
            {/* Edit Title */}
            <div className='mb-4'>
              <label className='block text-sm font-semibold text-slate-300 mb-2'>Note Title</label>
              <input
                type='text'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className='w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
              />
            </div>

            {/* Edit Content */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-slate-300 mb-2'>Note Content</label>
              <textarea
                value={editDetail}
                onChange={(e) => setEditDetail(e.target.value)}
                className='w-full h-32 px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none'
              />
            </div>

            {/* Modal Buttons */}
              <div className='flex gap-3'>
              <button
                type='button'
                onClick={() => saveEdit(editId)}
                className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95'
              >
                ✓ Save
              </button>
              <button
                type='button'
                onClick={cancelEdit}
                className='flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95'
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App