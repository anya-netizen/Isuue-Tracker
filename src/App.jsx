import React, { useState, useEffect } from 'react'
import CustomerSuccessTab from './components/CustomerSuccessTab'
import { physicianGroups, patients, documents } from './data/mockData'
import { enhancedPhysicianGroups } from './data/enhancedPGData'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Building2, AlertCircle } from 'lucide-react'
import './App.css'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-6 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-900">Application Error</h1>
            </div>
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-mono text-sm">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <details className="bg-slate-50 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                Stack Trace
              </summary>
              <pre className="text-xs text-slate-600 overflow-auto">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [selectedPG, setSelectedPG] = useState(null)
  const [allPGs, setAllPGs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      console.log('🚀 App initializing...')
      console.log('📊 Loading data:', {
        physicianGroups: physicianGroups?.length || 0,
        enhancedPhysicianGroups: enhancedPhysicianGroups?.length || 0,
        patients: patients?.length || 0,
        documents: documents?.length || 0
      })

      const combined = [...(physicianGroups || []), ...(enhancedPhysicianGroups || [])]
      console.log('✅ Combined PGs:', combined.length)
      
      setAllPGs(combined)
      
      if (combined.length > 0) {
        setSelectedPG(combined[0])
        console.log('✅ Initial PG selected:', combined[0].name)
      } else {
        console.warn('⚠️ No physician groups available')
      }
      
      setLoading(false)
      console.log('✅ App initialization complete')
    } catch (err) {
      console.error('❌ Error initializing app:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-xl font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-900 text-center mb-2">Error Loading Dashboard</h1>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!selectedPG) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-2">No Physician Groups Available</h2>
          <p className="text-slate-600">Please check your data configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Customer Success Dashboard</h1>
                  <p className="text-slate-600">{selectedPG.name}</p>
                </div>
              </div>
              <div className="w-80">
                <Select 
                  value={selectedPG?.name} 
                  onValueChange={(value) => {
                    const pg = allPGs.find(p => p.name === value)
                    console.log('🔄 PG changed to:', pg?.name)
                    setSelectedPG(pg)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PG" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPGs.map((pg) => (
                      <SelectItem key={pg.name} value={pg.name}>
                        {pg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Customer Success Tab */}
          <CustomerSuccessTab 
            selectedPG={selectedPG}
            patients={patients}
            documents={documents}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App

