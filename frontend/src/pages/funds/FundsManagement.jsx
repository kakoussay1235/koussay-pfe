import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Lock, Unlock, PiggyBank } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { handleApiError } from '../../services/api';
import ExportButton from '../../components/ExportButton';
import useNotification from '../../hooks/useNotifications';

const FundsManagement = () => {
  const { t } = useTranslation();
  const { success, error } = useNotification();
  
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    color: '#3b82f6',
    is_locked: false
  });

  // Charger les fonds
  const loadFunds = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/funds');
      setFunds(response.data.data || response.data);
    } catch (err) {
      error(t('errors.loadingFunds'), t('common.error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  // Gérer les changements du formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const fundData = {
        ...formData,
        target_amount: formData.target_amount ? parseFloat(formData.target_amount) : null,
        current_amount: parseFloat(formData.current_amount) || 0
      };
      
      if (editingFund) {
        await api.put(`/api/funds/${editingFund.id}`, fundData);
        success(t('funds.updateSuccess'), t('common.success'));
      } else {
        await api.post('/api/funds', fundData);
        success(t('funds.createSuccess'), t('common.success'));
      }
      
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '0',
        color: '#3b82f6',
        is_locked: false
      });
      setEditingFund(null);
      setIsModalOpen(false);
      loadFunds();
    } catch (err) {
      handleApiError(err, t('errors.operationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un fond
  const handleDelete = async (id) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      setIsLoading(true);
      await api.delete(`/api/funds/${id}`);
      success(t('funds.deleteSuccess'), t('common.success'));
      loadFunds();
    } catch (err) {
      handleApiError(err, t('errors.deleteFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Basculer le verrouillage
  const toggleLock = async (fund) => {
    try {
      setIsLoading(true);
      await api.put(`/api/funds/${fund.id}`, { is_locked: !fund.is_locked });
      success(
        fund.is_locked ? t('funds.unlockedSuccess') : t('funds.lockedSuccess'),
        t('common.success')
      );
      loadFunds();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Préparer les données pour l'export
  const prepareExportData = () => {
    return funds.map(fund => ({
      [t('funds.name')]: fund.name,
      [t('funds.currentAmount')]: parseFloat(fund.current_amount).toFixed(2),
      [t('funds.targetAmount')]: fund.target_amount ? parseFloat(fund.target_amount).toFixed(2) : '-',
      [t('funds.status')]: fund.is_locked ? t('funds.locked') : t('funds.active')
    }));
  };

  // Colonnes pour l'export PDF
  const exportColumns = [
    { header: t('funds.name'), accessor: 'name' },
    { 
      header: t('funds.currentAmount'), 
      accessor: (fund) => parseFloat(fund.current_amount).toFixed(2) 
    },
    { 
      header: t('funds.targetAmount'), 
      accessor: (fund) => fund.target_amount ? parseFloat(fund.target_amount).toFixed(2) : '-' 
    },
    { 
      header: t('funds.status'), 
      accessor: (fund) => fund.is_locked ? t('funds.locked') : t('funds.active') 
    }
  ];

  // Couleurs disponibles
  const availableColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];

  // Calculer le total des fonds
  const totalFunds = funds.reduce((sum, fund) => sum + parseFloat(fund.current_amount || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {t('funds.title')}
          </h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <ExportButton
            data={prepareExportData()}
            columns={exportColumns}
            title={t('funds.exportTitle')}
            filename="fonds_reserves"
            buttonText={t('common.export')}
            className="mr-2"
          />
          
          <button
            onClick={() => {
              setEditingFund(null);
              setFormData({
                name: '',
                target_amount: '',
                current_amount: '0',
                color: '#3b82f6',
                is_locked: false
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t('funds.addFund')}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">
          {t('funds.totalFunds')}
        </h3>
        <div className="text-3xl font-bold text-blue-600">
          {totalFunds.toFixed(2)} €
        </div>
      </div>

      {/* Liste des fonds */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-8 text-center">
            {t('common.loading')}...
          </div>
        ) : funds.length === 0 ? (
          <div className="text-center p-8">
            <PiggyBank className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">
              {t('funds.noFundsTitle')}
            </h3>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                {t('funds.addFund')}
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {funds.map((fund) => (
              <li key={fund.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: fund.color }}
                    >
                      <PiggyBank className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">
                        {fund.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {parseFloat(fund.current_amount).toFixed(2)} €
                        {fund.target_amount && ` / ${parseFloat(fund.target_amount).toFixed(2)} €`}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleLock(fund)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title={fund.is_locked ? t('funds.unlock') : t('funds.lock')}
                    >
                      {fund.is_locked ? (
                        <Lock className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Unlock className="h-5 w-5 text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingFund(fund);
                        setFormData({
                          name: fund.name,
                          target_amount: fund.target_amount || '',
                          current_amount: fund.current_amount,
                          color: fund.color,
                          is_locked: fund.is_locked
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title={t('common.edit')}
                    >
                      <Pencil className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(fund.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingFund ? t('funds.editFund') : t('funds.addFund')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('funds.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('funds.currentAmount')} *
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-2">€</span>
                  <input
                    type="number"
                    name="current_amount"
                    min="0"
                    step="0.01"
                    required
                    value={formData.current_amount}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-6 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('funds.targetAmount')}
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-2">€</span>
                  <input
                    type="number"
                    name="target_amount"
                    min="0"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-6 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('funds.color')}
                </label>
                <div className="flex space-x-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded-full border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: formData.color === color ? '#000' : 'transparent'
                      }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_locked"
                  name="is_locked"
                  checked={formData.is_locked}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="is_locked" className="ml-2 text-sm">
                  {t('funds.lockFund')}
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsManagement;
