// Mock functions to replace base44 SDK functions

export const processDocumentWithAI = async (document) => {
  // Mock AI processing function
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `processed-${Date.now()}`,
        originalDocument: document,
        extractedData: {
          patientName: 'John Doe',
          dateOfService: new Date().toISOString(),
          diagnosis: 'Sample diagnosis',
          treatmentPlan: 'Sample treatment plan',
          billingCodes: ['99213', '99214'],
          confidence: 0.95
        },
        status: 'completed',
        processedAt: new Date().toISOString()
      });
    }, 1000); // Simulate processing time
  });
};

