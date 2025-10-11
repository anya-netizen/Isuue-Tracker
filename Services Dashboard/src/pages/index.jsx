import Layout from "./Layout.jsx";

import ServicesDashboard from "./ServicesDashboard";

import NetworkAnalysis from "./NetworkAnalysis";

import PatientManagement from "./PatientManagement";

import DocumentIngestion from "./DocumentIngestion";

import ResolutionCenter from "./ResolutionCenter";

import PGDashboardNew from "./PGDashboardNew";
import PGReporting from "./PGReporting";
import CustomerSuccessDashboard from "./CustomerSuccessDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    ServicesDashboard: ServicesDashboard,
    
    NetworkAnalysis: NetworkAnalysis,
    
    PatientManagement: PatientManagement,
    
    DocumentIngestion: DocumentIngestion,
    
    ResolutionCenter: ResolutionCenter,
    
    PGDashboardNew: PGDashboardNew,
    
    PGReporting: PGReporting,
    
    CustomerSuccessDashboard: CustomerSuccessDashboard,
    
};

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<ServicesDashboard />} />
                
                
                <Route path="/ServicesDashboard" element={<ServicesDashboard />} />
                
                <Route path="/services-dashboard" element={<ServicesDashboard />} />
                
                <Route path="/NetworkAnalysis" element={<NetworkAnalysis />} />
                
                <Route path="/networkanalysis" element={<NetworkAnalysis />} />
                
                <Route path="/PatientManagement" element={<PatientManagement />} />
                
                <Route path="/patientmanagement" element={<PatientManagement />} />
                
                <Route path="/DocumentIngestion" element={<DocumentIngestion />} />
                
                <Route path="/documentingestion" element={<DocumentIngestion />} />
                
                <Route path="/ResolutionCenter" element={<ResolutionCenter />} />
                
                <Route path="/resolutioncenter" element={<ResolutionCenter />} />
                
                <Route path="/PGDashboardNew" element={<PGDashboardNew />} />
                
                <Route path="/pgdashboardnew" element={<PGDashboardNew />} />
                
                <Route path="/PGReporting" element={<PGReporting />} />
                
                <Route path="/pgreporting" element={<PGReporting />} />
                
                <Route path="/CustomerSuccessDashboard" element={<CustomerSuccessDashboard />} />
                
                <Route path="/customersuccessdashboard" element={<CustomerSuccessDashboard />} />
                
                <Route path="/customer-success" element={<CustomerSuccessDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}