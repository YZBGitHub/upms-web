import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination() {
  return (
    <div className="flex items-center justify-end px-2 py-4 text-xs mt-4">
      <span className="text-gray-500 mr-4">共 7108 条</span>
      
      <div className="relative mr-4">
        <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded focus:outline-none focus:border-blue-500 cursor-pointer">
          <option>20条/页</option>
          <option>50条/页</option>
          <option>100条/页</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 border-l border-gray-200">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-400 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3498eb] text-white font-medium">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">2</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">3</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">4</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">5</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">6</button>
        <span className="w-8 h-8 flex items-center justify-center text-gray-400 tracking-widest"><MoreHorizontal className="w-4 h-4" /></span>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">356</button>
        <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center ml-4 text-gray-500">
        前往 <input type="text" defaultValue="1" className="w-10 h-8 mx-2 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500" /> 页
      </div>
    </div>
  );
}
