import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { MonthlyReport } from '../types';
import { reportService } from '../services/report.service';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORY_LABELS } from '../utils/constants';

const Reports: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportStart, setExportStart] = useState('');
  const [exportEnd, setExportEnd] = useState('');
  const { showToast } = useToast();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.monthly(year, month);
      setReport(data);
    } catch {
      showToast('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!exportStart || !exportEnd) {
      showToast('Please select start and end dates', 'error');
      return;
    }
    setExportLoading(true);
    try {
      const blob = await reportService.exportCsv(exportStart, exportEnd);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easychurch-report-${exportStart}-${exportEnd}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Report exported successfully', 'success');
    } catch {
      showToast('Failed to export report', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Financial reports and exports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Report">
          <div className="space-y-4">
            <div className="flex gap-3">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={2020}
                max={2030}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={fetchReport} loading={loading}>Generate</Button>
            </div>

            {loading && <Loading size="sm" />}

            {report && !loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Income</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(report.totalIncome)}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Expenses</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(report.totalExpenses)}</p>
                  </div>
                  <div className={`${report.netBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'} p-3 rounded-lg text-center`}>
                    <p className="text-xs text-gray-500">Net</p>
                    <p className={`text-lg font-bold ${report.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {formatCurrency(report.netBalance)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Income Breakdown</h4>
                  <div className="space-y-1">
                    {report.incomes.slice(0, 5).map((income) => (
                      <div key={income.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{CATEGORY_LABELS[income.category]} - {formatDate(income.date)}</span>
                        <span className="text-green-600 font-medium">{formatCurrency(income.amount)}</span>
                      </div>
                    ))}
                    {report.incomes.length > 5 && <p className="text-xs text-gray-400">+{report.incomes.length - 5} more</p>}
                    {report.incomes.length === 0 && <p className="text-xs text-gray-400">No income this month</p>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Expense Breakdown</h4>
                  <div className="space-y-1">
                    {report.expenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{CATEGORY_LABELS[expense.category]} - {formatDate(expense.date)}</span>
                        <span className="text-red-600 font-medium">{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                    {report.expenses.length > 5 && <p className="text-xs text-gray-400">+{report.expenses.length - 5} more</p>}
                    {report.expenses.length === 0 && <p className="text-xs text-gray-400">No expenses this month</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Export to CSV">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Export all income and expense records for a date range to CSV.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={exportStart}
                  onChange={(e) => setExportStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={exportEnd}
                  onChange={(e) => setExportEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button onClick={handleExport} loading={exportLoading} className="w-full">
                Export CSV
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
