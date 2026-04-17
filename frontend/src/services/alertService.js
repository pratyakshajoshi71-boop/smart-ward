import API from './api';

/**
 * Fetch active alerts.
 * GET /alerts
 */
export const getAlerts = async () => {
  const response = await API.get('/alerts');
  return response.data;
};

/**
 * Clear all active alerts.
 * DELETE /alerts
 */
export const clearAlerts = async () => {
  const response = await API.delete('/alerts');
  return response.data;
};
