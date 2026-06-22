import React from 'react';
import { schoolData } from '../data';
import Pagination from './Pagination';
import { ChevronDown } from 'lucide-react';

export default function MainContent({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-auto`}>
      <div className="bg-white rounded-sm shadow-sm p-4 min-h-full">
        {/* Title */}
        <div className="flex items-center mb-6">
          <div className="w-1 h-4 bg-[#3498eb] mr-3 rounded-sm"></div>
          <h2 className="text-[15px] font-bold text-gray-800">学校管理</h2>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-end mb-4 gap-3 text-sm">
          <span className="text-gray-500 mr-1">搜索：</span>
          <Select placeholder="请选择省份" />
          <Select placeholder="请选择城市" />
          <Select placeholder="全部类型" />
          <input 
            type="text" 
            placeholder="请输入学校名称" 
            className="border border-gray-200 rounded px-3 py-1.5 w-48 text-gray-600 focus:outline-none focus:border-blue-400 placeholder-gray-300"
          />
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-1.5 rounded text-sm transition-colors ml-1">
            查询
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto border border-gray-100 rounded-sm">
          <table className="w-full text-left border-collapse text-[13px] text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3 px-4 w-12 text-center">
                  <input type="checkbox" className="w-3.5 h-3.5 border-gray-300 rounded text-blue-500 focus:ring-blue-500 cursor-pointer" />
                </th>
                <th className="py-3 px-4 font-medium">ID</th>
                <th className="py-3 px-4 font-medium min-w-[200px]">学校名称</th>
                <th className="py-3 px-4 font-medium">学校类型</th>
                <th className="py-3 px-4 font-medium">学校区域(省/市)</th>
                <th className="py-3 px-4 font-medium text-center w-24">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schoolData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" className="w-3.5 h-3.5 border-gray-300 rounded cursor-pointer text-blue-500" />
                  </td>
                  <td className="py-3 px-4 whitespace-pre-wrap leading-tight text-gray-500">
                    {row.id}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.type}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.region}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {/* Empty operations col as per image */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
}

function Select({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <select defaultValue="" className="appearance-none border border-gray-200 text-gray-400 bg-white py-1.5 pl-3 pr-8 rounded text-sm focus:outline-none focus:border-blue-400 w-32 cursor-pointer">
        <option value="" disabled hidden>{placeholder}</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
