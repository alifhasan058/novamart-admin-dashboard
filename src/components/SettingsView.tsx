import { FormEvent, useState } from 'react';
import { StoreSettings } from '../types/dashboard';

interface SettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (next: StoreSettings) => void;
}

export function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  const [form, setForm] = useState<StoreSettings>(settings);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Store Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure NovaMart storefront defaults, tax rules, and inventory
          alerts
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="store-name"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Store Name
            </label>
            <input
              id="store-name"
              type="text"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div>
            <label
              htmlFor="support-email"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Support Email
            </label>
            <input
              id="support-email"
              type="email"
              value={form.supportEmail}
              onChange={(e) =>
                setForm({ ...form, supportEmail: e.target.value })
              }
              className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div>
            <label
              htmlFor="store-currency"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Settlement Currency
            </label>
            <select
              id="store-currency"
              value={form.currency}
              onChange={(e) =>
                setForm({
                  ...form,
                  currency: e.target.value as StoreSettings['currency'],
                })
              }
              className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            >
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="low-stock-threshold"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Low Stock Alert Threshold (units)
            </label>
            <input
              id="low-stock-threshold"
              type="number"
              min="1"
              max="50"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({
                  ...form,
                  lowStockThreshold: Math.max(1, Number(e.target.value)),
                })
              }
              className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>
        </div>

        <div className="pt-5 border-t border-slate-100 space-y-3.5">
          <h3 className="text-sm font-semibold text-slate-900">
            Notification Preferences
          </h3>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Real-time Order Alerts
              </p>
              <p className="text-xs text-slate-500">
                Notify administrators when high-value orders arrive
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.orderAlerts}
              onChange={(e) =>
                setForm({ ...form, orderAlerts: e.target.checked })
              }
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Low Inventory Warnings
              </p>
              <p className="text-xs text-slate-500">
                Flag SKUs when stock drops below your configured threshold
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.lowStockAlerts}
              onChange={(e) =>
                setForm({ ...form, lowStockAlerts: e.target.checked })
              }
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Weekly Revenue Digest
              </p>
              <p className="text-xs text-slate-500">
                Send Monday morning executive summary to team leads
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.weeklyDigest}
              onChange={(e) =>
                setForm({ ...form, weeklyDigest: e.target.checked })
              }
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="h-9 px-5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
