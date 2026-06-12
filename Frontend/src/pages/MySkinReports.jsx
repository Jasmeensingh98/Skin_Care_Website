import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/store'
import { skinReportAPI } from '../services/api'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { resolveBackendImageUrl } from '../utils/imageUrl'

export default function MySkinReports() {
  const { user } = useStore()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    skinReportAPI
      .getMyReports()
      .then((res) => setReports(res.data))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please login to view your skin reports</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Skin Reports</h1>
          <Link to="/skin-analysis" className="btn-primary text-sm">
            New analysis
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-2 border-rose-500 border-t-transparent rounded-full" />
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 mb-4">No skin reports yet.</p>
            <Link to="/skin-analysis" className="btn-primary">Start skin analysis</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link
                key={report._id}
                to={`/my-skin-reports/${report._id}`}
                className="block bg-white rounded-xl p-5 shadow hover:shadow-md transition border border-gray-100"
              >
                <div className="flex gap-4 items-center">
                  {report.imageUrl && (
                    <img
                      src={resolveBackendImageUrl(report.imageUrl)}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">
                      Report — {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">{report.aiSummary}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                      report.status === 'reviewed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.status === 'reviewed' ? (
                      <>
                        <CheckCircle size={14} /> Reviewed
                      </>
                    ) : (
                      <>
                        <Clock size={14} /> Pending
                      </>
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
