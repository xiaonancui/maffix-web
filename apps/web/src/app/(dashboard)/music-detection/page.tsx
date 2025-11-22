'use client'

import { useState } from 'react'

export default function MusicDetectionPage() {
  // --- 1. 状态管理 (State Management) ---
  const [step1Url, setStep1Url] = useState('') // 第一步：TikTok URL
  const [step1Loading, setStep1Loading] = useState(false)
  const [step1Result, setStep1Result] = useState<any>(null) // 存储获取到的音频链接
  const [step1Error, setStep1Error] = useState<string | null>(null)

  const [step2Url, setStep2Url] = useState('') // 第二步：上传后的音频链接
  const [step2Loading, setStep2Loading] = useState(false)
  const [step2Result, setStep2Result] = useState<any>(null) // 存储音乐识别结果
  const [step2Error, setStep2Error] = useState<string | null>(null)

  // --- 2. 第一步：获取音频链接 ---
  const handleGetLink = async (event: React.FormEvent) => {
    event.preventDefault()
    
    setStep1Loading(true)
    setStep1Result(null)
    setStep1Error(null)

    try {
      if (!isValidTikTokUrl(step1Url)) {
        throw new Error('Please enter a valid TikTok video link')
      }

      console.log(`Getting audio link for: ${step1Url}`)
      
      const response = await fetch('/api/music-detection/get-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: step1Url }),
      })
      
      const responseText = await response.text()
      
      let data
      try {
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          throw new Error('Empty response received from server')
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        throw new Error('The server returned an invalid response format.')
      }

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to get audio link')
      }
      
      setStep1Result(data)

    } catch (err: any) {
      console.error('Get link error:', err)
      setStep1Error(err.message)
    } finally {
      setStep1Loading(false)
    }
  }

  // --- 3. 第二步：音乐识别 ---
  const handleDetectMusic = async (event: React.FormEvent) => {
    event.preventDefault()
    
    setStep2Loading(true)
    setStep2Result(null)
    setStep2Error(null)

    try {
      if (!step2Url.trim()) {
        throw new Error('Please enter the audio file URL')
      }

      console.log(`Detecting music from: ${step2Url}`)
      
      const response = await fetch('/api/music-detection/detect-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl: step2Url }),
      })
      
      const responseText = await response.text()
      
      let data
      try {
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          throw new Error('Empty response received from server')
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        throw new Error('The server returned an invalid response format.')
      }

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Music detection failed')
      }
      
      setStep2Result(data)

    } catch (err: any) {
      console.error('Music detection error:', err)
      setStep2Error(err.message)
    } finally {
      setStep2Loading(false)
    }
  }

  // 验证 TikTok URL
  const isValidTikTokUrl = (url: string) => {
    const tiktokPatterns = [
      /tiktok\.com\/@[\w.-]+\/video\/\d+/i,
      /vm\.tiktok\.com\/[\w]+/i,
      /tiktok\.com\/t\/[\w]+/i,
    ]
    return tiktokPatterns.some(pattern => pattern.test(url))
  }

  // 复制链接到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
      // 备用方法
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }

  // 渲染第一步结果
  const renderStep1Result = () => {
    if (step1Loading) {
      return (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF5656] border-r-transparent"></div>
          <p className="mt-3 text-gray-300">Getting audio download link...</p>
        </div>
      )
    }

    if (step1Error) {
      return (
        <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h4 className="text-lg font-semibold text-red-500">Error</h4>
          </div>
          <p className="text-gray-300">{step1Error}</p>
        </div>
      )
    }

    if (step1Result && step1Result.audioUrl) {
      return (
        <div className="rounded-lg bg-[#FF5656]/10 border border-[#FF5656]/50 p-4">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-[#FF5656] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="text-lg font-semibold text-[#FF5656]">Audio Link Retrieved!</h4>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Download Link:</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
                type="text"
                value={step1Result.audioUrl}
                readOnly
              />
              <button
                className="px-4 py-2 bg-[#FF5656] hover:bg-[#ff3333] text-white rounded-lg transition-colors text-sm font-medium"
                onClick={() => copyToClipboard(step1Result.audioUrl)}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-2">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>Click the &quot;Copy&quot; button above to copy the download link</li>
              <li>Download the MP3 file using this link</li>
              <li>Upload the MP3 file to a file hosting service (like Google Drive, Dropbox, etc.)</li>
              <li>Get a direct download link from your hosting service</li>
              <li>Paste that link in the &quot;Detect Music&quot; section below</li>
            </ol>
          </div>
        </div>
      )
    }

    return null
  }

  // 渲染第二步结果
  const renderStep2Result = () => {
    if (step2Loading) {
      return (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF5656] border-r-transparent"></div>
          <p className="mt-3 text-gray-300">Analyzing audio and detecting music...</p>
        </div>
      )
    }

    if (step2Error) {
      return (
        <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h4 className="text-lg font-semibold text-red-500">Detection Error</h4>
          </div>
          <p className="text-gray-300">{step2Error}</p>
        </div>
      )
    }

    if (step2Result) {
      if (step2Result.title === 'Music Not Identified') {
        return (
          <div className="rounded-lg bg-yellow-900/20 border border-yellow-500/50 p-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h4 className="text-lg font-semibold text-yellow-500">Music Not Identified</h4>
            </div>
            <p className="text-gray-300 mb-2">The audio could not be identified. This might be because:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
              <li>The audio doesn&apos;t contain recognizable music</li>
              <li>The music is not in our database</li>
              <li>The audio quality is too low</li>
            </ul>
          </div>
        )
      }

      return (
        <div className="rounded-lg bg-gray-800 border border-[#FF5656]/30 p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-[#FF5656] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold text-[#FF5656]">
              Music Identified!
            </h3>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
            <div className="flex border-b border-gray-700 pb-2">
              <span className="text-gray-400 w-32">Song Title:</span>
              <span className="text-white font-medium">{step2Result.title}</span>
            </div>
            <div className="flex border-b border-gray-700 pb-2">
              <span className="text-gray-400 w-32">Artist:</span>
              <span className="text-white font-medium">{step2Result.artist}</span>
            </div>
            <div className="flex border-b border-gray-700 pb-2">
              <span className="text-gray-400 w-32">Album:</span>
              <span className="text-white">{step2Result.album || 'Unknown Album'}</span>
            </div>
            <div className="flex border-b border-gray-700 pb-2">
              <span className="text-gray-400 w-32">Release Date:</span>
              <span className="text-white">{step2Result.releaseDate || 'Unknown'}</span>
            </div>
            <div className="flex border-b border-gray-700 pb-2">
              <span className="text-gray-400 w-32">Genre:</span>
              <span className="text-white">{step2Result.genre || 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-32">Confidence:</span>
              <span className="text-white">{step2Result.confidence || 'Unknown'}</span>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gray-900 rounded-lg border border-[#FF5656]/30 p-6 mb-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-10 h-10 text-[#FF5656] mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Music Detector</h1>
          </div>
          <p className="text-gray-400">Identify music from YouTube videos in two simple steps</p>
        </div>

        {/* Step 1: Get Audio Link */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FF5656] text-white text-sm font-bold mr-3">1</span>
            Get Audio Download Link
          </h2>
          <p className="text-gray-400 mb-4 text-sm">Enter a TikTok URL to get the audio download link</p>

          <form onSubmit={handleGetLink}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">TikTok URL</label>
              <input
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5656] transition-colors"
                type="url"
                placeholder="https://www.tiktok.com/@username/video/..."
                value={step1Url}
                onChange={(e) => setStep1Url(e.target.value)}
                required
                disabled={step1Loading}
              />
            </div>

            <button
              type="submit"
              className={`px-6 py-3 bg-[#FF5656] hover:bg-[#ff3333] text-white rounded-lg font-medium transition-colors ${step1Loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={step1Loading}
            >
              {step1Loading ? 'Getting Link...' : 'Get Audio Link'}
            </button>
          </form>

          <div className="mt-4">
            {renderStep1Result()}
          </div>
        </div>

        {/* Step 2: Detect Music */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FF5656] text-white text-sm font-bold mr-3">2</span>
            Detect Music
          </h2>
          <p className="text-gray-400 mb-4 text-sm">After uploading the MP3 to a hosting service, paste the direct download link here</p>

          <form onSubmit={handleDetectMusic}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Audio File URL</label>
              <input
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5656] transition-colors"
                type="url"
                placeholder="https://your-hosting-service.com/audio.mp3"
                value={step2Url}
                onChange={(e) => setStep2Url(e.target.value)}
                required
                disabled={step2Loading}
              />
              <p className="text-gray-500 text-xs mt-1">Make sure this is a direct download link to the MP3 file</p>
            </div>

            <button
              type="submit"
              className={`px-6 py-3 bg-[#FF5656] hover:bg-[#ff3333] text-white rounded-lg font-medium transition-colors ${step2Loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={step2Loading}
            >
              {step2Loading ? 'Detecting...' : 'Detect Music'}
            </button>
          </form>

          <div className="mt-4">
            {renderStep2Result()}
          </div>
        </div>

      </div>
    </div>
  )
}
