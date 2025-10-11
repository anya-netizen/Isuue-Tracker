// Analytics and utility functions for the patient flow management system

export const calculateMetrics = (patients, documents, actionItems, careCoordination) => {
  const metrics = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.status === 'active').length,
    pendingDocuments: documents.filter(d => d.processing_status === 'processing').length,
    openActionItems: actionItems.filter(a => a.status === 'open').length,
    totalRevenue: 0,
    cpoMinutesCompleted: 0,
    completionRate: 0
  };

  // Calculate revenue and CPO minutes
  careCoordination.forEach(cc => {
    if (cc.is_billable) {
      metrics.cpoMinutesCompleted += cc.cpo_minutes;
      // Assuming average rate of $3 per CPO minute
      metrics.totalRevenue += cc.cpo_minutes * 3;
    }
  });

  // Calculate completion rate
  const completedItems = actionItems.filter(a => a.status === 'resolved').length;
  metrics.completionRate = actionItems.length > 0 ? 
    Math.round((completedItems / actionItems.length) * 100) : 0;

  return metrics;
};

export const getPatientsByStatus = (patients) => {
  const statusCounts = patients.reduce((acc, patient) => {
    acc[patient.status] = (acc[patient.status] || 0) + 1;
    return acc;
  }, {});
  
  return statusCounts;
};

export const getRecentActivity = (actionItems, documents, careCoordination, limit = 10) => {
  const activities = [];
  
  // Add action items
  actionItems.forEach(item => {
    activities.push({
      id: item.id,
      type: 'action_item',
      title: item.title,
      status: item.status,
      priority: item.priority,
      timestamp: item.updated_date,
      patient_id: item.patient_id
    });
  });
  
  // Add documents
  documents.forEach(doc => {
    activities.push({
      id: doc.id,
      type: 'document',
      title: doc.title,
      status: doc.processing_status,
      priority: doc.processing_status === 'error' ? 'high' : 'medium',
      timestamp: doc.updated_date,
      patient_id: doc.patient_id
    });
  });
  
  // Add care coordination
  careCoordination.forEach(cc => {
    activities.push({
      id: cc.id,
      type: 'care_coordination',
      title: `Care Coordination - ${cc.cpo_minutes} minutes`,
      status: cc.is_billable ? 'billable' : 'pending',
      priority: 'medium',
      timestamp: cc.updated_date,
      patient_id: cc.patient_id
    });
  });
  
  // Sort by timestamp and limit
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

export const getBillingMetrics = (billingCodes, careCoordination) => {
  const totalCodes = billingCodes.length;
  const completedCodes = billingCodes.filter(bc => bc.completion_status === 'completed').length;
  const pendingCodes = billingCodes.filter(bc => bc.completion_status === 'pending').length;
  
  const totalValue = billingCodes.reduce((sum, bc) => sum + (bc.value || 0), 0);
  const completedValue = billingCodes
    .filter(bc => bc.completion_status === 'completed')
    .reduce((sum, bc) => sum + (bc.value || 0), 0);
  
  const totalCPOMinutes = careCoordination.reduce((sum, cc) => sum + cc.cpo_minutes, 0);
  const billableCPOMinutes = careCoordination
    .filter(cc => cc.is_billable)
    .reduce((sum, cc) => sum + cc.cpo_minutes, 0);
  
  return {
    totalCodes,
    completedCodes,
    pendingCodes,
    completionRate: totalCodes > 0 ? Math.round((completedCodes / totalCodes) * 100) : 0,
    totalValue,
    completedValue,
    totalCPOMinutes,
    billableCPOMinutes,
    billableRate: totalCPOMinutes > 0 ? Math.round((billableCPOMinutes / totalCPOMinutes) * 100) : 0
  };
};

export const getPhysicianGroupMetrics = (physicianGroups, patients) => {
  return physicianGroups.map(pg => {
    const pgPatients = patients.filter(p => p.physicianGroupId === pg.id);
    const activePatients = pgPatients.filter(p => p.status === 'active').length;
    
    return {
      ...pg,
      currentPatients: pgPatients.length,
      activePatients,
      utilizationRate: pg.active_patients > 0 ? 
        Math.round((activePatients / pg.active_patients) * 100) : 0
    };
  });
};

export const getDocumentProcessingStats = (documents) => {
  const stats = documents.reduce((acc, doc) => {
    acc[doc.processing_status] = (acc[doc.processing_status] || 0) + 1;
    return acc;
  }, {});
  
  const total = documents.length;
  
  return {
    total,
    validated: stats.validated || 0,
    processing: stats.processing || 0,
    extracted: stats.extracted || 0,
    error: stats.error || 0,
    validationRate: total > 0 ? Math.round(((stats.validated || 0) / total) * 100) : 0,
    errorRate: total > 0 ? Math.round(((stats.error || 0) / total) * 100) : 0
  };
};

export const getPriorityActionItems = (actionItems) => {
  const highPriority = actionItems.filter(item => 
    item.priority === 'high' && item.status !== 'resolved'
  );
  
  const overdue = actionItems.filter(item => {
    const dueDate = new Date(item.due_date);
    const now = new Date();
    return dueDate < now && item.status !== 'resolved';
  });
  
  return {
    highPriority,
    overdue,
    urgent: [...new Set([...highPriority, ...overdue])].sort((a, b) => 
      new Date(a.due_date) - new Date(b.due_date)
    )
  };
};

export const generateRandomData = () => {
  // Utility function to generate additional demo data if needed
  const statuses = ['active', 'pending', 'discharged'];
  const priorities = ['low', 'medium', 'high'];
  const documentTypes = ['referral', 'soc', '485', 'f2f', 'discharge', 'orders'];
  
  return {
    randomStatus: () => statuses[Math.floor(Math.random() * statuses.length)],
    randomPriority: () => priorities[Math.floor(Math.random() * priorities.length)],
    randomDocumentType: () => documentTypes[Math.floor(Math.random() * documentTypes.length)],
    randomDate: (daysBack = 30) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
      return date.toISOString();
    }
  };
};