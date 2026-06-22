import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';

const initialMockData = [
  {
    id: '1',
    name: '普通用户组',
    code: 'user_group',
    description: '包含各个应用的基础权限',
    roles: [
      { appId: '2', appName: '考试题库系统', role: '学生' },
      { appId: '5', appName: 'AIOT应用', role: '学生' }
    ]
  },
  {
    id: '2',
    name: '管理员组',
    code: 'admin_group',
    description: '包含平台和所有应用的最高权限',
    roles: [
      { appId: '1', appName: '运营决策大屏', role: '超级管理员' },
      { appId: '2', appName: '考试题库系统', role: '学校管理员' }
    ]
  }
];

const platformRoles = [
  { id: '1', name: '运营决策大屏', roles: ['超级管理员', '系统管理员'] },
  { id: '2', name: '考试题库系统', roles: ['超级管理员', '学校管理员', '老师', '学生'] },
  { id: '3', name: 'AI学伴', roles: ['管理员', '教师', '学生'] },
  { id: '4', name: '二维码平台', roles: ['条例创建者', '案例开发者'] },
  { id: '5', name: 'AIOT应用', roles: ['管理员', '老师', '学生'] },
];

interface SelectedRole {
  appId: string;
  appName: string;
  role: string;
}

export default function RoleGroupManagementContent({ className }: { className?: string }) {
  const [data, setData] = useState(initialMockData);
  const [searchName, setSearchName] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    roles: [] as SelectedRole[]
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeAppId, setActiveAppId] = useState<string>('1');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    // In a real app, this would hit an API
  };

  const handleReset = () => {
    setSearchName('');
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', description: '', roles: [] });
    setActiveAppId('1');
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingId(record.id);
    setFormData({ 
      name: record.name, 
      code: record.code, 
      description: record.description || '',
      roles: [...record.roles] 
    });
    setActiveAppId('1');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该角色组吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleSaveModal = () => {
    if (!formData.name || !formData.code) {
      alert('请填写名称和编码');
      return;
    }
    
    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...item, ...formData } : item));
    } else {
      const newId = String(Date.now());
      setData([...data, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  const toggleRole = (appId: string, appName: string, roleName: string) => {
    setFormData(prev => {
      const exists = prev.roles.some(r => r.appId === appId && r.role === roleName);
      if (exists) {
        return {
          ...prev,
          roles: prev.roles.filter(r => !(r.appId === appId && r.role === roleName))
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, { appId, appName, role: roleName }]
        };
      }
    });
  };

  const removeRole = (appId: string, roleName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(r => !(r.appId === appId && r.role === roleName))
    }));
  };

  const toggleAppRoles = (appId: string, appName: string, allRoles: string[], e: React.MouseEvent) => {
    e.stopPropagation();
    const currentAppRoles = formData.roles.filter(r => r.appId === appId);
    
    setFormData(prev => {
      let newRoles = [...prev.roles.filter(r => r.appId !== appId)];
      
      if (currentAppRoles.length !== allRoles.length) {
        // select all
        allRoles.forEach(r => newRoles.push({ appId, appName, role: r }));
      }
      return { ...prev, roles: newRoles };
    });
  };

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-hidden flex flex-col`}>
      <div className="bg-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <span className="text-gray-400 text-[13px]">认证管理</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700 text-[13px] font-medium">角色组管理</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500 text-right">角色组名称:</span>
              <input
                type="text"
                placeholder="请输入名称"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#3498eb]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button 
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-4 py-1.5 ml-2 bg-[#3498eb] text-white rounded text-[13px] transition-colors hover:bg-blue-600"
              >
                <Search className="w-3.5 h-3.5" />
                查询
              </button>
              <button 
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-[13px] transition-colors hover:bg-gray-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重置
              </button>
            </div>
            
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3498eb] text-white rounded text-[13px] transition-colors hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              新增角色组
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500">
                <th className="py-3 px-4 font-medium border-b border-gray-100 w-16">序号</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 w-48">角色组名称</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 w-32">编码</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">关联角色</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 w-48">备注说明</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 text-center w-36">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.filter(row => !searchName || row.name.includes(searchName)).map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{row.name}</td>
                  <td className="py-3 px-4 text-gray-500">{row.code}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {row.roles.map((r, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200">
                          {r.appName} / {r.role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 truncate max-w-[12rem]" title={row.description}>{row.description || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-row items-center justify-center gap-3">
                      <button 
                        onClick={() => openEditModal(row)}
                        title="编辑" 
                        className="text-[#3498eb] hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> <span className="text-xs">编辑</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        title="删除" 
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> <span className="text-xs">删除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[600px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editingId ? '编辑角色组' : '新增角色组'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-visible">
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>名称 :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入角色组名称"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>编码 :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入编码"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <label className="w-24 text-right text-sm text-gray-600 mt-2">备注说明 :</label>
                <textarea 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入备注说明"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              {/* Complex Role Selector Base on Image */}
              <div className="flex items-start gap-3 relative" ref={dropdownRef}>
                <label className="w-24 text-right text-sm text-gray-600 mt-2"><span className="text-red-500 mr-1">*</span>角色 :</label>
                <div 
                  className="flex-1 min-h-[40px] px-2 py-1.5 border border-[#3498eb] rounded flex items-center flex-wrap gap-1.5 cursor-pointer bg-white"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {formData.roles.length === 0 ? (
                    <span className="text-gray-400 text-sm ml-1 select-none">请选择角色</span>
                  ) : (
                    formData.roles.map((r, i) => (
                      <div key={i} className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs gap-1 border border-gray-200">
                        <span>{r.appName} / {r.role}</span>
                        <X 
                          className="w-3 h-3 hover:text-red-500 cursor-pointer text-gray-400 bg-gray-200 rounded-full p-[1px]" 
                          onClick={(e) => removeRole(r.appId, r.role, e)}
                        />
                      </div>
                    ))
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Panel */}
                {isDropdownOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-[108px] right-0 bg-white border border-gray-200 shadow-xl rounded-md z-10 flex h-64 overflow-hidden">
                    {/* Left Panel: Applications */}
                    <div className="w-[180px] border-r border-gray-100 overflow-y-auto bg-white py-2">
                      {platformRoles.map(app => {
                        const selectedInApp = formData.roles.filter(r => r.appId === app.id).length;
                        const isAllSelected = selectedInApp === app.roles.length;
                        const isIndeterminate = selectedInApp > 0 && !isAllSelected;
                        
                        return (
                          <div 
                            key={app.id} 
                            onClick={() => setActiveAppId(app.id)}
                            className={`flex items-center px-4 py-2 cursor-pointer text-[13px] ${activeAppId === app.id ? 'bg-blue-50 text-[#3498eb] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {/* Custom Checkbox logic for left list */}
                            <div 
                              className={`w-3.5 h-3.5 mr-2 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0
                                ${isAllSelected ? 'bg-[#3498eb] border-[#3498eb]' : isIndeterminate ? 'bg-[#3498eb] border-[#3498eb]' : 'bg-white border-gray-300'}`}
                              onClick={(e) => toggleAppRoles(app.id, app.name, app.roles, e)}
                            >
                              {isAllSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                              {isIndeterminate && <div className="w-2 h-0.5 bg-white"></div>}
                            </div>
                            <span className="truncate flex-1">{app.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 opacity-50" />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Right Panel: Roles */}
                    <div className="flex-1 overflow-y-auto py-2 bg-white">
                      {platformRoles.find(a => a.id === activeAppId)?.roles.map(role => {
                        const isSelected = formData.roles.some(r => r.appId === activeAppId && r.role === role);
                        
                        return (
                          <div 
                            key={role}
                            onClick={() => toggleRole(activeAppId, platformRoles.find(a => a.id === activeAppId)!.name, role)}
                            className={`flex items-center px-4 py-2 cursor-pointer text-[13px] hover:bg-gray-50 ${isSelected ? 'text-[#3498eb]' : 'text-gray-700'}`}
                          >
                            <div className={`w-3.5 h-3.5 mr-3 rounded border flex items-center justify-center transition-colors
                                ${isSelected ? 'bg-[#3498eb] border-[#3498eb]' : 'bg-white border-gray-300'}`}
                            >
                              {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                            {role}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSaveModal}
                className="px-5 py-2 bg-[#3498eb] text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
