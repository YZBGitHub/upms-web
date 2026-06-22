import React, { useState } from 'react';
import { tenantData } from '../data';
import Pagination from './Pagination';
import { ChevronDown, Edit, Trash2, List, Users, MonitorSmartphone, X, Upload } from 'lucide-react';

export default function TenantManagement({ className }: { className?: string }) {
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const openPortalConfig = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsPortalModalOpen(true);
  };

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-auto relative`}>
      <div className="bg-white rounded-sm shadow-sm p-4 min-h-full">
        {/* Title */}
        <div className="flex items-center mb-6">
          <div className="w-1 h-4 bg-[#3498eb] mr-3 rounded-sm"></div>
          <h2 className="text-[15px] font-bold text-gray-800">租户管理</h2>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-4">
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition-colors">
            添加租户
          </button>

          <div className="flex items-center gap-2 text-sm">
            <Select placeholder="请选择租户类型" />
            <Select placeholder="请选择所在城市" />
            <input 
              type="text" 
              placeholder="请输入租户名称" 
              className="border border-gray-200 rounded px-3 py-1.5 w-48 text-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-300"
            />
            <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-1.5 rounded text-sm transition-colors ml-1">
              查询
            </button>
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-5 py-1.5 rounded text-sm transition-colors">
              重置
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto border border-gray-100 rounded-sm">
          <table className="w-full text-left border-collapse text-[13px] text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3 px-6 font-medium">ID</th>
                <th className="py-3 px-6 font-medium">租户名称</th>
                <th className="py-3 px-6 font-medium text-center">租户类型</th>
                <th className="py-3 px-6 font-medium text-center">更新时间</th>
                <th className="py-3 px-6 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenantData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 text-gray-500">{row.id}</td>
                  <td className="py-3 px-6 text-gray-700">{row.name}</td>
                  <td className="py-3 px-6 text-center text-gray-600">{row.type}</td>
                  <td className="py-3 px-6 text-center text-gray-500">{row.updateTime}</td>
                  <td className="py-3 px-6 text-center text-[#3498eb]">
                    <div className="flex items-center justify-center gap-4">
                      <button className="flex items-center gap-1 hover:text-blue-700 transition-colors">
                        <List className="w-3.5 h-3.5" /> 组织管理
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-700 transition-colors">
                        <Users className="w-3.5 h-3.5" /> 成员管理
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-700 transition-colors">
                        <Edit className="w-3.5 h-3.5" /> 编辑
                      </button>
                      <button className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> 删除
                      </button>
                      {/* Added Portal Config */}
                      <button 
                        onClick={() => openPortalConfig(row)}
                        className="flex items-center gap-1 text-green-500 hover:text-green-700 transition-colors"
                      >
                        <MonitorSmartphone className="w-3.5 h-3.5" /> 门户配置
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination />
      </div>

      {/* Portal Config Modal */}
      {isPortalModalOpen && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[600px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">门户配置 - {selectedTenant.name}</h3>
              <button 
                onClick={() => setIsPortalModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">独立首页地址</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://${selectedTenant.id}.edu-cloud.com`}
                      className="bg-gray-50 border border-gray-200 rounded px-3 py-2 w-full text-sm text-gray-500 focus:outline-none"
                    />
                    <button className="text-[#3498eb] text-sm whitespace-nowrap hover:underline font-medium">
                      复制链接
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">此地址可用于学员直接访问该租户门户</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">门户标题</label>
                  <input 
                    type="text" 
                    defaultValue={`${selectedTenant.name}门户`}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                    placeholder="请输入门户显示的顶部标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">网站图标 (Favicon)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="mb-1">支持 PNG, JPG, ICO 格式</p>
                      <p>建议尺寸 32x32，大小不超过 100KB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo 图标</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-16 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 mb-1" />
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="mb-1">支持 PNG, JPG</p>
                      <p>建议尺寸 120x40，大小不超过 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setIsPortalModalOpen(false)}
                className="px-4 py-2 border border-gray-300 bg-white rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => setIsPortalModalOpen(false)}
                className="px-4 py-2 bg-[#3498eb] hover:bg-blue-600 rounded text-sm text-white transition-colors"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Select({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <select defaultValue="" className="appearance-none border border-gray-200 text-gray-400 bg-white py-1.5 pl-3 pr-8 rounded text-sm focus:outline-none focus:border-blue-400 w-36 cursor-pointer">
        <option value="" disabled hidden>{placeholder}</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
