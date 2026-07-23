import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from './Modal'
import { Edit3, User, DoorOpen, Utensils, MessageSquareWarning, Megaphone, Save, Check } from 'lucide-react'

export default function AdminEditModal({ open, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('student')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Student Edit State
  const [student, setStudent] = useState({
    name: 'Sharan M',
    regNo: '7176211001',
    dept: 'AIML',
    year: '2',
    block: 'B',
    room: 'B-214',
    phone: '9876510001',
    parentPhone: '9840010001',
    attendance: '92',
    feeStatus: 'Paid',
  })

  // Mess Menu Edit State
  const [mess, setMess] = useState({
    breakfast: 'Idli, Vada, Sambar & Chutney',
    lunch: 'Variety Rice, Chapati, Paneer Curry & Curd',
    snacks: 'Samosa & Tea/Coffee',
    dinner: 'Paneer Butter Masala & Parotta',
  })

  // Complaint Edit State
  const [complaint, setComplaint] = useState({
    id: 'CMP-098',
    title: 'Water leakage in Block B 2nd floor',
    status: 'In Progress',
    priority: 'High',
    notes: 'Plumber dispatched, fixing valve joint.',
  })

  // Notice Edit State
  const [notice, setNotice] = useState({
    title: 'Hostel Outpass Timings Updated',
    category: 'General',
    body: 'All night outpass requests must be submitted before 5:00 PM for Warden digital signature.',
  })

  function handleSave(e) {
    e.preventDefault()
    setSavedSuccess(true)
    if (onSave) {
      onSave({ student, mess, complaint, notice })
    }
    setTimeout(() => {
      setSavedSuccess(false)
      onClose()
    }, 1200)
  }

  return (
    <Modal open={open} onClose={onClose} title="Admin Master Controls — Edit Anything">
      <div className="space-y-4">
        {/* Entity Tabs */}
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
          {[
            { id: 'student', label: 'Student Profile', icon: User },
            { id: 'mess', label: 'Mess Menu', icon: Utensils },
            { id: 'complaint', label: 'Complaints', icon: MessageSquareWarning },
            { id: 'notice', label: 'Notices', icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-liquid'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">Record Successfully Updated!</p>
            <p className="text-xs text-white/50">Changes have been saved across the Trinity ERP database.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Student Edit Tab */}
            {activeTab === 'student' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="mb-1 block text-white/70">Full Name</label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Register Number</label>
                  <input
                    type="text"
                    value={student.regNo}
                    onChange={(e) => setStudent({ ...student, regNo: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Department</label>
                  <input
                    type="text"
                    value={student.dept}
                    onChange={(e) => setStudent({ ...student, dept: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Hostel Block & Room</label>
                  <input
                    type="text"
                    value={student.room}
                    onChange={(e) => setStudent({ ...student, room: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Attendance %</label>
                  <input
                    type="number"
                    value={student.attendance}
                    onChange={(e) => setStudent({ ...student, attendance: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Fee Status</label>
                  <select
                    value={student.feeStatus}
                    onChange={(e) => setStudent({ ...student, feeStatus: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-primary"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
            )}

            {/* Mess Menu Edit Tab */}
            {activeTab === 'mess' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block text-white/70">Breakfast Menu</label>
                  <input
                    type="text"
                    value={mess.breakfast}
                    onChange={(e) => setMess({ ...mess, breakfast: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Lunch Menu</label>
                  <input
                    type="text"
                    value={mess.lunch}
                    onChange={(e) => setMess({ ...mess, lunch: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Dinner Special</label>
                  <input
                    type="text"
                    value={mess.dinner}
                    onChange={(e) => setMess({ ...mess, dinner: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Complaint Edit Tab */}
            {activeTab === 'complaint' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block text-white/70">Ticket Status</label>
                  <select
                    value={complaint.status}
                    onChange={(e) => setComplaint({ ...complaint, status: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Resolution Notes</label>
                  <textarea
                    rows={2}
                    value={complaint.notes}
                    onChange={(e) => setComplaint({ ...complaint, notes: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Notice Edit Tab */}
            {activeTab === 'notice' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block text-white/70">Notice Title</label>
                  <input
                    type="text"
                    value={notice.title}
                    onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white/70">Notice Body</label>
                  <textarea
                    rows={3}
                    value={notice.body}
                    onChange={(e) => setNotice({ ...notice, body: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-liquid transition hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
