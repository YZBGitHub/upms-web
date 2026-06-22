import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, RefreshCw, X, List as ListIcon } from 'lucide-react';

const initialDicts = [
  { 
    id: '1', 
    code: 'job_title', 
    name: '职务/职称', 
    items: ['教务处长', '管理员', '教授', '副教授', '讲师', '助教', '其他'] 
  },
  { 
    id: '2', 
    code: 'research_field', 
    name: '研究领域', 
    items: ['集成电路', '数据要素', '5G', '人工智能', '云计算', '大数据', '物联网', 'IDC', '消费电子', '智能手机', '数字经济', '国产软件', '网络安全', '新能源汽车', '低空经济', '自动驾驶', '锂离子电池', '机器人', '汽车', '汽车零部件', '汽车电子', '汽车轻量化', '机械设备', '特高压', '光伏', '风电', '碳中和', '公共事业', '金属新材料', '石油化工', '医药生物', '生物药品', '医疗器械', '半导体设备', '半导体材料', '化学药品', '体外诊断', '食品饮料', '显示屏', '中药', '大气治理', '房地产', '纺织', '航空航天装备', '基础设施', '家用电器', '环保', '污水处理', '资源循环利用', '其他'] 
  },
  { 
    id: '3', 
    code: 'education', 
    name: '学历', 
    items: ['中专/中技', '高中', '大专', '本科', '硕士', '博士'] 
  }
];

export default function BasicDataContent({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'school' | 'enterprise' | 'dict'>('school');
  const [searchName, setSearchName] = useState('');

  const [schoolData, setSchoolData] = useState([
    { id: '1', name: '清华大学', type: '本科', code: '10003', city: '北京' },
    { id: '2', name: '深圳职业技术学院', type: '高职', code: '12059', city: '深圳' },
    { id: '3', name: '广州市机电高级技工学校', type: '中职', code: '44010', city: '广州' },
  ]);

  const [enterpriseData, setEnterpriseData] = useState([
    { id: '1', name: '中国国家铁路集团', type: '国企', code: 'CR', industry: '交通运输' },
    { id: '2', name: '华为技术有限公司', type: '民企', code: 'HW', industry: '信息传输、软件和信息技术服务业' },
    { id: '3', name: '苹果公司', type: '外企', code: 'AAPL', industry: '制造业' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    industry: '',
    city: ''
  });

  const displayedSchoolData = schoolData.filter(item => item.name.includes(searchName));
  const displayedEnterpriseData = enterpriseData.filter(item => item.name.includes(searchName));

  // States for Dict Settings
  const [dicts, setDicts] = useState(initialDicts);
  const [isDictModalOpen, setIsDictModalOpen] = useState(false);
  const [editingDictId, setEditingDictId] = useState<string | null>(null);
  const [dictFormData, setDictFormData] = useState({ name: '', code: '' });

  // Dict Items Modal
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [currentDict, setCurrentDict] = useState<any>(null);
  const [newItemName, setNewItemName] = useState('');

  const displayedDictData = dicts.filter(item => item.name.includes(searchName));

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      code: '', 
      type: activeTab === 'school' ? '本科' : '国企', 
      industry: '', 
      city: '' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingId(record.id);
    setFormData({ 
      name: record.name || '', 
      code: record.code || '', 
      type: record.type || '',
      industry: record.industry || '',
      city: record.city || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该数据吗？')) {
      if (activeTab === 'school') {
        setSchoolData(schoolData.filter(item => item.id !== id));
      } else {
        setEnterpriseData(enterpriseData.filter(item => item.id !== id));
      }
    }
  };

  const handleSaveModal = () => {
    if (!formData.name || !formData.code) {
      alert('请填写名称和代码');
      return;
    }
    
    if (activeTab === 'school') {
      if (editingId) {
        setSchoolData(schoolData.map(item => item.id === editingId ? { ...item, ...formData } : item));
      } else {
        setSchoolData([...schoolData, { id: String(Date.now()), name: formData.name, code: formData.code, type: formData.type, city: formData.city }]);
      }
    } else {
      if (editingId) {
        setEnterpriseData(enterpriseData.map(item => item.id === editingId ? { ...item, ...formData } : item));
      } else {
        setEnterpriseData([...enterpriseData, { id: String(Date.now()), name: formData.name, code: formData.code, type: formData.type, industry: formData.industry }]);
      }
    }
    setIsModalOpen(false);
  };

  const openAddDictModal = () => {
    setEditingDictId(null);
    setDictFormData({ name: '', code: '' });
    setIsDictModalOpen(true);
  };

  const openEditDictModal = (dict: any) => {
    setEditingDictId(dict.id);
    setDictFormData({ name: dict.name, code: dict.code });
    setIsDictModalOpen(true);
  };

  const handleSaveDict = () => {
    if (!dictFormData.name || !dictFormData.code) {
      alert('请填写名称和编码');
      return;
    }
    if (editingDictId) {
      setDicts(dicts.map(d => d.id === editingDictId ? { ...d, ...dictFormData } : d));
    } else {
      setDicts([...dicts, { id: String(Date.now()), name: dictFormData.name, code: dictFormData.code, items: [] }]);
    }
    setIsDictModalOpen(false);
  };

  const handleDeleteDict = (id: string) => {
    if (confirm('确认删除该字典吗？')) {
      setDicts(dicts.filter(d => d.id !== id));
    }
  };

  const openItemsModal = (dict: any) => {
    setCurrentDict(dict);
    setIsItemsModalOpen(true);
  };

  const handleAddItem = () => {
    if (!newItemName) return;
    setDicts(dicts.map(d => {
      if (d.id === currentDict.id) {
        const updated = { ...d, items: [...d.items, newItemName] };
        setCurrentDict(updated);
        return updated;
      }
      return d;
    }));
    setNewItemName('');
  };

  const handleDeleteItem = (itemIndex: number) => {
    if (!confirm('确认删除该字典项吗？')) return;
    setDicts(dicts.map(d => {
      if (d.id === currentDict.id) {
        const newItems = [...d.items];
        newItems.splice(itemIndex, 1);
        const updated = { ...d, items: newItems };
        setCurrentDict(updated);
        return updated;
      }
      return d;
    }));
  };

  return (
    <div className={`bg-gray-100 p-4 ${className} overflow-hidden flex flex-col`}>
      <div className="bg-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 shrink-0">
          <span className="text-gray-400 text-[13px]">系统设置</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 text-[13px] font-medium">基础数据</span>
        </div>

        <div className="p-6 pb-0 shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 gap-6">
            <button
              onClick={() => {
                setActiveTab('school');
                setSearchName('');
              }}
              className={`py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'school'
                  ? 'border-[#3498eb] text-[#3498eb]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              学校基础数据
            </button>
            <button
              onClick={() => {
                setActiveTab('enterprise');
                setSearchName('');
              }}
              className={`py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'enterprise'
                  ? 'border-[#3498eb] text-[#3498eb]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              企业基础数据
            </button>
            <button
              onClick={() => {
                setActiveTab('dict');
                setSearchName('');
              }}
              className={`py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'dict'
                  ? 'border-[#3498eb] text-[#3498eb]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              数据字典
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500 text-right w-12">名称:</span>
              <input
                type="text"
                placeholder="请输入名称"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#3498eb]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button className="flex items-center gap-1.5 px-4 py-1.5 ml-2 bg-[#3498eb] text-white rounded text-[13px] transition-colors hover:bg-blue-600">
                <Search className="w-3.5 h-3.5" />
                查询
              </button>
              <button 
                onClick={() => setSearchName('')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-[13px] transition-colors hover:bg-gray-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重置
              </button>
            </div>
            
            <button 
              onClick={activeTab === 'dict' ? openAddDictModal : openCreateModal}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3498eb] text-white rounded text-[13px] transition-colors hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto p-6 pt-0">
          {activeTab === 'school' && (
            <div className="border border-gray-100 rounded-sm">
              <table className="w-full text-left border-collapse text-[13px] text-gray-600">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-6">序号</th>
                    <th className="py-3 px-6">学校名称</th>
                    <th className="py-3 px-6">学校代码</th>
                    <th className="py-3 px-6">办学类型</th>
                    <th className="py-3 px-6">所在城市</th>
                    <th className="py-3 px-6 text-center w-36">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedSchoolData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">{index + 1}</td>
                      <td className="py-3 px-6 text-gray-800">{row.name}</td>
                      <td className="py-3 px-6">{row.code}</td>
                      <td className="py-3 px-6">
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-sm text-xs border border-blue-100">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-6">{row.city}</td>
                      <td className="py-3 px-6">
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
                  {displayedSchoolData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">暂无数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'enterprise' && (
            <div className="border border-gray-100 rounded-sm">
              <table className="w-full text-left border-collapse text-[13px] text-gray-600">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-6">序号</th>
                    <th className="py-3 px-6">企业名称</th>
                    <th className="py-3 px-6">统一信用代码</th>
                    <th className="py-3 px-6">企业分类</th>
                    <th className="py-3 px-6">所属行业</th>
                    <th className="py-3 px-6 text-center w-36">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedEnterpriseData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">{index + 1}</td>
                      <td className="py-3 px-6 text-gray-800">{row.name}</td>
                      <td className="py-3 px-6">{row.code}</td>
                      <td className="py-3 px-6">
                        <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-sm text-xs border border-indigo-100">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-6">{row.industry}</td>
                      <td className="py-3 px-6">
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
                  {displayedEnterpriseData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">暂无数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'dict' && (
            <div className="border border-gray-100 rounded-sm">
              <table className="w-full text-left border-collapse text-[13px] text-gray-600">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-6 w-24">序号</th>
                    <th className="py-3 px-6">编码</th>
                    <th className="py-3 px-6">名称</th>
                    <th className="py-3 px-6 text-center w-64">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedDictData.map((dict, index) => (
                    <tr key={dict.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">{index + 1}</td>
                      <td className="py-3 px-6 text-gray-800">{dict.code}</td>
                      <td className="py-3 px-6">{dict.name}</td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => openItemsModal(dict)}
                            className="text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
                          >
                            <ListIcon className="w-3.5 h-3.5" /> <span className="text-xs">字典项</span>
                          </button>
                          <button 
                            onClick={() => openEditDictModal(dict)}
                            className="text-[#3498eb] hover:text-blue-700 transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" /> <span className="text-xs">编辑</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteDict(dict.id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> <span className="text-xs">删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedDictData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">暂无数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[500px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">
                {editingId 
                  ? (activeTab === 'school' ? '编辑学校基础数据' : '编辑企业基础数据') 
                  : (activeTab === 'school' ? '新增学校基础数据' : '新增企业基础数据')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <label className="w-28 text-right text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>名称 :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder={activeTab === 'school' ? "请输入学校名称" : "请输入企业名称"}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <label className="w-28 text-right text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>{activeTab === 'school' ? '代码' : '信用代码'} :</label>
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder={activeTab === 'school' ? "请输入学校代码" : "请输入统一信用代码"}
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <label className="w-28 text-right text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>{activeTab === 'school' ? '办学类型' : '企业分类'} :</label>
                <select 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb] bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  {activeTab === 'school' ? (
                    <>
                      <option value="本科">本科</option>
                      <option value="高职">高职</option>
                      <option value="中职">中职</option>
                    </>
                  ) : (
                    <>
                      <option value="国企">国企</option>
                      <option value="民企">民企</option>
                      <option value="外企">外企</option>
                    </>
                  )}
                </select>
              </div>

              {activeTab === 'school' ? (
                <div className="flex items-center gap-3">
                  <label className="w-28 text-right text-sm text-gray-600">所在城市 :</label>
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                    placeholder="请输入所在城市"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="w-28 text-right text-sm text-gray-600">所属行业 :</label>
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                    placeholder="请输入所属行业"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
              )}
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

      {/* Dict Modal */}
      {isDictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[400px] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editingDictId ? '修改字典' : '新增字典'}</h3>
              <button onClick={() => setIsDictModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-gray-600 font-medium"><span className="text-red-500 mr-1">*</span>名称</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入字典名称"
                  value={dictFormData.name}
                  onChange={(e) => setDictFormData({...dictFormData, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-gray-600 font-medium"><span className="text-red-500 mr-1">*</span>编码</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入字典编码"
                  value={dictFormData.code}
                  onChange={(e) => setDictFormData({...dictFormData, code: e.target.value})}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button onClick={() => setIsDictModalOpen(false)} className="px-5 py-1.5 text-gray-600 bg-white border border-gray-300 rounded text-[13px] hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button onClick={handleSaveDict} className="px-5 py-1.5 bg-[#3498eb] text-white rounded text-[13px] hover:bg-blue-600 transition-colors">
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dict Items Modal */}
      {isItemsModalOpen && currentDict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[500px] flex flex-col h-[600px] max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">字典项管理 - {currentDict.name}</h3>
              <button onClick={() => setIsItemsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#3498eb] focus:ring-1 focus:ring-[#3498eb]"
                  placeholder="请输入新字典项名称"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button 
                  onClick={handleAddItem}
                  className="bg-[#3498eb] hover:bg-blue-600 text-white px-4 py-2 rounded text-[13px] transition-colors whitespace-nowrap"
                >
                  添加
                </button>
              </div>

              <div className="border border-gray-200 rounded flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 sticky top-0 z-10">
                      <th className="py-2.5 px-4 font-medium w-20">序号</th>
                      <th className="py-2.5 px-4 font-medium">字典项名称</th>
                      <th className="py-2.5 px-4 font-medium w-24 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDict.items.map((item: string, index: number) => (
                      <tr key={index} className="border-b border-gray-50 text-gray-700 hover:bg-gray-50/50">
                        <td className="py-2.5 px-4">{index + 1}</td>
                        <td className="py-2.5 px-4">{item}</td>
                        <td className="py-2.5 px-4 text-center">
                          <button 
                            onClick={() => handleDeleteItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentDict.items.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-gray-400">暂无字典项</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50 rounded-b-lg">
              <button onClick={() => setIsItemsModalOpen(false)} className="px-6 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-[13px] hover:bg-gray-50 transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

