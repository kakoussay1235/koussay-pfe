import api from './api';

export const getFamilyMembers = async () => {
  try {
    const response = await api.get('/api/family-members');
    return response.data;
  } catch (error) {
    console.error('Error fetching family members:', error);
    throw error;
  }
};

export const addFamilyMember = async (memberData) => {
  try {
    const response = await api.post('/api/family-members', memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding family member:', error);
    throw error;
  }
};

export const updateFamilyMember = async (id, memberData) => {
  try {
    const response = await api.put(`/api/family-members/${id}`, memberData);
    return response.data;
  } catch (error) {
    console.error('Error updating family member:', error);
    throw error;
  }
};

export const deleteFamilyMember = async (id) => {
  try {
    const response = await api.delete(`/api/family-members/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting family member:', error);
    throw error;
  }
};

export const assignTransactionToMember = async (transactionId, memberId) => {
  try {
    const response = await api.post(`/api/transactions/${transactionId}/assign`, { memberId });
    return response.data;
  } catch (error) {
    console.error('Error assigning transaction to member:', error);
    throw error;
  }
};
