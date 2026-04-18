import API from './api';

/**
 * Request AI analysis / recommendations.
 * POST /ai/analyze
 */
export const getAIAnalysis = async (data = {}) => {
  const response = await API.post('/ai/analyze', data);
  return response.data;
};

/**
 * Request AI analysis for a PDF report.
 * POST /ai/analyze-report
 */
export const analyzeReport = async (base64Data, reportName = 'Medical Report') => {
  const response = await API.post('/ai/analyze-report', { base64_data: base64Data, report_name: reportName }, { timeout: 90000 });
  return response.data;
};
