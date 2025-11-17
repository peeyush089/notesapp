import React from 'react'
import {useState} from 'react'

const App = () => {
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [task, setTask] = useState([])
  const [editIdx, setEditIdx] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDetail, setEditDetail] = useState('')

  const submitHandler = (e) => {
    e.preventDefault();
     const copyTask=[...task]
     copyTask.push({title,detail})
     setTask(copyTask)
     console.log(task)
     
     setTitle('')
     setDetail('')
  }

  const deleteNote = (idx) => {
    const copyTask = [...task]
    copyTask.splice(idx, 1)
    setTask(copyTask)
    console.log('Note deleted. Remaining:', copyTask)
  }

  const startEdit = (idx) => {
    setEditIdx(idx)
    setEditTitle(task[idx].title)
    setEditDetail(task[idx].detail)
  }

  const saveEdit = (idx) => {
    const copyTask = [...task]
    copyTask[idx].title = editTitle
    copyTask[idx].detail = editDetail
    setTask(copyTask)
    setEditIdx(null)
    console.log('Note updated:', copyTask[idx])
  }

  const cancelEdit = () => {
    setEditIdx(null)
    setEditTitle('')
    setEditDetail('')
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col lg:flex-row'>
      {/* Left Panel: Add Notes Form - Fixed */}
      <div className='lg:w-2/5 w-full bg-slate-800 shadow-2xl p-8 lg:border-r border-slate-700 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto'>
        <div className='max-w-md mx-auto'>
          <h1 className='text-4xl font-bold text-white mb-2'>My Notes</h1>
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
              {task.map((elem, idx) => (
                <div
                  key={idx}
                  className='group bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 hover:border-blue-500 transform hover:scale-105'
                >
                  {/* Note Title */}
                  <h3 className='text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition'>
                    {elem.title || 'Untitled'}
                  </h3>

                  {/* Note Content */}
                  <p className='text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed'>
                    {elem.detail || 'No content'}
                  </p>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <button
                      type='button'
                      onClick={() => startEdit(idx)}
                      className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95'
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => deleteNote(idx)}
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
      {editIdx !== null && (
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
                onClick={() => saveEdit(editIdx)}
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