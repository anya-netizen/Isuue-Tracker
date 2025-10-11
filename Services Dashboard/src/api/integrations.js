// Mock integrations to replace base44 SDK integrations

// Mock Core integration object
export const Core = {
  InvokeLLM: async (prompt, options = {}) => {
    // Mock LLM invocation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          response: `Mock LLM response for: ${prompt}`,
          model: options.model || 'mock-model',
          usage: {
            tokens: 150
          }
        });
      }, 500);
    });
  },

  SendEmail: async (to, subject, body, options = {}) => {
    // Mock email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messageId: `mock-email-${Date.now()}`,
          status: 'sent',
          to,
          subject,
          sentAt: new Date().toISOString()
        });
      }, 300);
    });
  },

  UploadFile: async (file, options = {}) => {
    // Mock file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `file-${Date.now()}`,
          filename: file.name || 'uploaded-file',
          size: file.size || 0,
          url: `https://mock-storage.example.com/files/file-${Date.now()}`,
          uploadedAt: new Date().toISOString()
        });
      }, 1000);
    });
  },

  GenerateImage: async (prompt, options = {}) => {
    // Mock image generation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `image-${Date.now()}`,
          url: `https://picsum.photos/512/512?random=${Date.now()}`,
          prompt,
          model: options.model || 'mock-image-model',
          createdAt: new Date().toISOString()
        });
      }, 2000);
    });
  },

  ExtractDataFromUploadedFile: async (fileId, options = {}) => {
    // Mock data extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fileId,
          extractedData: {
            text: 'Mock extracted text content',
            metadata: {
              pages: 1,
              words: 100,
              confidence: 0.92
            }
          },
          extractedAt: new Date().toISOString()
        });
      }, 1500);
    });
  },

  CreateFileSignedUrl: async (fileId, options = {}) => {
    // Mock signed URL creation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: `https://mock-storage.example.com/signed/${fileId}?expires=${Date.now() + 3600000}`,
          expiresAt: new Date(Date.now() + 3600000).toISOString()
        });
      }, 200);
    });
  },

  UploadPrivateFile: async (file, options = {}) => {
    // Mock private file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `private-file-${Date.now()}`,
          filename: file.name || 'private-file',
          size: file.size || 0,
          isPrivate: true,
          uploadedAt: new Date().toISOString()
        });
      }, 1000);
    });
  }
};

// Export individual functions for convenience
export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;






