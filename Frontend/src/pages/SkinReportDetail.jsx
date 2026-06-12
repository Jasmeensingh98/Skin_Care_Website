import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store/store'
import { skinReportAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'
import { ArrowLeft, Stethoscope, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { resolveBackendImageUrl } from '../utils/imageUrl'

export default function SkinReportDetail() {
  const { id } = useParams()
  const { user } = useStore()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !user) return
    skinReportAPI
      .getReportById(id)
      .then((res) => setReport(res.data))
      .catch(() => toast.error('Report not found'))
      .finally(() => setLoading(false))
  }, [id, user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-rose-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Report not found</p>
      </div>
    )
  }

  const recommended = report.recommendedProducts || []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/my-skin-reports" className="inline-flex items-center gap-2 text-rose-600 mb-6 hover:underline">
          <ArrowLeft size={18} /> Back to reports
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2">
            {report.imageUrl && (
              <img src={resolveBackendImageUrl(report.imageUrl)} alt="Skin scan" className="w-full h-64 md:h-full object-cover" />
            )}
            <div className="p-6">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  report.status === 'reviewed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {report.status === 'reviewed' ? 'Reviewed by dermatologist' : 'Awaiting dermatologist review'}
              </span>
              <h1 className="text-2xl font-bold mt-3">Skin Analysis Report</h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(report.createdAt).toLocaleString()}
              </p>
              {report.aiSummary && (
                <p className="text-gray-700 mt-4">{report.aiSummary}</p>
              )}
              {report.skinType && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500">Predicted skin type</p>
                  <p className="font-semibold text-lg capitalize">{report.skinType}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {Object.entries(report.metrics || {}).map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded p-2 text-sm">
                    <span className="capitalize text-gray-500">{k}</span>
                    <span className="font-bold ml-2">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {report.status === 'reviewed' && (
          <div className="bg-gradient-to-r from-violet-50 to-rose-50 rounded-2xl p-6 border border-violet-200 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
              <Stethoscope className="text-violet-600" /> Dermatologist notes
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {report.dermatologistNotes || 'No additional notes.'}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white/80 border border-violet-100 p-4">
                <p className="text-xs uppercase tracking-wide text-violet-500 font-semibold flex items-center gap-1">
                  <UserRoundCheck size={14} /> Approved by
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {report.dermatologist?.name || 'Dermatologist'}
                </p>
                {report.dermatologist?.email && (
                  <p className="text-sm text-slate-500">{report.dermatologist.email}</p>
                )}
              </div>
              <div className="rounded-xl bg-white/80 border border-violet-100 p-4">
                <p className="text-xs uppercase tracking-wide text-violet-500 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> Approval status
                </p>
                <p className="mt-1 font-semibold text-slate-800">Report approved and recommendations released</p>
                {report.reviewedAt && (
                  <p className="text-sm text-slate-500">
                    Reviewed on {new Date(report.reviewedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {recommended.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recommended products for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((rec) => {
                const product = rec.productId || {
                  _id: rec.productId?._id || rec._id,
                  title: rec.title,
                  img: rec.img,
                  discountedPrice: rec.discountedPrice,
                  inStock: true,
                }
                return (
                  <ProductCard
                    key={rec.productId?._id || rec.title}
                    product={typeof rec.productId === 'object' ? rec.productId : product}
                    showPromoBadge={false}
                  />
                )
              })}
            </div>
          </div>
        ) : report.status === 'pending_review' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-900 font-medium">
              Your report is with our dermatologist. Product recommendations will appear here once reviewed.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
