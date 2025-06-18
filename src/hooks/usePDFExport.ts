import { useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CycleData, User } from '../types';
import { dateUtils } from '../utils/dateUtils';

export const usePDFExport = () => {
  const exportToPDF = useCallback((cycleData: CycleData, user: User, currentDay: number) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Personal Food Tracking System', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99); // gray-600
    doc.text(`User: ${user.username}`, 20, 35);
    doc.text(`Email: ${user.email}`, 20, 42);
    doc.text(`Cycle: #${cycleData.cycleNumber}`, 20, 49);
    doc.text(`Start Date: ${dateUtils.formatDate(cycleData.startDate)}`, 20, 56);
    doc.text(`Current Day: ${currentDay}/30`, 20, 63);
    doc.text(`Generated: ${dateUtils.formatDate(dateUtils.getCurrentDate())}`, 20, 70);

    // Prepare table data
    const tableData = [];
    for (let day = 1; day <= 30; day++) {
      const entry = cycleData.trackingData[day];
      const status = day <= currentDay ? (day === currentDay ? 'Current' : 'Completed') : 'Upcoming';
      
      tableData.push([
        day.toString(),
        entry.morning || '-',
        entry.noon || '-',
        entry.evening || '-',
        entry.totalCalories || '-',
        status
      ]);
    }

    // Create table
    autoTable(doc, {
      head: [['Day', 'Morning', 'Noon', 'Evening', 'Total Cal', 'Status']],
      body: tableData,
      startY: 80,
      theme: 'striped',
      headStyles: {
        fillColor: [16, 185, 129], // emerald-500
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [55, 65, 81] // gray-700
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // gray-50
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' }, // Day
        1: { cellWidth: 35 }, // Morning
        2: { cellWidth: 35 }, // Noon
        3: { cellWidth: 35 }, // Evening
        4: { cellWidth: 25, halign: 'center' }, // Total Cal
        5: { cellWidth: 25, halign: 'center' } // Status
      },
      didParseCell: function(data) {
        // Highlight current day
        if (data.section === 'body' && data.row.index === currentDay - 1) {
          data.cell.styles.fillColor = [219, 234, 254]; // blue-100
          data.cell.styles.fontStyle = 'bold';
        }
        
        // Color code status
        if (data.section === 'body' && data.column.index === 5) {
          const status = data.cell.text[0];
          if (status === 'Current') {
            data.cell.styles.textColor = [59, 130, 246]; // blue-500
            data.cell.styles.fontStyle = 'bold';
          } else if (status === 'Completed') {
            data.cell.styles.textColor = [34, 197, 94]; // green-500
          } else {
            data.cell.styles.textColor = [156, 163, 175]; // gray-400
          }
        }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175); // gray-400
      doc.text(
        `Page ${i} of ${pageCount} - Personal Food Tracking System`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const fileName = `food-tracking-cycle-${cycleData.cycleNumber}-${user.username}-${dateUtils.getCurrentDate()}.pdf`;
    doc.save(fileName);
  }, []);

  return { exportToPDF };
};