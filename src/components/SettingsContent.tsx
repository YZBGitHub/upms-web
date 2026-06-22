import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, List as ListIcon } from 'lucide-react';

export default function SettingsContent({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'sms' | 'other'>('other');
  
  // States for Other Settings
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [requireSuperAdminSms, setRequireSuperAdminSms] = useState(false);

  // States for SMS Settings
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-auto`}>
      <div className="bg-white rounded-sm shadow-sm p-6 min-h-full">
        {/* Title */}
        <div className="flex items-center mb-6">
          <div className="w-1 h-4 bg-[#3498eb] mr-3 rounded-sm"></div>
          <h2 className="text-[15px] font-bold text-gray-800">基础设置</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'sms'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            短信设置
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'other'
                ? 'border-[#3498eb] text-[#3498eb]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            其他设置
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'other' && (
            <div className="space-y-8 py-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[14px] text-gray-700 font-medium">学校管理员、教师、学生 账号首次登录是否需要重置密码</span>
                <Toggle checked={requirePasswordReset} onChange={setRequirePasswordReset} />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[14px] text-gray-700 font-medium">超管账号登录是否需要短 信验证码</span>
                <Toggle checked={requireSuperAdminSms} onChange={setRequireSuperAdminSms} />
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[14px] text-gray-700 font-medium">开启短信服务</span>
                <Toggle checked={smsEnabled} onChange={setSmsEnabled} />
              </div>

              {smsEnabled && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] text-gray-600 font-medium">短信密钥设置 (API Key)</label>
                    <input 
                      type="password" 
                      placeholder="请输入短信服务平台提供的密钥"
                      className="border border-gray-200 rounded px-3 py-2 w-full max-w-md text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] text-gray-600 font-medium">接口设置 (API URL)</label>
                    <input 
                      type="text" 
                      placeholder="请输入短信服务接口地址 (例: https://api.sms.com/send)"
                      className="border border-gray-200 rounded px-3 py-2 w-full max-w-md text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="bg-[#3498eb] hover:bg-blue-600 text-white px-8 py-2 rounded text-sm font-medium transition-colors">
                      保存配置
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple toggle switch component
function Toggle({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-[22px] w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#3498eb]' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
