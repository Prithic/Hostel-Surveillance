import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Camera, ShieldAlert, ScanFace, Video, VideoOff } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { securityAlerts, cameraFeeds, analytics } from '../data/dummyData'

const levelTone = { high: 'danger', medium: 'warning', low: 'info' }
const COLORS = ['#2563EB', '#E2E8F0']

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Camera} label="Cameras Online" value={`${cameraFeeds.filter(c => c.status === 'online').length}/${cameraFeeds.length}`} tone="success" />
        <StatCard icon={ScanFace} label="Faces Verified Today" value="284" tone="primary" />
        <StatCard icon={ShieldAlert} label="Active Alerts" value={securityAlerts.filter(a => a.status === 'Reviewing').length} tone="danger" />
        <StatCard icon={Video} label="Visitors On-Site" value="3" tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Camera grid */}
        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Camera feeds</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cameraFeeds.map((cam) => (
              <motion.div
                key={cam.id}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-ink p-4 text-center"
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
          <h2 className="mb-2 font-display text-sm font-semibold text-ink2">Hostel occupancy</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.occupancy} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {analytics.occupancy.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Alerts */}
      <GlassCard hover={false} className="p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Security alerts</h2>
        <div className="space-y-3">
          {securityAlerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${a.level === 'high' ? 'bg-danger' : a.level === 'medium' ? 'bg-warning' : 'bg-primary'}`} />
                <div>
                  <p className="text-sm text-ink2">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
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
