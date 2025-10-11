import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  User, 
  Workflow, 
  Palette, 
  Code, 
  Lightbulb, 
  ArrowRight, 
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Building,
  Activity,
  TrendingUp,
  Download,
  ExternalLink,
  Cpu,
  Zap,
  Layers,
  MousePointer,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentationTab = ({ selectedPG, patients }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const userStorySteps = [
    {
      id: 1,
      title: "Patient Admission & Registration",
      description: "Healthcare provider submits patient information and creates initial assessment",
      actor: "Healthcare Provider",
      actions: [
        "Provider logs into the Services Dashboard",
        "Navigates to Patient Management section",
        "Creates new patient profile with demographics",
        "Assigns patient to appropriate Physician Group (PG)",
        "Sets initial care plan and diagnoses"
      ],
      outcome: "Patient is registered in the system and assigned to a care network",
      duration: "5-10 minutes",
      systemResponse: "System generates patient ID, creates billability profile, and notifies assigned PG"
    },
    {
      id: 2,
      title: "Network Analysis & HHA Assignment",
      description: "System analyzes network capacity and assigns Home Health Agency (HHA)",
      actor: "System + Care Coordinator",
      actions: [
        "System analyzes PG network connections",
        "Evaluates HHA capacity and expertise",
        "Matches patient needs with HHA capabilities",
        "Care coordinator reviews and confirms assignment",
        "System creates service agreements"
      ],
      outcome: "Patient is matched with optimal HHA within the network",
      duration: "2-5 minutes",
      systemResponse: "Network visualization updates, HHA receives patient assignment notification"
    },
    {
      id: 3,
      title: "Care Plan Processing & Validation",
      description: "Care orders move through the conveyor belt system for processing",
      actor: "Clinical Team + CPO",
      actions: [
        "Care orders enter the processing pipeline",
        "Auto-verification system validates standard orders",
        "Complex cases move to manual review belt",
        "Clinical Care Plan Oversight (CPO) reviews flagged items",
        "Orders are approved or sent back for revision"
      ],
      outcome: "All care orders are validated and ready for execution",
      duration: "10-30 minutes per order",
      systemResponse: "Orders move through belt system, status updates in real-time"
    },
    {
      id: 4,
      title: "Service Delivery & Monitoring",
      description: "HHA provides care while system tracks progress and billability",
      actor: "HHA + Patient + Family",
      actions: [
        "HHA visits patient according to care plan",
        "Services are documented in real-time",
        "System tracks billable vs non-billable activities",
        "Patient progress is monitored continuously",
        "Family receives updates through communication portal"
      ],
      outcome: "Quality care delivered with full documentation and tracking",
      duration: "Ongoing throughout care episode",
      systemResponse: "Real-time updates to patient dashboard, billability tracking, progress metrics"
    },
    {
      id: 5,
      title: "Billing & Claims Management",
      description: "System processes charges and manages insurance claims",
      actor: "Billing Team + Insurance",
      actions: [
        "System calculates billable services automatically",
        "Generates claims based on CPT codes and diagnoses",
        "Submits claims to insurance companies",
        "Tracks claim status and payments",
        "Handles denials and resubmissions"
      ],
      outcome: "Accurate billing and optimized revenue collection",
      duration: "1-3 days processing time",
      systemResponse: "Claims workflow updates, payment tracking, denial management alerts"
    },
    {
      id: 6,
      title: "Outcomes Analysis & Optimization",
      description: "System analyzes care outcomes and network performance",
      actor: "Data Analyst + Management Team",
      actions: [
        "Review patient outcomes and satisfaction scores",
        "Analyze network efficiency and bottlenecks",
        "Generate performance reports for PGs and HHAs",
        "Identify opportunities for improvement",
        "Update algorithms and care protocols"
      ],
      outcome: "Continuous improvement of care quality and operational efficiency",
      duration: "Monthly reporting cycle",
      systemResponse: "Dashboard analytics update, performance scorecards, improvement recommendations"
    }
  ];

  const uiComponents = [
    {
      category: "Navigation & Layout",
      components: [
        {
          name: "Tab Navigation System",
          description: "Five-tab structure for organizing dashboard sections",
          function: "Allows users to switch between Overview, Services, Customer Success, Communication, and Documentation",
          usage: "Click on tab headers to navigate between sections",
          implementation: "React Tabs component with dynamic content loading"
        },
        {
          name: "PG Selection Dropdown",
          description: "Physician Group selector with patient count and location info",
          function: "Filters all dashboard data based on selected Physician Group",
          usage: "Click dropdown to see all available PGs, select one to update entire dashboard",
          implementation: "Custom Select component with search and metadata display"
        },
        {
          name: "Sidebar Navigation",
          description: "Collapsible sidebar for quick access to main sections",
          function: "Provides quick navigation and status overview",
          usage: "Hover to expand, click items to navigate",
          implementation: "Animated sidebar with state management"
        }
      ]
    },
    {
      category: "Data Visualization",
      components: [
        {
          name: "3D County Map",
          description: "Interactive Mapbox map showing all 3,096 US counties",
          function: "Visualizes geographic distribution of healthcare networks",
          usage: "Zoom, pan, and click counties for detailed information. Use state filter for focused view",
          implementation: "Mapbox GL JS with custom 3D extrusion and state-based filtering"
        },
        {
          name: "Network Visualization",
          description: "Interactive graph showing connections between PGs, HHAs, and patients",
          function: "Displays care network relationships and patient flow",
          usage: "Click nodes to see details, hover for quick info, drag to rearrange",
          implementation: "Custom SVG-based network with physics simulation"
        },
        {
          name: "Conveyor Belt System",
          description: "Animated belt showing care order processing pipeline",
          function: "Real-time visualization of order status and processing flow",
          usage: "Watch orders move through pipeline, click for details, control speed",
          implementation: "CSS animations with React state management"
        },
        {
          name: "Billability Dashboard",
          description: "Comprehensive billing and revenue tracking interface",
          function: "Monitors billable services, claim status, and revenue optimization",
          usage: "Filter by status, export reports, drill down into patient details",
          implementation: "Data tables with advanced filtering and export functionality"
        }
      ]
    },
    {
      category: "Interactive Elements",
      components: [
        {
          name: "Action Buttons",
          description: "Context-sensitive buttons for user actions",
          function: "Trigger specific workflows like patient selection, order processing, report generation",
          usage: "Click to execute actions, hover for tooltips",
          implementation: "Custom button variants with loading states and animations"
        },
        {
          name: "Status Badges",
          description: "Color-coded indicators for various statuses",
          function: "Quickly communicate status of patients, orders, claims, etc.",
          usage: "Visual indicators - no interaction required",
          implementation: "Custom badge components with semantic color coding"
        },
        {
          name: "Progress Indicators",
          description: "Visual representation of completion status",
          function: "Show progress through care episodes, claim processing, etc.",
          usage: "Visual feedback - updates automatically",
          implementation: "Animated progress bars and circular indicators"
        }
      ]
    },
    {
      category: "Data Management",
      components: [
        {
          name: "Patient Dashboard",
          description: "Comprehensive patient information and care timeline",
          function: "Centralized view of all patient-related data and activities",
          usage: "Navigate through patient history, update information, track progress",
          implementation: "Tabbed interface with real-time data binding"
        },
        {
          name: "Claims Workflow",
          description: "End-to-end claims processing and management",
          function: "Handles claim creation, submission, tracking, and resolution",
          usage: "Process claims step-by-step, handle exceptions, track payments",
          implementation: "Workflow engine with state machine logic"
        },
        {
          name: "Document Management",
          description: "Upload, organize, and track healthcare documents",
          function: "Manages all care-related documentation and compliance",
          usage: "Upload files, categorize documents, track approvals",
          implementation: "File upload system with metadata management"
        }
      ]
    }
  ];

  const rdComponents = [
    {
      category: "Animation Libraries",
      items: [
        {
          name: "Framer Motion",
          description: "Production-ready motion library for React",
          source: "https://www.framer.com/motion/",
          usage: "Page transitions, component animations, gesture handling",
          implementation: "Used for tab transitions, card animations, and loading states",
          integration: "npm install framer-motion",
          examples: [
            "Conveyor belt animation",
            "Card hover effects", 
            "Page transition animations",
            "Network node movements"
          ]
        },
        {
          name: "CSS Animations",
          description: "Native CSS animation and transition effects",
          source: "CSS3 Specifications",
          usage: "Simple transitions, hover effects, loading spinners",
          implementation: "Custom CSS classes with keyframes and transitions",
          integration: "Built into CSS/Tailwind configuration",
          examples: [
            "Button hover effects",
            "Badge pulse animations",
            "Loading spinner rotations",
            "Gradient background shifts"
          ]
        }
      ]
    },
    {
      category: "Data Visualization",
      items: [
        {
          name: "Mapbox GL JS",
          description: "Interactive maps and location data visualization",
          source: "https://docs.mapbox.com/mapbox-gl-js/",
          usage: "Geographic visualization, county mapping, location analytics",
          implementation: "3D county extrusion, state-based filtering, interactive tooltips",
          integration: "npm install mapbox-gl react-map-gl",
          examples: [
            "US Counties 3D visualization",
            "State-based zoom and filtering",
            "Healthcare network geographic distribution",
            "Interactive map controls"
          ]
        },
        {
          name: "Custom SVG Components",
          description: "Scalable vector graphics for data visualization",
          source: "React + SVG",
          usage: "Network diagrams, custom charts, icons",
          implementation: "React components rendering SVG elements",
          integration: "Built into React components",
          examples: [
            "Network connection lines",
            "Custom chart elements",
            "Interactive node diagrams",
            "Status indicator graphics"
          ]
        }
      ]
    },
    {
      category: "UI Component Libraries",
      items: [
        {
          name: "shadcn/ui",
          description: "Re-usable components built using Radix UI and Tailwind CSS",
          source: "https://ui.shadcn.com/",
          usage: "Base UI components for consistent design system",
          implementation: "Pre-built accessible components with custom styling",
          integration: "npx shadcn-ui@latest add [component]",
          examples: [
            "Card components",
            "Button variants",
            "Dialog modals",
            "Form controls",
            "Navigation tabs"
          ]
        },
        {
          name: "Radix UI",
          description: "Low-level UI primitives for building design systems",
          source: "https://www.radix-ui.com/",
          usage: "Accessible, unstyled components as building blocks",
          implementation: "Base layer for shadcn/ui components",
          integration: "Installed as dependencies of shadcn/ui",
          examples: [
            "Dropdown menus",
            "Modal dialogs",
            "Tooltip components",
            "Accordion interfaces"
          ]
        }
      ]
    },
    {
      category: "State Management & Data Flow",
      items: [
        {
          name: "React Hooks",
          description: "Built-in React state management and effects",
          source: "React 18.x",
          usage: "Component state, side effects, context management",
          implementation: "useState, useEffect, useCallback, useMemo",
          integration: "Built into React",
          examples: [
            "Patient selection state",
            "Loading states",
            "Form data management",
            "API call effects"
          ]
        },
        {
          name: "Custom Data Layer",
          description: "Mock data structure for healthcare entities",
          source: "Custom implementation",
          usage: "Simulates real healthcare data for development",
          implementation: "Structured JSON data with relationships",
          integration: "Imported as ES6 modules",
          examples: [
            "Patient demographics",
            "Physician group networks",
            "Billing and claims data",
            "Care plan information"
          ]
        }
      ]
    }
  ];

  const DocumentViewer = ({ document }) => (
    <ScrollArea className="h-96">
      <div className="p-6 space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-xl font-bold text-gray-800">{document.title}</h3>
          <p className="text-gray-600 mt-2">{document.description}</p>
        </div>
        
        {document.content && (
          <div className="prose prose-sm max-w-none">
            {document.content.map((section, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{section.heading}</h4>
                <div className="text-gray-700 leading-relaxed">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2 ml-4">
                      {section.content.map((item, i) => (
                        <li key={i} className="list-disc">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentation Center</h2>
          <p className="text-gray-600 mt-1">Comprehensive guides for workflows, UI components, and technical implementation</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Version 1.0
        </Badge>
      </div>

      <Card className="shadow-lg">
        <Tabs defaultValue="user-stories" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user-stories">
                <User className="w-4 h-4 mr-2" />
                User Stories & Workflows
              </TabsTrigger>
              <TabsTrigger value="ui-design">
                <Palette className="w-4 h-4 mr-2" />
                UI Design Documentation
              </TabsTrigger>
              <TabsTrigger value="rd-resources">
                <Code className="w-4 h-4 mr-2" />
                R&D Resources
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="user-stories" className="space-y-4 mt-0">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Healthcare Service Workflow</h3>
                <p className="text-gray-600">End-to-end patient journey from admission through outcomes analysis</p>
              </div>
              
              <div className="space-y-4">
                {userStorySteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-white hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                              {step.id}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{step.title}</CardTitle>
                              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <Users className="w-4 h-4" />
                                {step.actor}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{step.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <Workflow className="w-4 h-4 text-indigo-600" />
                              Actions Performed
                            </h5>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {step.actions.map((action, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <ArrowRight className="w-3 h-3 mt-1 text-indigo-500 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Expected Outcome
                              </h5>
                              <p className="text-sm text-gray-600">{step.outcome}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-600" />
                                System Response
                              </h5>
                              <p className="text-sm text-gray-600">{step.systemResponse}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ui-design" className="space-y-4 mt-0">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">UI Component Documentation</h3>
                <p className="text-gray-600">Detailed breakdown of all user interface elements and their functionality</p>
              </div>

              <div className="space-y-6">
                {uiComponents.map((category, index) => (
                  <Card key={category.category} className="border border-gray-200">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-600" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-200">
                        {category.components.map((component, i) => (
                          <div key={component.name} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{component.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                Interactive
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{component.description}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <h5 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-yellow-500" />
                                  Function
                                </h5>
                                <p className="text-gray-600">{component.function}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                                  <MousePointer className="w-3 h-3 text-green-500" />
                                  Usage
                                </h5>
                                <p className="text-gray-600">{component.usage}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                                  <Cpu className="w-3 h-3 text-purple-500" />
                                  Implementation
                                </h5>
                                <p className="text-gray-600">{component.implementation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rd-resources" className="space-y-4 mt-0">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Research & Development Resources</h3>
                <p className="text-gray-600">Technical documentation for animations, libraries, and implementation details</p>
              </div>

              <div className="space-y-6">
                {rdComponents.map((category, index) => (
                  <Card key={category.category} className="border border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-200">
                        {category.items.map((item, i) => (
                          <div key={item.name} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                <p className="text-gray-600 mt-1">{item.description}</p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={item.source} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Source
                                </a>
                              </Button>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Play className="w-4 h-4 text-green-600" />
                                    Primary Usage
                                  </h5>
                                  <p className="text-gray-600 text-sm">{item.usage}</p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-blue-600" />
                                    Implementation Details
                                  </h5>
                                  <p className="text-gray-600 text-sm">{item.implementation}</p>
                                </div>

                                <div className="bg-gray-100 p-3 rounded-lg">
                                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Download className="w-4 h-4 text-purple-600" />
                                    Integration Command
                                  </h5>
                                  <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded border">
                                    {item.integration}
                                  </code>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                                  Implementation Examples
                                </h5>
                                <div className="space-y-2">
                                  {item.examples.map((example, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                      <span className="text-gray-700">{example}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Implementation Notes</h4>
                      <div className="text-yellow-700 text-sm space-y-2">
                        <p>• All animated components are optimized for performance with proper cleanup on unmount</p>
                        <p>• Mapbox requires API token configuration in environment variables</p>
                        <p>• Custom SVG components include accessibility attributes for screen readers</p>
                        <p>• Animation timing is configurable through CSS custom properties</p>
                        <p>• All external libraries are properly bundled to minimize impact on load time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DocumentationTab;