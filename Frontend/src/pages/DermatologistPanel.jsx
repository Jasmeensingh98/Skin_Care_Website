import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import { skinReportAPI, productAPI, appointmentAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Stethoscope, User, Clock, CheckCircle, Send, CalendarDays, ClipboardList } from 'lucide-react'

const normalizeText = (value) => String(value || '').toLowerCase()

const getSuggestedProducts = (report, products) => {
  if (!report || !Array.isArray(products)) return []

  const metrics = report.metrics || {}
  const recoveryFocus = (report.recoveryFocus || []).map(normalizeText)
  const blockedIngredients = (report.blockedIngredients || []).map(normalizeText)

  const candidateScores = products.map((product) => {
    const text = normalizeText([product.title, product.desc, product.Brand, product.categories?.join(' '), product.concern?.join(' '), product.skintype?.join(' ')].filter(Boolean).join(' '))
    const skinTypes = (product.skintype || []).map(normalizeText)
    let score = 0

    const acneHigh = (metrics.acne || 0) >= 40
    const rednessHigh = (metrics.redness || 0) >= 40
    const oilinessHigh = (metrics.oiliness || 0) >= 40
    const drynessHigh = (metrics.dryness || 0) >= 40

    if (acneHigh) {
      if (text.includes('salicylic') || text.includes('niacinamide') || text.includes('azelaic') || text.includes('clarifying') || text.includes('pore') || text.includes('acne')) score += 6
      if (text.includes('cleanser') || text.includes('moisturizer') || text.includes('serum') || text.includes('mask')) score += 2
      if (skinTypes.includes('oily') || skinTypes.includes('combination')) score += 3
    }

    if (rednessHigh) {
      if (text.includes('calming') || text.includes('soothing') || text.includes('sensitive') || text.includes('barrier') || text.includes('centella') || text.includes('aloe')) score += 7
      if (text.includes('azelaic') || text.includes('hydrating') || text.includes('repair')) score += 3
      if (skinTypes.includes('sensitive') || skinTypes.includes('all')) score += 2
    }

    if (oilinessHigh) {
      if (text.includes('niacinamide') || text.includes('salicylic') || text.includes('clarifying') || text.includes('charcoal') || text.includes('pore') || text.includes('oil')) score += 7
      if (text.includes('gel') || text.includes('cleanser') || text.includes('spf')) score += 2
      if (skinTypes.includes('oily') || skinTypes.includes('combination')) score += 3
    }

    if (drynessHigh) {
      if (text.includes('hyaluronic') || text.includes('hydrating') || text.includes('moisturizer') || text.includes('repair') || text.includes('ceramide') || text.includes('cream')) score += 7
      if (text.includes('barrier') || text.includes('soothing') || text.includes('probiotic')) score += 3
      if (skinTypes.includes('dry') || skinTypes.includes('all')) score += 2
    }

    if (recoveryFocus.some((focus) => text.includes(focus))) score += 4

    if (blockedIngredients.some((ingredient) => text.includes(ingredient))) score -= 10

    if (product.inStock === false) score -= 20

    return { product, score }
  })

  return candidateScores
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.product)
}

export default function DermatologistPanel() {
  const navigate = useNavigate()
  const { user } = useStore()
  const [reports, setReports] = useState([])
  const [products, setProducts] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [notes, setNotes] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [filter, setFilter] = useState('pending_review')
  const [activeSection, setActiveSection] = useState('reports')
  const [appointmentDraft, setAppointmentDraft] = useState({
    reportId: '',
    appointmentDate: '',
    reason: '',
    notes: '',
  })
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [appointmentSubmitting, setAppointmentSubmitting] = useState(false)

  const isDerm =
    user?.role === 'dermatologist' ||
    user?.role === 'admin' ||
    user?.email === 'derm@vulpine.com'

  useEffect(() => {
    if (!user || !isDerm) {
      setLoading(false)
      return
    }
    Promise.all([
      skinReportAPI.getAllForDerm({ status: filter }),
      productAPI.getAllProducts({}),
      appointmentAPI.getAll(),
    ])
      .then(([reportsRes, productsRes, appointmentsRes]) => {
        setReports(reportsRes.data)
        setProducts(productsRes.data || [])
        setAppointments(appointmentsRes.data || [])
      })
      .catch(() => toast.error('Failed to load panel data'))
      .finally(() => setLoading(false))
  }, [user, isDerm, filter])

  const openReport = async (reportId) => {
    try {
      const { data } = await skinReportAPI.getReportById(reportId)
      setSelected(data)
      setNotes(data.dermatologistNotes || '')
      setSelectedProductIds(
        (data.recommendedProducts || []).map((r) =>
          (r.productId?._id || r.productId)?.toString()
        ).filter(Boolean)
      )
      setSuggestedProducts(getSuggestedProducts(data, products))
    } catch {
      toast.error('Could not load report')
    }
  }

  const toggleProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const openAppointmentDraft = (report) => {
    setAppointmentDraft({
      reportId: report._id,
      appointmentDate: '',
      reason: report.aiSummary ? 'Follow-up skin consultation' : 'Skin consultation follow-up',
      notes: report.dermatologistNotes || report.aiSummary || '',
    })
    setSelectedAppointment(null)
    setActiveSection('appointments')
  }

  const applySuggestedProducts = () => {
    if (!selected) return
    const nextIds = getSuggestedProducts(selected, products).map((product) => product._id)
    setSuggestedProducts(getSuggestedProducts(selected, products))
    setSelectedProductIds(nextIds)
    toast.success('Suggested products added from report result')
  }

  const loadAppointments = async () => {
    try {
      const { data } = await appointmentAPI.getAll()
      setAppointments(data || [])
    } catch {
      toast.error('Failed to load appointments')
    }
  }

  const submitAppointment = async () => {
    if (!appointmentDraft.reportId || !appointmentDraft.appointmentDate) {
      toast.error('Select a report and appointment date')
      return
    }

    setAppointmentSubmitting(true)
    try {
      const { data } = await appointmentAPI.create(appointmentDraft)
      setAppointments((prev) => [data, ...prev])
      setSelectedAppointment(data)
      setAppointmentDraft({
        reportId: '',
        appointmentDate: '',
        reason: '',
        notes: '',
      })
      toast.success('Appointment scheduled')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule appointment')
    } finally {
      setAppointmentSubmitting(false)
    }
  }

  const updateAppointmentStatus = async (id, status) => {
    try {
      const { data } = await appointmentAPI.update(id, { status })
      setSelectedAppointment(data)
      await loadAppointments()
      toast.success('Appointment updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update appointment')
    }
  }

  const submitReview = async () => {
    if (!selected) return
    if (!notes.trim() && selectedProductIds.length === 0) {
      toast.error('Add notes or select at least one product')
      return
    }
    setSubmitting(true)
    try {
      await skinReportAPI.reviewReport(selected._id, {
        dermatologistNotes: notes,
        recommendedProductIds: selectedProductIds,
      })
      toast.success('Report approved and recommendations sent to customer!')
      setSelected(null)
      setSuggestedProducts([])
      const { data } = await skinReportAPI.getAllForDerm({ status: filter })
      setReports(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/login" className="btn-primary">Login as dermatologist</Link>
      </div>
    )
  }

  if (!isDerm) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Stethoscope className="mx-auto text-gray-300 mb-4" size={48} />
          <h1 className="text-xl font-bold mb-2">Dermatologist panel only</h1>
          <p className="text-gray-600 mb-4">This area is for licensed dermatologists on the Vulpine team.</p>
          <Link to="/skin-analysis" className="btn-primary">Go to skin analysis</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="text-violet-600" />
              Dermatologist Workspace
            </h1>
            <p className="text-slate-600">Reports and appointments stay inside the dermatologist area</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white p-1 shadow-sm border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSection('reports')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeSection === 'reports' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ClipboardList size={16} /> Reports
                          <button
                            type="button"
                            onClick={submitReview}
                            disabled={submitting}
                            className="btn-primary"
                          >
                            {submitting ? 'Approving...' : 'Approve report and send recommendations'}
                          </button>
              <CalendarDays size={16} /> Appointments
            </button>
          </div>
        </div>

        {activeSection === 'reports' ? (
          <>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFilter('pending_review')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'pending_review' ? 'bg-violet-600 text-white' : 'bg-white border'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('reviewed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'reviewed' ? 'bg-violet-600 text-white' : 'bg-white border'
                  }`}
                >
                  Reviewed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : reports.length === 0 ? (
                  <p className="text-gray-500 bg-white p-6 rounded-xl">No reports in this category.</p>
                ) : (
                  reports.map((r) => (
                    <button
                      key={r._id}
                      type="button"
                      onClick={() => openReport(r._id)}
                      className={`w-full text-left bg-white rounded-xl p-4 border transition ${
                        selected?._id === r._id ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      <div className="flex gap-3">
                        {r.imageUrl && (
                          <img src={r.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{r.userName || 'Customer'}</p>
                          <p className="text-xs text-gray-500">{r.userEmail}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {r.status === 'reviewed' ? (
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <span className="text-[11px] text-emerald-700 font-medium">Approved</span>
                          </div>
                        ) : (
                          <Clock size={16} className="text-amber-500 shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 min-h-[400px]">
                {!selected ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Select a report to review
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-4 mb-6">
                      {selected.imageUrl && (
                        <img
                          src={selected.imageUrl}
                          alt="Patient"
                          className="w-32 h-32 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="flex items-center gap-2 font-bold text-lg">
                          <User size={18} /> {selected.userName}
                        </p>
                        <p className="text-sm text-gray-600">{selected.userEmail}</p>
                        <p className="text-sm text-gray-500 mt-2">{selected.aiSummary}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(selected.metrics || {}).map(([k, v]) => (
                            <span key={k} className="text-xs bg-slate-100 px-2 py-1 rounded capitalize">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={applySuggestedProducts}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-200 text-violet-700 hover:bg-violet-50"
                          >
                            <Send size={16} /> Use suggested products
                          </button>
                          <button
                            type="button"
                            onClick={() => openAppointmentDraft(selected)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <CalendarDays size={16} /> Schedule appointment
                          </button>
                        </div>
                      </div>
                    </div>

                    {suggestedProducts.length > 0 && (
                      <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50 p-4">
                        <p className="font-semibold text-violet-800 mb-2">Suggested products from the report</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedProducts.map((product) => (
                            <button
                              key={product._id}
                              type="button"
                              onClick={() => toggleProduct(product._id)}
                              className={`px-3 py-2 rounded-full text-sm border ${
                                selectedProductIds.includes(product._id)
                                  ? 'bg-violet-600 text-white border-violet-600'
                                  : 'bg-white text-violet-700 border-violet-200'
                              }`}
                            >
                              {product.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selected.status === 'reviewed' ? (
                      <div className="bg-emerald-50 p-4 rounded-xl mb-4">
                        <p className="font-semibold text-emerald-800">Already reviewed</p>
                        <p className="text-xs text-emerald-700 mt-1">
                          Approved by {selected.dermatologist?.name || 'Dermatologist'}
                        </p>
                        <p className="text-sm mt-2 whitespace-pre-wrap">{selected.dermatologistNotes}</p>
                      </div>
                    ) : (
                      <>
                        <label className="block text-sm font-semibold mb-2">Notes for customer</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="input-field mb-4"
                          placeholder="Explain your assessment and why you recommend these products..."
                        />

                        <label className="block text-sm font-semibold mb-2">
                          Recommend products ({selectedProductIds.length} selected)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto mb-4">
                          {products.slice(0, 24).map((p) => (
                            <label
                              key={p._id}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                selectedProductIds.includes(p._id)
                                  ? 'border-violet-500 bg-violet-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProductIds.includes(p._id)}
                                onChange={() => toggleProduct(p._id)}
                              />
                              <span className="line-clamp-2">{p.title}</span>
                            </label>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={submitReview}
                          disabled={submitting}
                          className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Send size={18} />
                          {submitting ? 'Sending...' : 'Send recommendations to customer'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : appointments.length === 0 ? (
                <p className="text-gray-500 bg-white p-6 rounded-xl">No appointments scheduled yet.</p>
              ) : (
                appointments.map((appointment) => (
                  <button
                    key={appointment._id}
                    type="button"
                    onClick={() => setSelectedAppointment(appointment)}
                    className={`w-full text-left bg-white rounded-xl p-4 border transition ${
                      selectedAppointment?._id === appointment._id
                        ? 'border-violet-500 ring-2 ring-violet-200'
                        : 'border-gray-200 hover:border-violet-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{appointment.patientName || 'Customer'}</p>
                        <p className="text-xs text-gray-500 truncate">{appointment.patientEmail}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(appointment.appointmentDate).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-[11px] uppercase tracking-wide px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {appointment.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="lg:col-span-2 grid gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CalendarDays className="text-violet-600" size={20} /> Schedule from report
                </h2>

                {appointmentDraft.reportId ? (
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-4">
                    <p className="font-semibold text-violet-800">Draft linked to report</p>
                    <p className="text-sm text-violet-900 mt-1">
                      {reports.find((report) => report._id === appointmentDraft.reportId)?.userName || 'Customer'}
                    </p>
                    <p className="text-xs text-violet-700 mt-1">
                      {reports.find((report) => report._id === appointmentDraft.reportId)?.aiSummary || 'Skin follow-up'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border rounded-xl p-4 mb-4 text-sm text-slate-600">
                    Select a report from the Reports tab, then click Schedule appointment.
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block text-sm font-semibold">
                    Appointment date and time
                    <input
                      type="datetime-local"
                      value={appointmentDraft.appointmentDate}
                      onChange={(e) => setAppointmentDraft((prev) => ({ ...prev, appointmentDate: e.target.value }))}
                      className="input-field mt-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    Reason
                    <input
                      type="text"
                      value={appointmentDraft.reason}
                      onChange={(e) => setAppointmentDraft((prev) => ({ ...prev, reason: e.target.value }))}
                      className="input-field mt-2"
                      placeholder="Follow-up consultation"
                    />
                  </label>
                </div>

                <label className="block text-sm font-semibold mt-4">
                  Notes
                  <textarea
                    rows={4}
                    value={appointmentDraft.notes}
                    onChange={(e) => setAppointmentDraft((prev) => ({ ...prev, notes: e.target.value }))}
                    className="input-field mt-2"
                    placeholder="Add preparation notes or follow-up instructions"
                  />
                </label>

                <button
                  type="button"
                  onClick={submitAppointment}
                  disabled={appointmentSubmitting}
                  className="mt-4 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {appointmentSubmitting ? 'Scheduling...' : 'Schedule appointment'}
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[220px]">
                {!selectedAppointment ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Select an appointment to review status
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between gap-4 items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{selectedAppointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{selectedAppointment.patientEmail}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(selectedAppointment.appointmentDate).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs uppercase tracking-wide px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {selectedAppointment.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
                      {selectedAppointment.reason || 'No reason provided'}
                    </p>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
                      {selectedAppointment.notes || 'No notes provided'}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'completed')}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Mark completed
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'cancelled')}
                        className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
