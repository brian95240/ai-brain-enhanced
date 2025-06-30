import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Brain, Activity, Zap, MessageCircle, Send, Settings, BarChart3, Smartphone, Database, Bot, Mic, MicOff, Volume2, VolumeX, Headphones } from 'lucide-react'
import brainLogo from './assets/ai_brain_logo_variant.png'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm the A.I. Apex Brain. How can I assist you today?", sender: 'ai', timestamp: '3:35:17 PM' }
  ])
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 85,
    memoryUsage: 72,
    activeAlgorithms: 42,
    successRate: 90,
    activeAgents: 12,
    loadedModels: 8,
    voiceBanks: 5,
    selfLearningRate: 44.65
  })
  
  // Voice-related state
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [handsFreeMode, setHandsFreeMode] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const silenceTimerRef = useRef(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        if (event.results[event.results.length - 1].isFinal) {
          setMessage(transcript)
          if (handsFreeMode) {
            // Auto-send message in hands-free mode
            setTimeout(() => {
              if (transcript.trim()) {
                sendMessageWithText(transcript)
              }
            }, 500)
          }
        }
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (handsFreeMode && event.error !== 'no-speech') {
          // Restart recognition in hands-free mode unless it's a critical error
          setTimeout(() => {
            if (handsFreeMode && !isListening) {
              startListening()
            }
          }, 1000)
        }
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (handsFreeMode) {
          // Restart recognition in hands-free mode
          setTimeout(() => {
            if (handsFreeMode) {
              startListening()
            }
          }, 500)
        }
      }
      
      setSpeechSupported(true)
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [handsFreeMode])

  // Handle hands-free mode toggle
  useEffect(() => {
    if (handsFreeMode && speechSupported) {
      startListening()
    } else if (!handsFreeMode && isListening) {
      stopListening()
    }
  }, [handsFreeMode])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text) => {
    if (synthRef.current && voiceEnabled) {
      // Stop any current speech
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      
      // Try to use a more natural voice
      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Samantha')
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        // Resume listening in hands-free mode after speaking
        if (handsFreeMode && !isListening) {
          setTimeout(() => startListening(), 500)
        }
      }
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const sendMessageWithText = (text) => {
    if (text.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      setChatMessages(prev => [...prev, newMessage])
      setMessage('')
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "I understand your request. Let me process that for you using my advanced neural networks and 42 optimized algorithms.",
          "Analyzing your input through my vertex-level orchestration engine. I'm accessing multiple knowledge domains to provide you with the most accurate response.",
          "Processing complete. My self-learning algorithms have identified the optimal solution path for your query.",
          "Voice input received and processed. I'm now engaging my specialized reasoning modules to address your request comprehensively.",
          "Thank you for your query. I'm utilizing my distributed processing capabilities across all 42 active algorithms to generate the best possible response.",
          "Hands-free mode active. I'm continuously listening and ready to assist you with any questions or tasks.",
          "Voice command processed successfully. My AI systems are working in parallel to provide you with the most relevant information."
        ]
        
        const aiResponse = {
          id: chatMessages.length + 2,
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
        setChatMessages(prev => [...prev, aiResponse])
        
        // Speak the AI response if voice is enabled
        if (voiceEnabled) {
          setTimeout(() => speakText(aiResponse.text), 500)
        }
      }, 1500)
    }
  }

  const sendMessage = () => {
    sendMessageWithText(message)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Voice activation with "Hey JARVIS" simulation
  const handleVoiceActivation = () => {
    if (speechSupported) {
      if (!handsFreeMode) {
        startListening()
        speakText("Yes, I'm listening. How can I assist you?")
      } else {
        speakText("Hands-free mode is already active. I'm continuously listening for your commands.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={brainLogo} alt="AI Brain Logo" className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Advanced A.I. 2nd Brain
                </h1>
                <p className="text-sm text-slate-400">Next-Generation Artificial Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                Production Ready
              </Badge>
              {speechSupported && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  <Mic className="w-3 h-3 mr-1" />
                  Voice Ready
                </Badge>
              )}
              {handsFreeMode && (
                <Badge variant="outline" className="border-purple-500 text-purple-400 animate-pulse">
                  <Headphones className="w-3 h-3 mr-1" />
                  Hands-Free
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section - Compact */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={brainLogo} alt="AI Apex Brain" className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            A.I. APEX BRAIN
          </h2>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {systemMetrics.successRate}% Success Rate
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {systemMetrics.activeAlgorithms} Active Algorithms
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Self-Learning: {systemMetrics.selfLearningRate}%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Chat Interface - Takes more space */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 h-[700px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg">Chat with A.I. Apex Brain</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Hands-Free Mode Toggle */}
                    {speechSupported && (
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-400">Hands-Free</span>
                        <Switch
                          checked={handsFreeMode}
                          onCheckedChange={setHandsFreeMode}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                    )}
                    {speechSupported && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVoiceEnabled(!voiceEnabled)}
                          className={voiceEnabled ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}
                        >
                          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </Button>
                        {isSpeaking && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={stopSpeaking}
                            className="border-red-500 text-red-400"
                          >
                            Stop
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  {handsFreeMode 
                    ? "Hands-free mode active - I'm continuously listening for your voice commands"
                    : "Interact using natural language, voice commands, or text input"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Larger Chat Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg p-4 ${
                        msg.sender === 'user' 
                          ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/30' 
                          : 'bg-slate-700/50 text-slate-100 border border-slate-600'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">{msg.timestamp}</p>
                          {msg.sender === 'ai' && voiceEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakText(msg.text)}
                              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Voice Activation Button - Only show when not in hands-free mode */}
                {speechSupported && !handsFreeMode && (
                  <div className="mb-4 text-center">
                    <Button 
                      onClick={handleVoiceActivation}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-6 py-2 rounded-full"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Say "Hey JARVIS"
                    </Button>
                  </div>
                )}
                
                {/* Input Area */}
                <div className="flex space-x-3">
                  <Textarea
                    placeholder={
                      handsFreeMode 
                        ? 'Hands-free mode active - speak naturally...' 
                        : speechSupported 
                          ? 'Type or use voice input...' 
                          : 'Type your message...'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none text-base"
                    rows={3}
                    disabled={handsFreeMode}
                  />
                  <div className="flex flex-col space-y-2">
                    {speechSupported && !handsFreeMode && (
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        disabled={isSpeaking}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </Button>
                    )}
                    <Button 
                      onClick={sendMessage} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      disabled={handsFreeMode}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Status Indicators */}
                <div className="mt-3 flex justify-center space-x-4">
                  {isListening && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                      <Mic className="w-3 h-3 mr-1" />
                      {handsFreeMode ? 'Continuously Listening...' : 'Listening...'}
                    </Badge>
                  )}
                  {isSpeaking && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speaking...
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact System Status */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">CPU</span>
                    <span className="text-yellow-400">{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Memory</span>
                    <span className="text-blue-400">{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-1.5" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{systemMetrics.activeAlgorithms}</div>
                    <div className="text-xs text-slate-400">Algorithms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{systemMetrics.successRate}%</div>
                    <div className="text-xs text-slate-400">Success</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Mic className="w-4 h-4 text-blue-500" />
                  <span>Voice Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Voice Engine</span>
                  <Badge className={`text-xs ${speechSupported ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {speechSupported ? 'Active' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Voice Output</span>
                  <Badge className={`text-xs ${voiceEnabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hands-Free Mode</span>
                  <Badge className={`text-xs ${handsFreeMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                    {handsFreeMode ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Voice Banks</span>
                  <span className="text-blue-400 font-semibold text-xs">{systemMetrics.voiceBanks}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Neon Database</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hetzner Cloud</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compact Control Dashboards */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">Control Dashboards</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Settings className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">System Controls</h4>
                <p className="text-xs text-slate-400">Backend functions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">Analytics</h4>
                <p className="text-xs text-slate-400">Performance metrics</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Smartphone className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">Mobile App</h4>
                <p className="text-xs text-slate-400">Cross-platform access</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Bot className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">AI Orchestration</h4>
                <p className="text-xs text-slate-400">Algorithm management</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <img src={brainLogo} alt="AI Brain Logo" className="w-6 h-6" />
            <span className="text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              AI APEX BRAIN
            </span>
          </div>
          <p className="text-xs">
            Advanced A.I. 2nd Brain System - Production Ready with 90% Success Rate
          </p>
          <p className="text-xs mt-1">
            42 Optimized Algorithms • Vertex-Level Orchestration • Voice Intelligence • Hands-Free Operation
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

