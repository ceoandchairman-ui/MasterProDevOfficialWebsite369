import apiClient from '@/api/base44Client';

// Core integrations - handles email, file uploads, and LLM calls

export const SendEmail = async (data) => {
  try {
    const response = await apiClient.post('/integrations/email/send', data);
    return response;
  } catch (error) {
    console.warn('SendEmail failed (no backend), simulating success:', error.message);
    // Mock success response
    return { 
      success: true, 
      message: 'Email queued (mock)',
      data: { id: `mock_${Date.now()}` }
    };
  }
};

export const UploadFile = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(options).forEach(key => formData.append(key, options[key]));
    
    const response = await apiClient.post('/integrations/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    console.warn('UploadFile failed (no backend), simulating success:', error.message);
    // Mock success response
    return {
      success: true,
      url: `https://mock-storage.com/${file.name}`,
      filename: file.name,
      size: file.size
    };
  }
};

export const InvokeLLM = async (prompt, options = {}) => {
  try {
    const response = await apiClient.post('/integrations/llm/invoke', {
      prompt,
      ...options
    });
    return response;
  } catch (error) {
    console.warn('InvokeLLM failed (no backend), returning mock response:', error.message);
    // Mock LLM response
    return {
      success: true,
      response: "I'm a mock AI assistant. Connect your backend to enable real responses.",
      usage: { tokens: 0 }
    };
  }
};

export default {
  SendEmail,
  UploadFile,
  InvokeLLM
};
