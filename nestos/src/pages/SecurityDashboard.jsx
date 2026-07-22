import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Camera, ShieldAlert, ScanFace, Video, VideoOff, LogOut } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { securityAlerts, cameraFeeds, analytics } from '../data/dummyData'
import { logoutAdmin } from '../auth'

const levelTone = { high: 'danger', medium: 'warning', low: 'info' }
const COLORS = ['#2563EB', 'rgba(255,255,255,0.12)']

export default function SecurityDashboard() {
  const navigate = useNavigate()

  function handleAdminLogout() {
    logoutAdmin()
    navigate('/admin-login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/45">Signed in as admin — visible only in this session.</p>
        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-danger/40 hover:text-danger"
        >
          <LogOut className="h-3.5 w-3.5" /> End admin session
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Camera} label="Cameras Online" value={`${cameraFeeds.filter(c => c.status === 'online').length}/${cameraFeeds.length}`} tone="success" />
        <StatCard icon={ScanFace} label="Faces Verified Today" value="284" tone="primary" />
        <StatCard icon={ShieldAlert} label="Active Alerts" value={securityAlerts.filter(a => a.status === 'Reviewing').length} tone="danger" />
        <StatCard icon={Video} label="Visitors On-Site" value="3" tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Camera grid */}
        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold text-white">Camera feeds</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cameraFeeds.map((cam) => (
              <motion.div
                key={cam.id}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-ink p-4 text-center"
              >
                {cam.status === 'online' ? (
                  <Video className="h-6 w-6 text-success" />
                ) : (
                  <VideoOff className="h-6 w-6 text-danger" />
                )}
                <p className="text-xs font-medium text-white/80">{cam.name}</p>
                <Badge tone={cam.status === 'online' ? 'success' : 'danger'}>{cam.status}</Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Occupancy */}
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-2 font-display text-sm font-semibold text-white">Hostel occupancy</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.occupancy} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {analytics.occupancy.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Alerts */}
      <GlassCard hover={false} className="p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Security alerts</h2>
        <div className="space-y-3">
          {securityAlerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${a.level === 'high' ? 'bg-danger' : a.level === 'medium' ? 'bg-warning' : 'bg-primary'}`} />
                <div>
                  <p className="text-sm text-white">{a.title}</p>
                  <p className="text-xs text-white/45">{a.time}</p>
                </div>
              </div>
              <Badge tone={levelTone[a.level]}>{a.status}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

