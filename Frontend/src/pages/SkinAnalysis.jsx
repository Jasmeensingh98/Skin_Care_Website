import { useCallback, useEffect, useRef, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { Camera, Scan, Upload, Video, VideoOff, Send, FileText } from 'lucide-react'

import { useStore } from '../store/store'

import { skinReportAPI } from '../services/api'

import toast from 'react-hot-toast'



const severityLabel = (value) => {

  if (value >= 70) return 'High'

  if (value >= 40) return 'Moderate'

  return 'Low'

}



export default function SkinAnalysis() {

  const navigate = useNavigate()

  const { user } = useStore()

  const videoRef = useRef(null)

  const streamRef = useRef(null)



  const [photoFile, setPhotoFile] = useState(null)

  const [photoPreview, setPhotoPreview] = useState('')

  const [cameraOn, setCameraOn] = useState(false)

  const [cameraReady, setCameraReady] = useState(false)

  const [analysis, setAnalysis] = useState(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const [savedReportId, setSavedReportId] = useState(null)



  const stopCamera = useCallback(() => {

    if (streamRef.current) {

      streamRef.current.getTracks().forEach((t) => t.stop())

      streamRef.current = null

    }

    if (videoRef.current) {

      videoRef.current.srcObject = null

    }

    setCameraOn(false)

    setCameraReady(false)

  }, [])



  // Attach stream after <video> is mounted (cameraOn === true)

  useEffect(() => {

    const video = videoRef.current

    const stream = streamRef.current

    if (!cameraOn || !video || !stream) return



    video.srcObject = stream

    setCameraReady(false)



    const onReady = () => setCameraReady(true)

    video.addEventListener('loadedmetadata', onReady)



    video.play().catch(() => {

      toast.error('Could not start video preview')

    })



    return () => {

      video.removeEventListener('loadedmetadata', onReady)

    }

  }, [cameraOn])



  useEffect(() => {

    return () => {

      stopCamera()

      if (photoPreview) URL.revokeObjectURL(photoPreview)

    }

  }, [photoPreview, stopCamera])



  const startCamera = async () => {

    if (!navigator.mediaDevices?.getUserMedia) {

      toast.error('Camera not supported in this browser. Use upload instead.')

      return

    }



    try {

      stopCamera()



      const stream = await navigator.mediaDevices.getUserMedia({

        video: {

          facingMode: 'user',

          width: { ideal: 1280 },

          height: { ideal: 720 },

        },

        audio: false,

      })



      streamRef.current = stream

      setCameraOn(true)

    } catch (err) {

      console.error('Camera error:', err)

      const msg =

        err.name === 'NotAllowedError'

          ? 'Camera permission denied. Allow camera access in browser settings.'

          : err.name === 'NotFoundError'

            ? 'No camera found on this device.'

            : 'Could not open camera. Try upload instead.'

      toast.error(msg)

    }

  }



  const capturePhoto = () => {

    const video = videoRef.current

    if (!video || !streamRef.current) {

      toast.error('Open the camera first')

      return

    }



    const width = video.videoWidth

    const height = video.videoHeight

    if (!width || !height) {

      toast.error('Camera still loading — wait a second and try again')

      return

    }



    const canvas = document.createElement('canvas')

    canvas.width = width

    canvas.height = height

    const ctx = canvas.getContext('2d')

    // Un-mirror so saved photo matches real orientation

    ctx.translate(width, 0)

    ctx.scale(-1, 1)

    ctx.drawImage(video, 0, 0, width, height)



    canvas.toBlob(

      (blob) => {

        if (!blob) {

          toast.error('Capture failed — try again')

          return

        }

        if (photoPreview) URL.revokeObjectURL(photoPreview)

        const file = new File([blob], 'face-capture.jpg', { type: 'image/jpeg' })

        setPhotoFile(file)

        setPhotoPreview(URL.createObjectURL(blob))

        setAnalysis(null)

        setSavedReportId(null)

        stopCamera()

        toast.success('Photo captured!')

      },

      'image/jpeg',

      0.92

    )

  }



  const handleFileChange = (e) => {

    const file = e.target.files?.[0]

    if (!file) return

    stopCamera()

    if (photoPreview) URL.revokeObjectURL(photoPreview)

    setPhotoFile(file)

    setPhotoPreview(URL.createObjectURL(file))

    setAnalysis(null)

    setSavedReportId(null)

  }



  const runAnalysis = async () => {

    if (!photoFile) {

      toast.error('Capture or upload a face photo first')

      return

    }

    setIsAnalyzing(true)

    try {

      const formData = new FormData()

      formData.append('image', photoFile)

      const { data } = await skinReportAPI.analyze(formData)

      setAnalysis(data)

      toast.success('Skin analysis complete')

    } catch (err) {

      toast.error(err.response?.data?.message || 'Analysis failed')

    } finally {

      setIsAnalyzing(false)

    }

  }



  const submitToDermatologist = async () => {

    if (!user) {

      toast.error('Please login to save your report')

      navigate('/login')

      return

    }

    if (!photoFile) {

      toast.error('Capture a photo first')

      return

    }

    setIsSaving(true)

    try {

      const formData = new FormData()

      formData.append('image', photoFile)

      const { data } = await skinReportAPI.createReport(formData)

      setSavedReportId(data._id)

      setAnalysis(data)

      toast.success('Report sent to dermatologist for review!')
      navigate(`/my-skin-reports/${data._id}`)

    } catch (err) {

      toast.error(err.response?.data?.message || 'Failed to save report')

    } finally {

      setIsSaving(false)

    }

  }



  if (!user) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">

        <div className="text-center max-w-md">

          <Scan className="mx-auto text-rose-500 mb-4" size={48} />

          <h1 className="text-2xl font-bold mb-2">AI Skin Analysis</h1>

          <p className="text-gray-600 mb-6">Login to capture your face, get a skin report, and receive product recommendations from our dermatologist.</p>

          <Link to="/login" className="btn-primary inline-block px-8 py-3">Login to continue</Link>

        </div>

      </div>

    )

  }



  return (

    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-violet-50 py-10">

      <div className="container mx-auto px-4 max-w-5xl">

        <div className="text-center mb-8">

          <p className="text-rose-600 font-semibold uppercase text-sm tracking-wide">Vulpine Skin Lab</p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">AI Skin Analysis by Camera</h1>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">

            Capture your face, get an instant AI report, then send it to our dermatologist panel for personalized product recommendations.

          </p>

        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Camera / Upload */}

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-rose-100">

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">

              <Camera size={20} className="text-rose-500" /> Step 1: Capture face

            </h2>



            {cameraOn ? (

              <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] mb-4">

                <video

                  ref={videoRef}

                  className="w-full h-full object-cover scale-x-[-1]"

                  playsInline

                  autoPlay

                  muted

                />

                {!cameraReady && (

                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/70">

                    Starting camera...

                  </div>

                )}

              </div>

            ) : photoPreview ? (

              <img src={photoPreview} alt="Your face" className="w-full rounded-xl aspect-[4/3] object-cover mb-4" />

            ) : (

              <div className="bg-gray-100 rounded-xl aspect-[4/3] flex items-center justify-center text-gray-400 mb-4">

                No photo yet

              </div>

            )}



            <div className="flex flex-wrap gap-2">

              {!cameraOn ? (

                <button type="button" onClick={startCamera} className="btn-primary flex items-center gap-2 text-sm">

                  <Video size={16} /> Open camera

                </button>

              ) : (

                <>

                  <button

                    type="button"

                    onClick={capturePhoto}

                    disabled={!cameraReady}

                    className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"

                  >

                    <Camera size={16} /> Capture

                  </button>

                  <button type="button" onClick={stopCamera} className="btn-outline flex items-center gap-2 text-sm">

                    <VideoOff size={16} /> Stop

                  </button>

                </>

              )}

              <label className="btn-outline flex items-center gap-2 text-sm cursor-pointer">

                <Upload size={16} /> Upload

                <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} />

              </label>

            </div>



            {cameraOn && (

              <p className="text-xs text-gray-500 mt-2">

                Allow camera permission if prompted. Face the light and hold still before capturing.

              </p>

            )}



            <button

              type="button"

              onClick={runAnalysis}

              disabled={!photoFile || isAnalyzing}

              className="w-full mt-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"

            >

              <Scan size={18} />

              {isAnalyzing ? 'Analyzing...' : 'Step 2: Run AI analysis'}

            </button>

          </div>



          {/* Report */}

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-violet-100">

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">

              <FileText size={20} className="text-violet-500" /> Your skin report

            </h2>



            {isAnalyzing && (

              <div className="flex items-center gap-3 text-gray-600 py-12 justify-center">

                <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full" />

                Analyzing your skin...

              </div>

            )}



            {!isAnalyzing && !analysis && (

              <p className="text-gray-500 py-12 text-center">Run analysis to see your report here.</p>

            )}



            {analysis && !isAnalyzing && (

              <div>

                {analysis.aiSummary && (

                  <p className="text-sm text-gray-700 bg-violet-50 p-3 rounded-lg mb-4">{analysis.aiSummary}</p>

                )}
                {analysis.skinType && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Predicted skin type</p>
                    <p className="font-semibold text-lg capitalize">{analysis.skinType}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">

                  {['acne', 'redness', 'oiliness', 'dryness'].map((key) => (

                    <div key={key} className="bg-gray-50 rounded-lg p-3">

                      <p className="text-xs text-gray-500 capitalize">{key}</p>

                      <p className="font-bold">{severityLabel(analysis.metrics?.[key] ?? 0)}</p>

                      <p className="text-xs text-gray-400">Score {analysis.metrics?.[key] ?? 0}</p>

                    </div>

                  ))}

                </div>



                {analysis.recoveryFocus?.length > 0 && (

                  <div className="mb-4">

                    <p className="text-sm font-semibold">Recovery focus</p>

                    <div className="flex flex-wrap gap-2 mt-1">

                      {analysis.recoveryFocus.map((f) => (

                        <span key={f} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{f}</span>

                      ))}

                    </div>

                  </div>

                )}



                <button

                  type="button"

                  onClick={submitToDermatologist}

                  disabled={isSaving || savedReportId}

                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"

                >

                  <Send size={18} />

                  {savedReportId ? 'Sent to dermatologist ✓' : isSaving ? 'Sending...' : 'Step 3: Send to dermatologist'}

                </button>



                {savedReportId && (

                  <Link

                    to={`/my-skin-reports/${savedReportId}`}

                    className="block text-center mt-3 text-violet-600 font-semibold hover:underline"

                  >

                    View your saved report →

                  </Link>

                )}

              </div>

            )}

          </div>

        </div>



        <div className="mt-8 text-center">

          <Link to="/my-skin-reports" className="text-rose-600 font-semibold hover:underline">

            View all my skin reports

          </Link>

        </div>

      </div>

    </div>

  )

}


