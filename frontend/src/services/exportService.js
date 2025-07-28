import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import api from './api';

// Exporter au format CSV
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) return;
  
  // Créer les en-têtes
  const headers = Object.keys(data[0]);
  let csv = headers.join(';') + '\n';
  
  // Ajouter les données
  csv += data.map(row => 
    headers.map(fieldName => 
      JSON.stringify(row[fieldName], (key, value) => 
        value === null ? '' : value
      )
    ).join(';')
  ).join('\n');
  
  // Créer et déclencher le téléchargement
  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  
  // Nettoyer
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Exporter au format PDF
export const exportToPDF = (title, data, columns, filename = 'export') => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Date d'export
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(
    `Exporté le: ${new Date().toLocaleDateString('fr-FR')}`, 
    14, 
    32
  );
  
  // Tableau
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(row => 
      columns.map(col => 
        typeof col.accessor === 'function' 
          ? col.accessor(row) 
          : row[col.accessor]
      )
    ),
    startY: 40,
    styles: { 
      fontSize: 10,
      cellPadding: 3,
      overflow: 'linebreak',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      lineWidth: 0.1
    },
    alternateRowStyles: {
      fillColor: 245
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      // Ajuster la largeur des colonnes si nécessaire
    },
    margin: { top: 40 }
  });
  
  // Enregistrer le PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Exporter les transactions
export const exportTransactions = async (filters = {}) => {
  try {
    const response = await api.get('/api/transactions/export', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'export des transactions:', error);
    throw error;
  }
};

// Exporter le budget
export const exportBudget = async () => {
  try {
    const response = await api.get('/api/budget/export');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'export du budget:', error);
    throw error;
  }
};
