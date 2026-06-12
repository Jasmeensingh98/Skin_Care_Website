import { useEffect, useMemo, useState } from 'react'
import { Camera, Calendar, Shield, ShieldAlert, Sun } from 'lucide-react'
import { resolveBackendImageUrl } from '../utils/imageUrl'

const DEFAULT_LOCATION = {
  label: 'New Delhi, IN',
  latitude: 28.6139,
  longitude: 77.209,
}

const buildPlan = (uvMax) => {
  if (uvMax >= 8) {
    return {
      focus: 'High UV defense',
      amSteps: ['Gentle cleanse', 'Hydrating serum', 'SPF 50+ reapply every 2-3h'],
      pmSteps: ['Double cleanse', 'Barrier repair moisturizer', 'Soothing mask'],
      notes: 'Avoid strong actives; prioritize protection and recovery.',
    }
  }
  if (uvMax >= 6) {
    return {
      focus: 'Antioxidant support',
      amSteps: ['Gentle cleanse', 'Vitamin C serum', 'SPF 50+ reapply every 3h'],
      pmSteps: ['Cleanse', 'Niacinamide or peptide serum', 'Moisturizer'],
      notes: 'Limit exfoliation; keep routine steady.',
    }
  }
  if (uvMax >= 3) {
    return {
      focus: 'Balanced routine',
      amSteps: ['Cleanse', 'Hydrating serum', 'SPF 30+'],
      pmSteps: ['Cleanse', 'Mild active (AHA/BHA) 1-2x', 'Moisturizer'],
      notes: 'Good window for gentle actives.',
    }
  }
  return {
    focus: 'Repair and treat',
    amSteps: ['Cleanse', 'Moisturizer', 'SPF 30+'],
    pmSteps: ['Cleanse', 'Retinol (if tolerated)', 'Barrier cream'],
    notes: 'Lower UV allows treatment-focused evenings.',
  }
}

const formatDate = (dateValue) => {
  const date = new Date(dateValue)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const severityLabel = (value) => {
  if (value >= 70) return 'High'
  if (value >= 40) return 'Moderate'
  return 'Low'
}

const buildSkinReport = (metrics) => {
  const blockedIngredients = new Set()
  const recoveryFocus = new Set()

  if (metrics.acne >= 40) {
    blockedIngredients.add('Isopropyl myristate')
    blockedIngredients.add('Coconut oil')
    recoveryFocus.add('Gentle acne care')
  }
  if (metrics.redness >= 40) {
    blockedIngredients.add('Fragrance')
    blockedIngredients.add('Denatured alcohol')
    recoveryFocus.add('Calming + barrier repair')
  }
  if (metrics.oiliness >= 40) {
    blockedIngredients.add('Heavy occlusives')
    recoveryFocus.add('Oil balance')
  }
  if (metrics.dryness >= 40) {
    blockedIngredients.add('Strong exfoliants')
    recoveryFocus.add('Deep hydration')
  }

  const recoveryPlan = {
    am: ['Low-foam cleanser', 'Hydrating serum', 'SPF 50+'],
    pm: ['Gentle cleanse', 'Barrier cream', 'Spot-care only if needed'],
  }

  return {
    blockedIngredients: Array.from(blockedIngredients),
    recoveryFocus: Array.from(recoveryFocus),
    recoveryPlan,
  }
}

const SPONSORED_PRODUCTS = [
  {
    id: 'sponsor-cica-barrier',
    name: 'Cica Barrier Rescue Cream',
    category: 'moisturizer',
    tags: ['redness', 'dryness', 'sensitive'],
    image: 'Vulpine.png',
    safetyTags: ['fragrance-free', 'alcohol-free'],
  },
  {
    id: 'sponsor-niacinamide',
    name: 'Niacinamide Balance Serum',
    category: 'serums',
    tags: ['oiliness', 'acne'],
    image: 'Vulpine.png',
    safetyTags: ['non-comedogenic'],
  },
  {
    id: 'sponsor-hydration-gel',
    name: 'Hydration Gel + SPF 50',
    category: 'sun-care',
    tags: ['dryness', 'redness', 'sensitive'],
    image: 'Vulpine.png',
    safetyTags: ['reef-safe', 'mineral'],
  },
]

const SKIN_QUIZ = [
  {
    id: 'skinType',
    label: 'Your skin type',
    options: ['oily', 'dry', 'combination', 'sensitive', 'normal'],
  },
  {
    id: 'concern',
    label: 'Top skin concern',
    options: ['acne', 'redness', 'dryness', 'oiliness', 'dullness'],
  },
  {
    id: 'sensitivity',
    label: 'Sensitivity level',
    options: ['low', 'medium', 'high'],
  },
  {
    id: 'routineTime',
    label: 'Routine time',
    options: ['minimal', 'standard', 'full'],
  },
  {
    id: 'climate',
    label: 'Current climate',
    options: ['humid', 'dry', 'mild', 'cold'],
  },
]

const buildQuizRoutine = (answers) => {
  const am = ['Gentle cleanse', 'SPF 50+']
  const pm = ['Cleanse', 'Moisturizer']
  const focus = []
  const cautions = []

  if (answers.skinType === 'oily') {
    focus.push('Oil balance')
    am.splice(1, 0, 'Niacinamide serum')
    pm.splice(1, 0, 'Lightweight gel moisturizer')
  }
  if (answers.skinType === 'dry') {
    focus.push('Deep hydration')
    am.splice(1, 0, 'Hyaluronic serum')
    pm.splice(1, 0, 'Rich barrier cream')
  }
  if (answers.skinType === 'sensitive' || answers.sensitivity === 'high') {
    focus.push('Barrier repair')
    cautions.push('Avoid fragrance and strong acids')
    am.splice(1, 0, 'Soothing serum')
  }

  if (answers.concern === 'acne') {
    focus.push('Gentle acne care')
    pm.splice(1, 0, 'BHA 2-3x weekly')
  }
  if (answers.concern === 'redness') {
    focus.push('Calming + anti-redness')
    am.splice(1, 0, 'Centella serum')
  }
  if (answers.concern === 'dullness') {
    focus.push('Glow support')
    am.splice(1, 0, 'Vitamin C serum')
  }

  if (answers.climate === 'dry' || answers.climate === 'cold') {
    am.splice(1, 0, 'Hydrating mist')
    pm.push('Overnight mask 1-2x')
  }
  if (answers.climate === 'humid') {
    cautions.push('Avoid heavy occlusives in daytime')
  }

  if (answers.routineTime === 'minimal') {
    am.splice(1, am.length - 2, 'Hydrating SPF')
    pm.splice(1, pm.length - 2, 'Barrier cream')
  }
  if (answers.routineTime === 'full') {
    am.splice(1, 0, 'Hydrating toner')
    pm.push('Targeted treatment')
  }

  const categories = new Set(['cleanser', 'moisturizer', 'sun-care'])
  if (answers.concern === 'acne' || answers.skinType === 'oily') categories.add('serums')
  if (answers.concern === 'redness' || answers.sensitivity === 'high') categories.add('skincare')
  if (answers.concern === 'dullness') categories.add('masks')

  return {
    focus: focus.length ? focus.join(' + ') : 'Balanced care',
    am,
    pm,
    cautions,
    categories: Array.from(categories),
  }
}

const pickSponsoredProducts = (metrics, blockedIngredients) => {
  if (!metrics) return []
  const needs = Object.entries(metrics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key)

  const filtered = SPONSORED_PRODUCTS.filter((product) =>
    needs.some((need) => product.tags.includes(need))
  )

  if (blockedIngredients?.length) {
    return filtered.slice(0, 2)
  }

  return filtered.slice(0, 2)
}

export default function SkinCycle() {
  const [label, setLabel] = useState(DEFAULT_LOCATION.label)
  const [latitude, setLatitude] = useState(DEFAULT_LOCATION.latitude)
  const [longitude, setLongitude] = useState(DEFAULT_LOCATION.longitude)
  const [queryLat, setQueryLat] = useState(String(DEFAULT_LOCATION.latitude))
  const [queryLon, setQueryLon] = useState(String(DEFAULT_LOCATION.longitude))
  const [forecast, setForecast] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [report, setReport] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  const applyLocation = (lat, lon, locationLabel) => {
    setLatitude(lat)
    setLongitude(lon)
    setLabel(locationLabel || 'Custom location')
  }

  const handleUseMyLocation = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords
        setQueryLat(String(lat))
        setQueryLon(String(lon))
        applyLocation(lat, lon, 'My location')
      },
      () => {
        setError('Unable to access location. Please enter coordinates manually.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleManualUpdate = (event) => {
    event.preventDefault()
    setError('')

    const latValue = Number.parseFloat(queryLat)
    const lonValue = Number.parseFloat(queryLon)

    if (Number.isNaN(latValue) || Number.isNaN(lonValue)) {
      setError('Please enter valid latitude and longitude values.')
      return
    }

    applyLocation(latValue, lonValue, 'Custom location')
  }

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setReport(null)
  }

  const handleAnalyze = async () => {
    if (!photoFile) {
      setError('Please upload a clear face photo first.')
      return
    }
    setError('')
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('image', photoFile)
      const response = await fetch('/api/skin/analyze', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Skin analysis failed.')
      }
      const data = await response.json()
      setReport(data)
    } catch (fetchError) {
      const fallbackMetrics = buildSkinReport({ acne: 35, redness: 45, oiliness: 25, dryness: 30 })
      setReport({ metrics: { acne: 35, redness: 45, oiliness: 25, dryness: 30 }, ...fallbackMetrics })
      setError(fetchError.message || 'Skin analysis failed. Using a safe fallback report.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reportSummary = useMemo(() => {
    if (!report) return []
    return [
      { label: 'Acne', value: report.metrics.acne },
      { label: 'Redness', value: report.metrics.redness },
      { label: 'Oiliness', value: report.metrics.oiliness },
      { label: 'Dryness', value: report.metrics.dryness },
    ]
  }, [report])

  const isRecoveryMode = useMemo(() => {
    if (!report?.metrics) return false
    return (
      report.metrics.acne >= 60 ||
      report.metrics.redness >= 60 ||
      report.metrics.oiliness >= 60 ||
      report.metrics.dryness >= 60
    )
  }, [report])

  const sponsoredProducts = useMemo(() => {
    if (!report?.metrics) return []
    return pickSponsoredProducts(report.metrics, report.blockedIngredients)
  }, [report])

  const handleQuizChange = (id, value) => {
    setQuizAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleQuizSubmit = (event) => {
    event.preventDefault()
    const missing = SKIN_QUIZ.find((question) => !quizAnswers[question.id])
    if (missing) {
      setError(`Please select ${missing.label.toLowerCase()}.`)
      return
    }
    setError('')
    setQuizResult(buildQuizRoutine(quizAnswers))
  }

  const handleQuizReset = () => {
    setQuizAnswers({})
    setQuizResult(null)
  }

  useEffect(() => {
    const fetchUv = async () => {
      setIsLoading(true)
      setError('')

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&timezone=auto`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to load UV forecast.')
        }
        const data = await response.json()

        if (!data.hourly || !data.hourly.time || !data.hourly.uv_index) {
          throw new Error('UV data not available for this location.')
        }

        const dailyMax = {}
        data.hourly.time.forEach((timeValue, index) => {
          const dateKey = timeValue.split('T')[0]
          const uvValue = data.hourly.uv_index[index]
          if (uvValue === null || uvValue === undefined) return
          dailyMax[dateKey] = Math.max(dailyMax[dateKey] || 0, uvValue)
        })

        const dailyList = Object.keys(dailyMax)
          .sort()
          .slice(0, 7)
          .map((dateKey) => {
            const uvMax = Number(dailyMax[dateKey].toFixed(1))
            return {
              date: dateKey,
              uvMax,
              plan: buildPlan(uvMax),
            }
          })

        setForecast(dailyList)
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load UV forecast.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUv()
  }, [latitude, longitude])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">SkinCycle Planner</h1>
            <p className="text-gray-600 max-w-2xl">
              Weekly skincare plan that adapts to UV exposure. This version uses only sun UV levels to
              set daily focus and routine steps.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <Sun className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{label}</p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <p className="text-sm uppercase tracking-wide text-pink-600 font-semibold">Skin Quiz</p>
                <h2 className="text-3xl font-bold mt-2">Personalize your routine</h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Answer a few quick questions to generate a Foxtale-style routine and ingredient focus.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuizReset}
                className="btn-secondary"
              >
                Reset quiz
              </button>
            </div>

            <form onSubmit={handleQuizSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKIN_QUIZ.map((question) => (
                <div key={question.id} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">{question.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`px-3 py-2 rounded-full text-sm cursor-pointer border transition ${
                          quizAnswers[question.id] === option
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={quizAnswers[question.id] === option}
                          onChange={() => handleQuizChange(question.id, option)}
                          className="hidden"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center">
                <button type="submit" className="btn-primary">
                  Get my routine
                </button>
                <p className="text-sm text-gray-500">
                  We prioritize skin safety and recovery over aggressive actives.
                </p>
              </div>
            </form>

            {quizResult && (
              <div className="mt-8 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-pink-600 font-semibold">Your routine</p>
                    <h3 className="text-2xl font-bold mt-2">{quizResult.focus}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quizResult.categories.map((cat) => (
                      <span key={cat} className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">AM routine</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {quizResult.am.map((step) => (
                        <li key={step}>- {step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">PM routine</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {quizResult.pm.map((step) => (
                        <li key={step}>- {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {quizResult.cautions.length > 0 && (
                  <div className="mt-5 text-sm text-rose-700">
                    <span className="font-semibold">Safety notes:</span> {quizResult.cautions.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-wide text-pink-600 font-semibold">Skin Safety Scan</p>
                  <h2 className="text-3xl font-bold mt-2">Upload or capture a face photo</h2>
                  <p className="text-gray-600 mt-2 max-w-2xl">
                    We analyze visible skin signals and generate a recovery-first plan that blocks
                    harsh or risky ingredients.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 text-orange-700 px-4 py-3 rounded-xl">
                  <ShieldAlert />
                  <span className="font-semibold">Safety-first recommendations</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-gray-50 rounded-xl p-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handlePhotoChange}
                    className="w-full text-sm text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                  >
                    <Camera size={18} /> Analyze photo
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Tip: Face front camera, natural light, no filters.
                  </p>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                  {photoPreview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img src={photoPreview} alt="Uploaded face" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        {isAnalyzing ? (
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-pink-600"></div>
                            Generating skin safety report...
                          </div>
                        ) : report ? (
                          <div>
                            <h3 className="text-xl font-semibold mb-3">Skin health report</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {reportSummary.map((item) => (
                                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-500">{item.label}</p>
                                  <p className="text-lg font-semibold">{severityLabel(item.value)}</p>
                                  <p className="text-xs text-gray-500">Score {item.value}</p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-semibold text-gray-700">Blocked ingredients</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {report.blockedIngredients.length === 0 ? (
                                  <span className="text-sm text-gray-500">No blockers detected.</span>
                                ) : (
                                  report.blockedIngredients.map((item) => (
                                    <span key={item} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                                      {item}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-semibold text-gray-700">Recovery focus</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {report.recoveryFocus.length === 0 ? (
                                  <span className="text-sm text-gray-500">Balanced routine recommended.</span>
                                ) : (
                                  report.recoveryFocus.map((item) => (
                                    <span key={item} className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                                      {item}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-amber-700 mb-2">AM recovery routine</p>
                                <ul className="text-xs text-amber-800 space-y-1">
                                  {report.recoveryPlan.am.map((step) => (
                                    <li key={step}>- {step}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-blue-700 mb-2">PM recovery routine</p>
                                <ul className="text-xs text-blue-800 space-y-1">
                                  {report.recoveryPlan.pm.map((step) => (
                                    <li key={step}>- {step}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-6 border-t pt-5">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-semibold text-gray-700">Sponsored recommendations</p>
                                <span className="text-xs uppercase tracking-wide bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                  Sponsored
                                </span>
                              </div>

                              {isRecoveryMode ? (
                                <div className="bg-rose-50 text-rose-700 rounded-lg p-4 text-sm">
                                  Promotions are paused while your skin is in recovery mode. We prioritize safety
                                  over sales until irritation settles.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {sponsoredProducts.length > 0 ? (
                                    sponsoredProducts.map((product) => (
                                      <div key={product.id} className="border rounded-lg p-4 flex gap-3">
                                        <img
                                          src={resolveBackendImageUrl(product.image)}
                                          alt={product.name}
                                          className="h-16 w-16 rounded-md object-cover"
                                        />
                                        <div>
                                          <p className="text-xs text-pink-600 font-semibold">Sponsored</p>
                                          <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                                          <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {product.safetyTags.map((tag) => (
                                              <span
                                                key={tag}
                                                className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      No sponsored products match your current needs.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            Upload a clear face photo to generate your skin safety report.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 h-48">
                      <Camera className="mb-3" />
                      No photo uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Set location</h2>
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="btn-primary w-full mb-4"
            >
              Use my location
            </button>

            <form onSubmit={handleManualUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                <input
                  value={queryLat}
                  onChange={(event) => setQueryLat(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                <input
                  value={queryLon}
                  onChange={(event) => setQueryLon(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-600"
                />
              </div>
              <button type="submit" className="btn-secondary w-full">
                Update forecast
              </button>
            </form>

            {error && (
              <div className="mt-4 text-sm text-red-600">{error}</div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center bg-white rounded-lg shadow h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-600"></div>
              </div>
            ) : (
              <>
                {forecast.map((day) => (
                  <div key={day.date} className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-pink-600" />
                        <div>
                          <p className="text-sm text-gray-500">{formatDate(day.date)}</p>
                          <p className="text-lg font-semibold">UV max {day.uvMax}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        <Shield size={16} /> {day.plan.focus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">AM routine</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {day.plan.amSteps.map((step) => (
                            <li key={step}>- {step}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">PM routine</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {day.plan.pmSteps.map((step) => (
                            <li key={step}>- {step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-4">{day.plan.notes}</p>
                  </div>
                ))}

                {forecast.length === 0 && !error && (
                  <div className="bg-white rounded-lg shadow p-6 text-gray-600">
                    No forecast available yet. Update your location to generate a plan.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
