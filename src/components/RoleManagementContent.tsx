import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, ChevronRight, ChevronDown, ShieldCheck, UserCheck } from 'lucide-react';

const initialMockData = [
  { id: '1', name: '运营决策者', code: 'decision-maker', appCode: 'dashboard-ops' },
  { id: '2', name: 'UUSIMA-教研', code: 'course-TR', appCode: 'aiot-app' },
  { id: '3', name: '考试竞赛管理员', code: 'exam-admin', appCode: 'aiot-app' },
  { id: '4', name: 'AI学伴-教师', code: 'aixb-teacher', appCode: 'aixb' },
  { id: '5', name: 'AI学伴-学生', code: 'aixb-student', appCode: 'aixb' },
  { id: '6', name: '安全管理员', code: 'safety-admin', appCode: 'aiot-app' },
  { id: '7', name: '审计管理员', code: 'audit-admin', appCode: 'aiot-app' },
  { id: '8', name: '学员', code: 'exam-student', appCode: 'exam-app' },
  { id: '9', name: '超级管理员', code: 'exam-sa', appCode: 'exam-app' },
  { id: '10', name: '监考老师', code: 'exam-invigilator', appCode: 'exam-app' },
];

const platformRoles = [
  { id: '1', name: '运营决策大屏', roles: ['超级管理员', '系统管理员'] },
  { id: '2', name: '考试题库系统', roles: ['超级管理员', '学校管理员', '老师', '学生', '阅卷老师', '考试竞赛管理员'] },
  { id: '3', name: 'AI学伴', roles: ['管理员', '教师', '学生'] },
  { id: '4', name: '二维码平台', roles: ['条例创建者', '案例开发者'] },
  { id: '5', name: 'AIOT应用', roles: ['管理员', '老师', '学生'] },
];

const mockRoleGroups = [
  { id: 'g1', name: '普通用户组', description: '包含各个应用的基础权限' },
  { id: 'g2', name: '教师协作组', description: '包含备课、授课、批改作业等权限' },
  { id: 'g3', name: '超级管理员组', description: '包含平台和所有应用的最高权限' },
];

export default function RoleManagementContent({ className }: { className?: string }) {
  const [data, setData] = useState(initialMockData);
  const [searchName, setSearchName] = useState('');
  
  // Basic Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', appCode: '' });

  // Assignable Roles Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<any>(null);
  const [selectedRoles, setSelectedRoles] = useState<{appId: string, appName: string, role: string}[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<{groupId: string, groupName: string}[]>([]);
  
  // Dropdown for Multi-select Assignable Roles
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [activeRoleAppId, setActiveRoleAppId] = useState<string>('group');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', appCode: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingId(record.id);
    setFormData({ name: record.name, code: record.code, appCode: record.appCode });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该角色吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleSaveModal = () => {
    if (!formData.name || !formData.code || !formData.appCode) {
      alert('请填写完整信息');
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

  // Open multi-assign modal
  const openAssignModal = (record: any) => {
    setAssigningUser(record);
    setSelectedRoles([]);
    setSelectedGroups([]);
    setIsAssignModalOpen(true);
  };

  const toggleGroup = (groupId: string, groupName: string) => {
    if (selectedGroups.some(g => g.groupId === groupId)) {
      setSelectedGroups(selectedGroups.filter(g => g.groupId !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, { groupId, groupName }]);
    }
  };

  const toggleAssignRole = (appId: string, appName: string, role: string) => {
    const exists = selectedRoles.some(r => r.appId === appId && r.role === role);
    if (exists) {
      setSelectedRoles(selectedRoles.filter(r => !(r.appId === appId && r.role === role)));
    } else {
      setSelectedRoles([...selectedRoles, { appId, appName, role }]);
    }
  };

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-hidden flex flex-col`}>
      <div className="bg-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
        {/* Header Breadcrumb equivalent */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#3498eb] rounded-full"></div>
            <span className="text-gray-800 text-[14px] font-bold">角色管理</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#3498eb] text-white rounded text-[#13px] transition-colors hover:bg-blue-600 text-[13px]"
            >
              添加角色
            </button>
            
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 left-0 bg-white rounded px-3 py-1.5 text-[13px] text-gray-500 w-36 focus:outline-none focus:border-[#3498eb]">
                <option value="">- 全部应用 -</option>
                <option value="dashboard-ops">dashboard-ops</option>
                <option value="aiot-app">aiot-app</option>
                <option value="aixb">aixb</option>
                <option value="exam-app">exam-app</option>
              </select>
              <input
                type="text"
                placeholder="请输入角色名称进行查询"
                className="border border-gray-300 rounded px-3 py-1.5 text-[13px] w-56 focus:outline-none focus:border-[#3498eb]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button 
                className="flex items-center gap-1.5 px-6 py-1.5 bg-[#3498eb] text-white rounded text-[13px] transition-colors hover:bg-blue-600 ml-1"
              >
                查询
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500">
                <th className="py-4 px-6 font-medium border-b border-gray-100 w-24">序号</th>
                <th className="py-4 px-6 font-medium border-b border-gray-100">角色名称</th>
                <th className="py-4 px-6 font-medium border-b border-gray-100">角色编码</th>
                <th className="py-4 px-6 font-medium border-b border-gray-100">所属应用编码</th>
                <th className="py-4 px-6 font-medium border-b border-gray-100 w-80 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.filter(row => !searchName || row.name.includes(searchName)).map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{index + 1}</td>
                  <td className="py-4 px-6 text-gray-700">{row.name}</td>
                  <td className="py-4 px-6 text-gray-500">{row.code}</td>
                  <td className="py-4 px-6 text-gray-500">{row.appCode}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-row items-center justify-center gap-5">
                      <button 
                        className="text-[#3498eb] hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="w-4 h-4" /> <span className="text-[13px]">授权</span>
                      </button>
                      <button 
                        onClick={() => openAssignModal(row)}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
                      >
                        <UserCheck className="w-4 h-4" /> <span className="text-[13px]">可分配角色配置</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(row)}
                        className="text-[#3498eb] hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> <span className="text-[13px]">编辑</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> <span className="text-[13px]">删除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 text-[13px]">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[500px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editingId ? '编辑角色' : '添加角色'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-[13px] text-gray-600"><span className="text-red-500 mr-1">*</span>角色名称 :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入角色名称"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-[13px] text-gray-600"><span className="text-red-500 mr-1">*</span>角色编码 :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入角色编码"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-[13px] text-gray-600"><span className="text-red-500 mr-1">*</span>所属应用 :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入应用编码"
                  value={formData.appCode}
                  onChange={(e) => setFormData({...formData, appCode: e.target.value})}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-1.5 text-gray-600 bg-white border border-gray-300 rounded text-[13px] hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button onClick={handleSaveModal} className="px-5 py-1.5 bg-[#3498eb] text-white rounded text-[13px] hover:bg-blue-600 transition-colors">
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignable Roles Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[700px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">可分配角色配置 - {assigningUser?.name}</h3>
              <button 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setIsRoleDropdownOpen(false);
                }} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-[13px] text-gray-500 mb-4">通过此项配置，控制该角色可以分配或管理哪些下级角色组或单个角色。</div>
              <div className="flex items-start gap-4 h-[300px]" ref={dropdownRef}>
                <label className="text-gray-700 font-medium whitespace-nowrap mt-2 text-[13px]">
                  可分配角色:
                </label>
                <div className="relative flex-1">
                  <div 
                    className="min-h-[40px] px-2 py-1.5 border border-gray-300 rounded-lg flex flex-wrap gap-2 items-center cursor-pointer transition-colors focus-within:border-[#3498eb] focus-within:ring-1 focus-within:ring-[#3498eb]"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  >
                    {selectedGroups.length === 0 && selectedRoles.length === 0 && (
                      <span className="text-gray-400 text-[13px] pl-2">请选择可分配的角色组或单个角色</span>
                    )}

                    {selectedGroups.map(group => (
                      <span key={group.groupId} className="bg-indigo-50 text-indigo-700 px-2 py-1 flex items-center gap-1 rounded text-[13px] border border-indigo-100">
                        【角色组】 {group.groupName}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-indigo-900" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroup(group.groupId, group.groupName);
                          }}
                        />
                      </span>
                    ))}
                    
                    {selectedRoles.map((role, idx) => (
                      <span key={`${role.appId}-${role.role}-${idx}`} className="bg-gray-50 text-gray-700 px-2 py-1 flex items-center gap-1 rounded text-[13px] border border-gray-200">
                        {role.appName} / {role.role}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-gray-900" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAssignRole(role.appId, role.appName, role.role);
                          }}
                        />
                      </span>
                    ))}

                    <div className="ml-auto pr-1 text-gray-400">
                      {isRoleDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {isRoleDropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 flex h-[240px] overflow-hidden">
                      {/* Left Sidebar */}
                      <div className="w-[180px] bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
                        <div 
                          onClick={() => setActiveRoleAppId('group')}
                          className={`px-4 py-3 text-[13px] cursor-pointer flex items-center transition-colors ${activeRoleAppId === 'group' ? 'bg-indigo-50 text-indigo-600 font-medium border-l-[3px] border-indigo-600' : 'text-gray-600 hover:bg-gray-100 border-l-[3px] border-transparent'}`}
                        >
                          角色组
                          {activeRoleAppId === 'group' && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </div>
                        {platformRoles.map(app => (
                          <div 
                            key={app.id}
                            onClick={() => setActiveRoleAppId(app.id)}
                            className={`px-4 py-3 text-[13px] cursor-pointer flex items-center transition-colors ${activeRoleAppId === app.id ? 'bg-blue-50 text-[#3498eb] font-medium border-l-[3px] border-[#3498eb]' : 'text-gray-600 hover:bg-gray-100 border-l-[3px] border-transparent'}`}
                          >
                            {app.name}
                            {activeRoleAppId === app.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                          </div>
                        ))}
                      </div>
                      
                      {/* Right Panel */}
                      <div className="flex-1 overflow-y-auto p-4 bg-white">
                        {activeRoleAppId === 'group' ? (
                          <div className="flex flex-col gap-2">
                            {mockRoleGroups.map(group => {
                              const isSelected = selectedGroups.some(g => g.groupId === group.id);
                              return (
                                <label key={group.id} className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                                  <input 
                                    type="checkbox" 
                                    className="mt-1 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleGroup(group.id, group.name)}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-800 font-medium">{group.name}</span>
                                    <span className="text-[12px] text-gray-500 mt-0.5">{group.description}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {platformRoles.find(a => a.id === activeRoleAppId)?.roles.map(role => {
                              const appName = platformRoles.find(a => a.id === activeRoleAppId)?.name || '';
                              const isSelected = selectedRoles.some(r => r.appId === activeRoleAppId && r.role === role);
                              return (
                                <label key={role} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                                  <input 
                                    type="checkbox" 
                                    className="border-gray-300 rounded text-[#3498eb] focus:ring-[#3498eb] cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleAssignRole(activeRoleAppId, appName, role)}
                                  />
                                  <span className="text-[13px] text-gray-700">{role}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setIsRoleDropdownOpen(false);
                }} 
                className="px-6 py-1.5 border border-gray-300 text-gray-700 rounded text-[13px] hover:bg-gray-100 transition-colors bg-white"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setIsRoleDropdownOpen(false);
                }} 
                className="px-6 py-1.5 bg-[#3498eb] text-white rounded text-[13px] hover:bg-blue-600 transition-colors"
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
