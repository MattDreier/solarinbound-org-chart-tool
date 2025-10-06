import { useState, useRef } from 'react';
import { ChevronDown, Edit2, Copy, Trash2, Plus, X, Users, DollarSign } from 'lucide-react';

export default function OrgChartApp() {
  const [accountHubs, setAccountHubs] = useState({
    coreSeats: 'Enterprise',
    salesHub: { enabled: true, tier: 'Enterprise' },
    marketingHub: { enabled: true, tier: 'Enterprise' },
    serviceHub: { enabled: true, tier: 'Enterprise' },
    commerceHub: { enabled: true, tier: 'Enterprise' },
    dataHub: { enabled: false, tier: 'Professional' }
  });

  const [nodes, setNodes] = useState({
    '1': { 
      id: '1', 
      name: 'Jon Smith', 
      role: 'CEO', 
      permission: 'Super Admin', 
      hubAccess: {
        coreSeat: true,
        salesHub: true,
        marketingHub: true,
        serviceHub: true,
        commerceHub: true,
        dataHub: false,
        viewOnly: false,
        partnerSeat: false
      },
      type: 'person', 
      parentId: null 
    },
    '2': { id: '2', team: 'Sales', type: 'branch', parentId: '1' },
    '3': { 
      id: '3', 
      name: 'Jake Mann', 
      role: 'Sales Representative', 
      hubAccess: {
        coreSeat: false,
        salesHub: true,
        marketingHub: false,
        serviceHub: false,
        commerceHub: false,
        dataHub: false,
        viewOnly: false,
        partnerSeat: false
      },
      type: 'person', 
      parentId: '2' 
    },
    '4': { 
      id: '4', 
      name: 'Susan Wilson', 
      role: 'Residential Sales Manager', 
      permission: 'Sales Manager', 
      hubAccess: {
        coreSeat: true,
        salesHub: true,
        marketingHub: false,
        serviceHub: false,
        commerceHub: false,
        dataHub: false,
        viewOnly: false,
        partnerSeat: false
      },
      type: 'person', 
      parentId: '2' 
    }
  });
  
  const [history, setHistory] = useState([{
    '1': { 
      id: '1', 
      name: 'Jon Smith', 
      role: 'CEO', 
      permission: 'Super Admin', 
      hubAccess: {
        coreSeat: true,
        salesHub: true,
        marketingHub: true,
        serviceHub: true,
        commerceHub: true,
        dataHub: false,
        viewOnly: false,
        partnerSeat: false
      },
      type: 'person', 
      parentId: null 
    },
    '2': { id: '2', team: 'Sales', type: 'branch', parentId: '1' },
    '3': { 
      id: '3', 
      name: 'Jake Mann', 
      role: 'Sales Representative', 
      hubAccess: {
        coreSeat: false,
        salesHub: true,
        marketingHub: false,
        serviceHub: false,
        commerceHub: false,
        dataHub: false,
        viewOnly: false,
        partnerSeat: false
      },
      type: 'person', 
      parentId: '2' 
    },
    '4': { 
      id: '4', 
      name: 'Susan Wilson', 
      role: 'Residential Sales Manager', 
      permission: 'Sales Manager', 
      hubAccess: {
        coreSeat: true,
        salesHub: true,
        marketingHub: false,
        serviceHub: false,
        commerceHub: false,
        dataHub: false,
        viewOnly: false,
        partnerSeat: false
      },
      type: 'person', 
      parentId: '2' 
    }
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCompanyNameModal, setShowCompanyNameModal] = useState(false);
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  const [showNewChartModal, setShowNewChartModal] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [addParentId, setAddParentId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [editForm, setEditForm] = useState({});
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [companyName, setCompanyName] = useState('Company Name Here');
  const [companyNameInput, setCompanyNameInput] = useState('Company Name Here');
  const nextIdRef = useRef(5);

  const saveToHistory = (newNodes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNodes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setNodes(newNodes);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex]);
    }
  };

  const handleNodeDoubleClick = (nodeId) => {
    const node = nodes[nodeId];
    setSelectedNode(node);
    setEditForm({ ...node });
    setShowEditPanel(true);
  };

  const handleSaveEdit = () => {
    if (selectedNode) {
      const newNodes = {
        ...nodes,
        [selectedNode.id]: { ...nodes[selectedNode.id], ...editForm }
      };
      saveToHistory(newNodes);
    }
    setShowEditPanel(false);
    setSelectedNode(null);
  };

  const handleAddChild = (parentId) => {
    const newId = String(nextIdRef.current++);
    
    const newNodes = {
      ...nodes,
      [newId]: {
        id: newId,
        name: 'New Person',
        role: '',
        hubAccess: {
          coreSeat: true,
          salesHub: false,
          marketingHub: false,
          serviceHub: false,
          commerceHub: false,
          dataHub: false,
          viewOnly: false,
          partnerSeat: false
        },
        type: 'person',
        parentId: parentId
      }
    };
    saveToHistory(newNodes);
    setShowAddPanel(false);
  };

  const handleAddBranch = (parentId) => {
    const newId = String(nextIdRef.current++);
    
    const newNodes = {
      ...nodes,
      [newId]: {
        id: newId,
        team: 'New Team',
        type: 'branch',
        parentId: parentId
      }
    };
    saveToHistory(newNodes);
    setShowAddPanel(false);
  };

  const handleOpenAddPanel = (parentId) => {
    setAddParentId(parentId);
    setShowAddPanel(true);
  };

  const handleDeleteNode = (nodeId) => {
    const node = nodes[nodeId];
    
    if (!node.parentId) {
      return;
    }
    
    const toDelete = [nodeId];
    let index = 0;
    while (index < toDelete.length) {
      const currentId = toDelete[index];
      Object.values(nodes).forEach(node => {
        if (node.parentId === currentId && !toDelete.includes(node.id)) {
          toDelete.push(node.id);
        }
      });
      index++;
    }
    
    const newNodes = { ...nodes };
    toDelete.forEach(id => delete newNodes[id]);
    saveToHistory(newNodes);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 10));
  };

  const handleNewChart = () => {
    setShowNewChartModal(true);
    setOpenDropdown(null);
  };

  const confirmNewChart = () => {
    const newNodes = {
      '1': { 
        id: '1', 
        name: 'CEO', 
        role: 'Chief Executive Officer', 
        hubAccess: {
          coreSeat: true,
          salesHub: false,
          marketingHub: false,
          serviceHub: false,
          commerceHub: false,
          dataHub: false,
          viewOnly: false,
          partnerSeat: false
        },
        type: 'person', 
        parentId: null 
      }
    };
    saveToHistory(newNodes);
    setCompanyName('Company Name Here');
    nextIdRef.current = 2;
    setShowNewChartModal(false);
  };

  const calculateCosts = () => {
    const personNodes = Object.values(nodes).filter(n => n.type === 'person');
    
    let coreSeatsCount = 0;
    let salesHubCount = 0;
    let marketingHubCount = 0;
    let serviceHubCount = 0;
    let commerceHubCount = 0;
    let dataHubCount = 0;
    let viewOnlyCount = 0;
    let partnerSeatCount = 0;
    
    personNodes.forEach(node => {
      const access = node.hubAccess || {};
      
      if (access.partnerSeat) {
        partnerSeatCount++;
      } else if (access.viewOnly) {
        viewOnlyCount++;
      } else {
        if (access.coreSeat) coreSeatsCount++;
        if (access.salesHub) salesHubCount++;
        if (access.marketingHub) marketingHubCount++;
        if (access.serviceHub) serviceHubCount++;
        if (access.commerceHub) commerceHubCount++;
        if (access.dataHub) dataHubCount++;
      }
    });
    
    const coreSeatPrice = accountHubs.coreSeats === 'Starter' ? 20 
      : accountHubs.coreSeats === 'Professional' ? 50 
      : 75;
    
    const salesHubPrice = accountHubs.salesHub.tier === 'Professional' ? 100 : 150;
    const marketingHubPrice = accountHubs.marketingHub.tier === 'Professional' ? 100 : 150;
    const serviceHubPrice = accountHubs.serviceHub.tier === 'Professional' ? 100 : 130;
    const commerceHubPrice = accountHubs.commerceHub.tier === 'Professional' ? 85 : 140;
    const dataHubPrice = accountHubs.dataHub.tier === 'Professional' ? 50 : 75;
    
    const coreSeatsTotal = coreSeatsCount * coreSeatPrice;
    const salesHubTotal = accountHubs.salesHub.enabled ? (salesHubCount * salesHubPrice) : 0;
    const marketingHubTotal = accountHubs.marketingHub.enabled ? (marketingHubCount * marketingHubPrice) : 0;
    const serviceHubTotal = accountHubs.serviceHub.enabled ? (serviceHubCount * serviceHubPrice) : 0;
    const commerceHubTotal = accountHubs.commerceHub.enabled ? (commerceHubCount * commerceHubPrice) : 0;
    const dataHubTotal = accountHubs.dataHub.enabled ? (dataHubCount * dataHubPrice) : 0;
    
    const totalMonthlyCost = coreSeatsTotal + salesHubTotal + marketingHubTotal 
      + serviceHubTotal + commerceHubTotal + dataHubTotal;
    
    let onboardingFee = 0;
    let tier = 'Starter';
    
    const hasEnterprise = accountHubs.coreSeats === 'Enterprise' 
      || (accountHubs.salesHub.enabled && accountHubs.salesHub.tier === 'Enterprise')
      || (accountHubs.marketingHub.enabled && accountHubs.marketingHub.tier === 'Enterprise')
      || (accountHubs.serviceHub.enabled && accountHubs.serviceHub.tier === 'Enterprise')
      || (accountHubs.commerceHub.enabled && accountHubs.commerceHub.tier === 'Enterprise')
      || (accountHubs.dataHub.enabled && accountHubs.dataHub.tier === 'Enterprise');
    
    const hasProfessional = accountHubs.coreSeats === 'Professional'
      || (accountHubs.salesHub.enabled && accountHubs.salesHub.tier === 'Professional')
      || (accountHubs.marketingHub.enabled && accountHubs.marketingHub.tier === 'Professional')
      || (accountHubs.serviceHub.enabled && accountHubs.serviceHub.tier === 'Professional')
      || (accountHubs.commerceHub.enabled && accountHubs.commerceHub.tier === 'Professional')
      || (accountHubs.dataHub.enabled && accountHubs.dataHub.tier === 'Professional');
    
    if (hasEnterprise) {
      tier = 'Enterprise';
      onboardingFee = 3500;
    } else if (hasProfessional) {
      tier = 'Professional';
      onboardingFee = 1500;
    }
    
    return {
      breakdown: {
        coreSeats: { count: coreSeatsCount, price: coreSeatPrice, total: coreSeatsTotal },
        salesHub: { count: salesHubCount, price: salesHubPrice, total: salesHubTotal, enabled: accountHubs.salesHub.enabled },
        marketingHub: { count: marketingHubCount, price: marketingHubPrice, total: marketingHubTotal, enabled: accountHubs.marketingHub.enabled },
        serviceHub: { count: serviceHubCount, price: serviceHubPrice, total: serviceHubTotal, enabled: accountHubs.serviceHub.enabled },
        commerceHub: { count: commerceHubCount, price: commerceHubPrice, total: commerceHubTotal, enabled: accountHubs.commerceHub.enabled },
        dataHub: { count: dataHubCount, price: dataHubPrice, total: dataHubTotal, enabled: accountHubs.dataHub.enabled },
        viewOnly: { count: viewOnlyCount, price: 0, total: 0 },
        partnerSeat: { count: partnerSeatCount, price: 0, total: 0 }
      },
      totalMonthlyCost,
      totalAnnualCost: totalMonthlyCost * 12,
      tier,
      onboardingFee,
      totalFirstYearCost: (totalMonthlyCost * 12) + onboardingFee
    };
  };

  const handleExport = (format) => {
    if (format === 'json') {
      const costs = calculateCosts();
      const exportData = {
        companyName: companyName,
        accountConfiguration: accountHubs,
        nodes: nodes,
        costAnalysis: costs,
        summary: {
          totalUsers: Object.values(nodes).filter(n => n.type === 'person').length,
          totalPaidUsers: Object.values(nodes).filter(n => 
            n.type === 'person' && n.hubAccess && !n.hubAccess.viewOnly && !n.hubAccess.partnerSeat
          ).length,
          totalViewOnlyUsers: Object.values(nodes).filter(n => 
            n.type === 'person' && n.hubAccess?.viewOnly
          ).length,
          totalPartnerUsers: Object.values(nodes).filter(n => 
            n.type === 'person' && n.hubAccess?.partnerSeat
          ).length,
          totalTeams: Object.values(nodes).filter(n => n.type === 'branch').length,
          recommendedTier: costs.tier,
          estimatedMonthlyCost: costs.totalMonthlyCost,
          estimatedAnnualCost: costs.totalAnnualCost,
          oneTimeOnboardingFee: costs.onboardingFee,
          totalFirstYearCost: costs.totalFirstYearCost
        },
        hubsEnabled: {
          salesHub: accountHubs.salesHub.enabled,
          marketingHub: accountHubs.marketingHub.enabled,
          serviceHub: accountHubs.serviceHub.enabled,
          commerceHub: accountHubs.commerceHub.enabled,
          dataHub: accountHubs.dataHub.enabled
        }
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      
      // Copy to clipboard
      navigator.clipboard.writeText(dataStr).then(() => {
        setShowExportSuccess(true);
      }).catch(err => {
        console.error('Copy failed:', err);
        alert('Failed to copy to clipboard. Please try the View JSON option instead.');
      });
    }
    setOpenDropdown(null);
  };

  const handleZoomLevel = (level) => {
    setZoom(level);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.org-chart-container')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleEditCompanyName = () => {
    setCompanyNameInput(companyName);
    setShowCompanyNameModal(true);
  };

  const handleSaveCompanyName = () => {
    setCompanyName(companyNameInput);
    setShowCompanyNameModal(false);
  };

  const handleCancelCompanyName = () => {
    setCompanyNameInput(companyName);
    setShowCompanyNameModal(false);
  };

  const getChildNodes = (parentId) => {
    return Object.values(nodes).filter(node => node.parentId === parentId);
  };

  const calculateSubtreeWidth = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return 0;
    
    const children = getChildNodes(nodeId);
    const isCompact = zoom <= 50;
    
    let nodeWidth;
    if (isCompact) {
      nodeWidth = node.type === 'branch' ? 200 : 200;
    } else {
      nodeWidth = node.type === 'branch' ? 340 : 290;
    }
    
    const minGap = isCompact ? 60 : 60;
    
    if (children.length === 0) {
      return nodeWidth;
    }
    
    const childrenWidths = children.map(child => calculateSubtreeWidth(child.id));
    const totalChildrenWidth = childrenWidths.reduce((sum, width) => sum + width, 0);
    const totalGaps = (children.length - 1) * minGap;
    const childrenTotalWidth = totalChildrenWidth + totalGaps;
    
    return Math.max(nodeWidth, childrenTotalWidth);
  };

  const countTeamMembers = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return 0;
    
    const children = getChildNodes(nodeId);
    let count = 0;
    
    if (node.type === 'person') {
      count = 1;
    }
    
    children.forEach(child => {
      count += countTeamMembers(child.id);
    });
    
    return count;
  };

  const getUniqueRoles = () => {
    const roles = Object.values(nodes)
      .filter(node => node.type === 'person' && node.role)
      .map(node => node.role);
    return [...new Set(roles)].sort();
  };

  const getUniquePermissions = () => {
    const permissions = Object.values(nodes)
      .filter(node => node.type === 'person' && node.permission)
      .map(node => node.permission);
    return [...new Set(permissions)].sort();
  };

  const getUniqueTeams = () => {
    const teams = Object.values(nodes)
      .filter(node => node.type === 'branch' && node.team)
      .map(node => node.team);
    return [...new Set(teams)].sort();
  };

  const getSolarTemplate = () => {
    return {
      name: "Solar - Enterprise Solar Installer",
      description: "Comprehensive org chart for solar installation companies",
      companyName: "SolarTech Solutions",
      accountHubs: {
        coreSeats: 'Enterprise',
        salesHub: { enabled: true, tier: 'Enterprise' },
        marketingHub: { enabled: true, tier: 'Enterprise' },
        serviceHub: { enabled: true, tier: 'Enterprise' },
        commerceHub: { enabled: true, tier: 'Enterprise' },
        dataHub: { enabled: false, tier: 'Professional' }
      },
      nodes: {
        // Chairman - Core only, needs visibility but not hub features
        '1': { id: '1', name: 'William Harrison', role: 'Chairman of the Board', permission: 'Super Admin', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: null },
        
        // CEO - Core only, oversees everything but doesn't need hub tools
        '2': { id: '2', name: 'Sarah Chen', role: 'Chief Executive Officer (CEO)', permission: 'Super Admin', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '1' },
        
        // CFO - Core only for financial visibility and reporting
        '3': { id: '3', name: 'Patricia Johnson', role: 'Chief Financial Officer (CFO)', permission: 'Account Admin', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '1' },
        
        // COO - Core only for operations oversight
        '4': { id: '4', name: 'Mike Rodriguez', role: 'Chief Operating Officer (COO)', permission: 'Account Admin', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: false }, type: 'person', parentId: '1' },
        
        // CTO - Partner Seat (SolarInbound employee)
        '5': { id: '5', name: 'SolarInbound', role: 'Chief Technology Officer (CTO)', permission: 'Super Admin', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '1' },
        
        // CMO - Core + Marketing + Sales for full campaign and revenue visibility
        '6': { id: '6', name: 'Jennifer Martinez', role: 'Chief Marketing Officer (CMO)', permission: 'Sales Manager', hubAccess: { coreSeat: true, salesHub: true, marketingHub: true, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: false }, type: 'person', parentId: '1' },
        
        // VP Customer Success - Core + Service for customer oversight
        '7': { id: '7', name: 'Jessica Moore', role: 'VP of Customer Success', permission: 'Customer Success Manager', personTeam: 'Customer Success', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: true, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '2' },
        
        // VP Strategy - Core + Sales + Marketing for strategic planning
        '8': { id: '8', name: 'Robert Chen', role: 'VP of Strategy & Development', permission: 'Sales Manager', hubAccess: { coreSeat: true, salesHub: true, marketingHub: true, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '2' },
        
        '9': { id: '9', team: 'Finance & Accounting', type: 'branch', parentId: '3' },
        '10': { id: '10', team: 'Procurement & Supply Chain', type: 'branch', parentId: '3' },
        '11': { id: '11', team: 'Legal & Compliance', type: 'branch', parentId: '3' },
        
        // Finance Team - Core for financial data access
        '12': { id: '12', name: 'Steven Davis', role: 'Controller', permission: 'Account Admin', personTeam: 'Finance & Accounting', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '9' },
        
        // Accountant - View-Only (reads financial reports, doesn't modify CRM)
        '13': { id: '13', name: 'Amanda White', role: 'Senior Accountant', permission: 'View-Only User', personTeam: 'Finance & Accounting', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: true }, type: 'person', parentId: '9' },
        
        // Procurement Manager - Core for vendor/supplier management
        '14': { id: '14', name: 'Nicole Taylor', role: 'Procurement Manager', permission: 'Operations User', personTeam: 'Procurement & Supply Chain', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '10' },
        
        // Supply Chain Coordinator - View-Only (monitors shipments)
        '15': { id: '15', name: 'James Wilson', role: 'Supply Chain Coordinator', permission: 'View-Only User', personTeam: 'Procurement & Supply Chain', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: true }, type: 'person', parentId: '10' },
        
        // General Counsel - View-Only (needs data visibility for legal review, no CRM editing)
        '16': { id: '16', name: 'Michael Chang', role: 'General Counsel', permission: 'View-Only User', personTeam: 'Legal & Compliance', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: true }, type: 'person', parentId: '11' },
        
        '17': { id: '17', team: 'Installation Operations', type: 'branch', parentId: '4' },
        '18': { id: '18', team: 'Project Management', type: 'branch', parentId: '4' },
        '19': { id: '19', team: 'Quality Assurance', type: 'branch', parentId: '4' },
        
        // Operations Team - Core only for job/project tracking
        '20': { id: '20', name: 'David Kim', role: 'Director of Installation', permission: 'Operations Manager', personTeam: 'Installation Operations', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '17' },
        '21': { id: '21', name: 'Maria Garcia', role: 'Lead Installer - Residential', permission: 'Operations User', personTeam: 'Installation Operations', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '20' },
        '22': { id: '22', name: 'Carlos Santos', role: 'Lead Installer - Commercial', permission: 'Operations User', personTeam: 'Installation Operations', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '20' },
        '23': { id: '23', name: 'Kevin Brown', role: 'Installation Technician', permission: 'Operations User', personTeam: 'Installation Operations', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '20' },
        
        // Project Management - Core for project coordination
        '24': { id: '24', name: 'Lisa Thompson', role: 'Director of Project Management', permission: 'Operations Manager', personTeam: 'Project Management', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '18' },
        '25': { id: '25', name: 'Tom Anderson', role: 'Senior Project Manager', permission: 'Operations User', personTeam: 'Project Management', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '24' },
        '26': { id: '26', name: 'Rachel Lee', role: 'Project Coordinator', permission: 'Operations User', personTeam: 'Project Management', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '24' },
        
        // QA Team - Core for quality tracking
        '27': { id: '27', name: 'Samantha Green', role: 'QA Manager', permission: 'Operations Manager', personTeam: 'Quality Assurance', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '19' },
        '28': { id: '28', name: 'Brandon Miller', role: 'QA Inspector', permission: 'Operations User', personTeam: 'Quality Assurance', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '27' },
        
        '29': { id: '29', team: 'Software Development', type: 'branch', parentId: '5' },
        '30': { id: '30', team: 'CRM & Systems', type: 'branch', parentId: '5' },
        '31': { id: '31', team: 'IT Operations & Support', type: 'branch', parentId: '5' },
        
        // Technology Team - All Partner Seats (SolarInbound employees)
        '32': { id: '32', name: 'Marcus Johnson', role: 'Director of Software Development', permission: 'Technology Admin', personTeam: 'Software Development', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '29' },
        '33': { id: '33', name: 'Chris Anderson', role: 'Senior Software Engineer', permission: 'Technology User', personTeam: 'Software Development', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '32' },
        '34': { id: '34', name: 'Sarah Williams', role: 'Full Stack Developer', permission: 'Technology User', personTeam: 'Software Development', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '32' },
        '35': { id: '35', name: 'Daniel Lee', role: 'DevOps Engineer', permission: 'Technology User', personTeam: 'Software Development', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '32' },
        
        // CRM/Systems Team - All Partner Seats (SolarInbound employees)
        '36': { id: '36', name: 'Emily Zhang', role: 'CRM Systems Manager', permission: 'Super Admin', personTeam: 'CRM & Systems', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '30' },
        '37': { id: '37', name: 'Michelle Park', role: 'CRM Administrator', permission: 'Account Admin', personTeam: 'CRM & Systems', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '36' },
        '38': { id: '38', name: 'Andrew Martinez', role: 'Database Administrator', permission: 'Technology Admin', personTeam: 'CRM & Systems', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '36' },
        '39': { id: '39', name: 'Timothy Chen', role: 'Systems Analyst', permission: 'Technology User', personTeam: 'CRM & Systems', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '36' },
        
        // IT Operations - All Partner Seats (SolarInbound employees)
        '40': { id: '40', name: 'Maya Patel', role: 'IT Operations Manager', permission: 'Technology Admin', personTeam: 'IT Operations & Support', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '31' },
        '41': { id: '41', name: 'Dr. Rebecca Foster', role: 'Network Administrator', permission: 'Technology User', personTeam: 'IT Operations & Support', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false, partnerSeat: true }, type: 'person', parentId: '40' },
        
        '42': { id: '42', team: 'Sales', type: 'branch', parentId: '6' },
        '43': { id: '43', team: 'Marketing & Brand', type: 'branch', parentId: '6' },
        '44': { id: '44', team: 'Business Development', type: 'branch', parentId: '6' },
        
        // VP of Sales - Core + Sales for full pipeline management
        '45': { id: '45', name: 'Richard Thompson', role: 'VP of Sales', permission: 'Sales Manager', personTeam: 'Sales', hubAccess: { coreSeat: true, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '42' },
        
        '46': { id: '46', team: 'Residential Sales', type: 'branch', parentId: '45' },
        '47': { id: '47', team: 'Commercial Sales', type: 'branch', parentId: '45' },
        
        // Sales Managers - Core + Sales Hub for team oversight
        '48': { id: '48', name: 'Susan Wilson', role: 'Residential Sales Manager', permission: 'Sales Manager', personTeam: 'Residential Sales', hubAccess: { coreSeat: true, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '46' },
        
        // Sales Reps - Sales Hub ONLY (no Core needed, saves money)
        '49': { id: '49', name: 'Jake Mann', role: 'Sales Representative', permission: 'Sales Rep', personTeam: 'Residential Sales', hubAccess: { coreSeat: false, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '46' },
        '50': { id: '50', name: 'Lisa Rodriguez', role: 'Sales Representative', permission: 'Sales Rep', personTeam: 'Residential Sales', hubAccess: { coreSeat: false, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '46' },
        
        // Commercial Sales Manager - Core + Sales
        '51': { id: '51', name: 'Jonathan Blake', role: 'Commercial Sales Manager', permission: 'Sales Manager', personTeam: 'Commercial Sales', hubAccess: { coreSeat: true, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '47' },
        
        // Enterprise AE - Sales Hub only
        '52': { id: '52', name: 'Natalie Wong', role: 'Enterprise Account Executive', permission: 'Sales Rep', personTeam: 'Commercial Sales', hubAccess: { coreSeat: false, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '47' },
        
        // Marketing Team - Core + Marketing
        '53': { id: '53', name: 'Alexandra Davis', role: 'Marketing Director', permission: 'Marketing Manager', personTeam: 'Marketing & Brand', hubAccess: { coreSeat: true, salesHub: false, marketingHub: true, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '43' },
        '54': { id: '54', name: 'Peter Jackson', role: 'Digital Marketing Manager', permission: 'Marketing User', personTeam: 'Marketing & Brand', hubAccess: { coreSeat: true, salesHub: false, marketingHub: true, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '53' },
        '55': { id: '55', name: 'Emma Thompson', role: 'Content Specialist', permission: 'Marketing User', personTeam: 'Marketing & Brand', hubAccess: { coreSeat: true, salesHub: false, marketingHub: true, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '53' },
        
        // Business Development - Core + Sales
        '56': { id: '56', name: 'Victoria Martinez', role: 'Business Development Manager', permission: 'Sales Manager', personTeam: 'Business Development', hubAccess: { coreSeat: true, salesHub: true, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '44' },
        '57': { id: '57', name: 'Nathan Scott', role: 'Partnership Coordinator', permission: 'Sales Rep', personTeam: 'Business Development', hubAccess: { coreSeat: true, salesHub: false, marketingHub: false, serviceHub: false, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '56' },
        
        '58': { id: '58', team: 'Customer Support', type: 'branch', parentId: '7' },
        '59': { id: '59', team: 'Customer Experience', type: 'branch', parentId: '7' },
        
        // Customer Support - Service Hub ONLY (no Core needed, saves money)
        '60': { id: '60', name: 'Hannah Cooper', role: 'Support Team Lead', permission: 'Customer Success Manager', personTeam: 'Customer Support', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: true, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '58' },
        '61': { id: '61', name: 'Oliver Brooks', role: 'Support Specialist', permission: 'Support Rep', personTeam: 'Customer Support', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: true, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '58' },
        
        // Customer Experience - Service Hub only
        '62': { id: '62', name: 'Sophia Martinez', role: 'CX Manager', permission: 'Customer Success Manager', personTeam: 'Customer Experience', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: true, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '59' },
        '63': { id: '63', name: 'Lucas Anderson', role: 'Customer Success Specialist', permission: 'Support Rep', personTeam: 'Customer Experience', hubAccess: { coreSeat: false, salesHub: false, marketingHub: false, serviceHub: true, commerceHub: false, dataHub: false, viewOnly: false }, type: 'person', parentId: '59' }
      }
    };
  };

  const templates = {
    solar: getSolarTemplate()
  };

  const handleLoadTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      saveToHistory(template.nodes);
      
      // Use the company name entered in welcome dialog if available, otherwise use template default
      if (companyNameInput && companyNameInput.trim() !== '' && companyNameInput !== 'Company Name Here') {
        setCompanyName(companyNameInput);
      } else {
        setCompanyName(template.companyName || 'Company Name Here');
      }
      
      if (template.accountHubs) {
        setAccountHubs(template.accountHubs);
      }
      
      const maxId = Math.max(...Object.keys(template.nodes).map(id => parseInt(id)));
      nextIdRef.current = maxId + 1;
      setShowTemplateModal(false);
      setShowWelcomeDialog(false);
      setOpenDropdown(null);
    }
  };

  const handleStartNew = () => {
    const trimmedName = companyNameInput.trim();
    if (trimmedName === '' || trimmedName === 'Company Name Here') {
      alert('Please enter a company name');
      return;
    }
    
    setCompanyName(trimmedName);
    
    const newNodes = {
      '1': { 
        id: '1', 
        name: 'CEO', 
        role: 'Chief Executive Officer', 
        hubAccess: {
          coreSeat: true,
          salesHub: false,
          marketingHub: false,
          serviceHub: false,
          commerceHub: false,
          dataHub: false,
          viewOnly: false,
          partnerSeat: false
        },
        type: 'person', 
        parentId: null 
      }
    };
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      saveToHistory(newNodes);
      nextIdRef.current = 2;
      setShowWelcomeDialog(false);
    }, 0);
  };

  const handleWelcomeTemplate = () => {
    const trimmedName = companyNameInput.trim();
    if (trimmedName === '' || trimmedName === 'Company Name Here') {
      alert('Please enter a company name');
      return;
    }
    setShowWelcomeDialog(false);
    setShowTemplateModal(true);
  };

  const renderNode = (node, level = 0, position = { x: 0, y: 0 }) => {
    const children = getChildNodes(node.id);
    const isCompact = zoom <= 50;
    const zoomScale = zoom / 100;
    
    const borderWidth = isCompact ? (2 / zoomScale) : 1;
    const borderRadius = isCompact ? (8 / zoomScale) : 6;
    const fontSize = isCompact ? (14 / zoomScale) : 14;
    const padding = isCompact ? (12 / zoomScale) : 16;
    
    let nodeHeight = 'auto';
    let nodeWidth = 290;
    
    if (isCompact) {
      nodeHeight = 'auto';
      nodeWidth = node.type === 'branch' ? 200 : 200;
    } else {
      nodeHeight = 'auto';
      if (node.type === 'person') {
        nodeWidth = 290;
      } else if (node.type === 'branch') {
        nodeWidth = 340;
      }
    }
    
    let calculatedHeight = 80;
    if (!isCompact) {
      if (node.type === 'person') {
        if (node.permission && node.hubAccess) calculatedHeight = 240;
        else if (node.permission || node.hubAccess) calculatedHeight = 200;
        else if (node.personTeam) calculatedHeight = 140;
        else if (node.role) calculatedHeight = 120;
        else calculatedHeight = 80;
      } else if (node.type === 'branch') {
        calculatedHeight = 140;
      }
    }
    
    const gapSize = isCompact ? 80 : 80;
    const lineStart = position.y + calculatedHeight;
    const buttonSize = isCompact ? 24 : 32;
    const buttonPosition = lineStart + (gapSize / 2) - (buttonSize / 2);
    const horizontalLineY = buttonPosition + buttonSize + 8;
    const lineToChildren = horizontalLineY;
    const childrenStartY = horizontalLineY + 40;
    const minGap = isCompact ? 60 : 60;
    const lineThickness = isCompact ? (2 / zoomScale) : 2;
    
    return (
      <div key={node.id}>
        <div className="absolute bg-gray-300" 
          style={{ 
            top: `${lineStart}px`, 
            left: `${position.x}px`, 
            width: `${lineThickness}px`, 
            height: `${gapSize / 2}px`,
            transform: `translateX(-${lineThickness / 2}px)`,
            zIndex: 0
          }}
        ></div>

        {children.length > 0 && (
          <>
            <div className="absolute bg-gray-300" 
              style={{ 
                top: `${buttonPosition + buttonSize}px`, 
                left: `${position.x}px`, 
                width: `${lineThickness}px`, 
                height: `${horizontalLineY - (buttonPosition + buttonSize)}px`,
                transform: `translateX(-${lineThickness / 2}px)`,
                zIndex: 0
              }}
            ></div>
            
            {children.length > 1 && (() => {
              const childWidths = children.map(c => calculateSubtreeWidth(c.id));
              const totalWidth = childWidths.reduce((sum, w) => sum + w, 0) + (children.length - 1) * minGap;
              let startX = position.x - totalWidth / 2;
              
              const firstChildX = startX + childWidths[0] / 2;
              let lastChildX = startX;
              for (let i = 0; i < children.length - 1; i++) {
                lastChildX += childWidths[i] + minGap;
              }
              lastChildX += childWidths[children.length - 1] / 2;
              
              return (
                <div className="absolute bg-gray-300" 
                  style={{ 
                    top: `${lineToChildren}px`, 
                    left: `${firstChildX}px`,
                    width: `${lastChildX - firstChildX}px`,
                    height: `${lineThickness}px`,
                    zIndex: 0
                  }}
                ></div>
              );
            })()}
            
            {children.map((child, idx) => {
              const childWidths = children.map(c => calculateSubtreeWidth(c.id));
              const totalWidth = childWidths.reduce((sum, w) => sum + w, 0) + (children.length - 1) * minGap;
              let startX = position.x - totalWidth / 2;
              
              let childX = startX;
              for (let i = 0; i < idx; i++) {
                childX += childWidths[i] + minGap;
              }
              childX += childWidths[idx] / 2;
              
              return (
                <div key={`line-${child.id}`} className="absolute bg-gray-300" 
                  style={{ 
                    top: `${lineToChildren}px`, 
                    left: `${childX}px`,
                    width: `${lineThickness}px`,
                    height: '40px',
                    transform: `translateX(-${lineThickness / 2}px)`,
                    zIndex: 0
                  }}
                ></div>
              );
            })}
          </>
        )}

        <div 
          className="absolute bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col"
          style={{ 
            top: `${position.y}px`, 
            left: `${position.x}px`, 
            width: `${nodeWidth}px`,
            minHeight: `${calculatedHeight}px`,
            transform: 'translateX(-50%)',
            border: `${borderWidth}px solid #d1d5db`,
            borderRadius: `${borderRadius}px`,
            backgroundColor: (isCompact && node.type === 'person') ? '#e5f8f6' : 'white',
            overflow: 'hidden',
            zIndex: 10
          }}
          onDoubleClick={() => handleNodeDoubleClick(node.id)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {node.type === 'person' ? (
            isCompact ? (
              <div style={{ 
                padding: `${padding}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: `${calculatedHeight}px`,
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ 
                  fontSize: `${fontSize}px`,
                  fontWeight: '600',
                  color: '#1f2937',
                  lineHeight: '1.4',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '100%'
                }}>
                  {node.name}
                </div>
              </div>
            ) : (
              <div className="p-4 flex-1">
                <div className="text-xs text-gray-500 mb-1">{node.name}</div>
                {node.role && <div className="text-base font-semibold mb-2">{node.role}</div>}
                {node.personTeam && <div className="text-sm text-gray-600 mb-2">Team: {node.personTeam}</div>}
                {node.hubAccess && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {node.hubAccess.partnerSeat && (
                      <span className="px-2 py-0.5 bg-cyan-50 border border-cyan-200 rounded text-xs text-cyan-700">
                        Partner
                      </span>
                    )}
                    {node.hubAccess.viewOnly && (
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs text-slate-700">
                        View-Only
                      </span>
                    )}
                    {node.hubAccess.coreSeat && (
                      <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        Core
                      </span>
                    )}
                    {node.hubAccess.salesHub && (
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700">
                        Sales
                      </span>
                    )}
                    {node.hubAccess.marketingHub && (
                      <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                        Marketing
                      </span>
                    )}
                    {node.hubAccess.serviceHub && (
                      <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
                        Service
                      </span>
                    )}
                    {node.hubAccess.commerceHub && (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                        Commerce
                      </span>
                    )}
                    {node.hubAccess.dataHub && (
                      <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-xs text-indigo-700">
                        Data
                      </span>
                    )}
                  </div>
                )}
                {node.permission && (
                  <div className="border border-gray-200 rounded p-2">
                    <div className="text-xs text-gray-600 mb-1">Permission</div>
                    <div className="text-xs text-gray-700">• {node.permission}</div>
                  </div>
                )}
              </div>
            )
          ) : (
            isCompact ? (
              <div style={{ 
                padding: `${padding}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: `${calculatedHeight}px`,
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ 
                  fontSize: `${fontSize}px`,
                  fontWeight: '600',
                  color: '#1f2937',
                  lineHeight: '1.4',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '100%'
                }}>
                  {node.team}
                </div>
              </div>
            ) : (
              <div className="p-4 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-800">{node.team}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {countTeamMembers(node.id)} {countTeamMembers(node.id) === 1 ? 'team member' : 'team members'}
                </div>
              </div>
            )
          )}
          
          {!isCompact && (
            <div className="border-t border-gray-200 px-4 py-2.5 flex items-center justify-between h-12 flex-shrink-0">
              <div className="flex gap-2">
                {node.parentId && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                  </button>
                )}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNodeDoubleClick(node.id); }}
                className="text-xs text-gray-700 hover:text-gray-900 font-medium"
              >
                Details
              </button>
            </div>
          )}
        </div>

        <div className="absolute" style={{ top: `${buttonPosition}px`, left: `${position.x}px`, transform: 'translateX(-50%)', zIndex: 10 }}>
          <button 
            onClick={() => handleOpenAddPanel(node.id)}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              border: `${borderWidth}px solid #d1d5db`,
              borderRadius: '50%',
              backgroundColor: 'white'
            }}
            className="flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            title="Add node"
          >
            <Plus style={{ width: `${buttonSize * 0.5}px`, height: `${buttonSize * 0.5}px` }} className="text-gray-600" />
          </button>
        </div>

        {children.map((child, idx) => {
          const childWidths = children.map(c => calculateSubtreeWidth(c.id));
          const totalWidth = childWidths.reduce((sum, w) => sum + w, 0) + (children.length - 1) * minGap;
          
          let startX = position.x - totalWidth / 2;
          
          let childX = startX;
          for (let i = 0; i < idx; i++) {
            childX += childWidths[i] + minGap;
          }
          childX += childWidths[idx] / 2;
          
          const childY = childrenStartY;
          return renderNode(child, level + 1, { x: childX, y: childY });
        })}
      </div>
    );
  };

  const rootNodes = Object.values(nodes).filter(node => node.parentId === null);

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden relative">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-14 flex items-center justify-between px-4" style={{ backgroundColor: '#44052A' }}>
          <button className="flex items-center gap-2 text-white text-sm">
            <ChevronDown className="w-4 h-4 rotate-90" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">{companyName}</span>
            <button onClick={handleEditCompanyName} className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="w-16"></div>
        </div>

        <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-6 text-sm relative">
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('file')} 
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              File <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'file' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button onClick={handleNewChart} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                  New
                </button>
                <button 
                  onClick={() => { setShowTemplateModal(true); setOpenDropdown(null); }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Use Template
                </button>
                <div className="border-t border-gray-200"></div>
                <button onClick={() => handleExport('json')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                  Export Analysis (JSON)
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => toggleDropdown('edit')} 
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              Edit <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'edit' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button 
                  onClick={() => { handleOpenAddPanel('1'); setOpenDropdown(null); }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Add
                </button>
                <div className="border-t border-gray-200"></div>
                <button 
                  onClick={() => { handleUndo(); setOpenDropdown(null); }} 
                  disabled={historyIndex === 0}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-between"
                >
                  Undo
                  <span className="text-xs text-gray-400">Ctrl+Z</span>
                </button>
                <button 
                  onClick={() => { handleRedo(); setOpenDropdown(null); }} 
                  disabled={historyIndex === history.length - 1}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-between"
                >
                  Redo
                  <span className="text-xs text-gray-400">Ctrl+Y</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSettings(true)} 
            className="text-gray-700 hover:text-gray-900"
          >
            Settings
          </button>

          <div className="relative">
            <button 
              onClick={() => toggleDropdown('view')} 
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              View <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'view' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Zoom</div>
                {[10, 25, 50, 75, 100, 125, 150, 200].map(level => (
                  <button 
                    key={level}
                    onClick={() => handleZoomLevel(level)} 
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${zoom === level ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    {level}%
                  </button>
                ))}
                <div className="border-t border-gray-200"></div>
                <button 
                  onClick={() => { setShowJsonModal(true); setOpenDropdown(null); }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Show JSON
                </button>
                <button 
                  onClick={() => { setShowCostCalculator(true); setOpenDropdown(null); }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Cost Calculator
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => toggleDropdown('help')} 
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              Help <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'help' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Coming soon...
                </div>
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex-1 overflow-hidden relative" 
          style={{ backgroundColor: '#F0F0F0', cursor: isDragging ? 'grabbing' : 'grab' }}
          onClick={() => setOpenDropdown(null)}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          <div 
            className="absolute top-6 left-6 z-10 flex flex-col gap-3" 
            style={{ pointerEvents: 'auto' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3 items-center">
              <div className="flex bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                <button 
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  title="Undo"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600">
                    <path d="M5 10h10M5 10l3-3M5 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 5v3a2 2 0 01-2 2H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="w-px bg-gray-300"></div>
                <button 
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  title="Redo"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600">
                    <path d="M15 10H5M15 10l-3-3M15 10l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5v3a2 2 0 002 2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="flex bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                <button 
                  onClick={handleZoomIn}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Zoom In"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-px bg-gray-300"></div>
                <button 
                  onClick={handleZoomOut}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Zoom Out"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600">
                    <path d="M5 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="text-sm font-medium text-gray-700 px-2">
                {zoom}%
              </div>
            </div>
          </div>

          <div className="absolute inset-0 p-20" style={{ pointerEvents: 'none' }}>
            <div 
              className="org-chart-container"
              style={{ 
                transform: `scale(${zoom / 100}) translate(${panOffset.x / (zoom / 100)}px, ${panOffset.y / (zoom / 100)}px)`, 
                transformOrigin: 'top center',
                pointerEvents: 'auto'
              }}
            >
              <div className="relative" style={{ minHeight: '800px', width: '100%' }}>
                {rootNodes.map(node => renderNode(node, 0, { x: 600, y: 20 }))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Calculator Modal */}
      {showCostCalculator && (() => {
        const costs = calculateCosts();
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCostCalculator(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">HubSpot Cost Calculator</h2>
                </div>
                <button onClick={() => setShowCostCalculator(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="text-sm font-semibold text-blue-900 mb-2">Account Configuration</div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>Core Seats: {accountHubs.coreSeats}</div>
                    {accountHubs.salesHub.enabled && (
                      <div>Sales Hub: {accountHubs.salesHub.tier}</div>
                    )}
                    {accountHubs.marketingHub.enabled && (
                      <div>Marketing Hub: {accountHubs.marketingHub.tier}</div>
                    )}
                    {accountHubs.serviceHub.enabled && (
                      <div>Service Hub: {accountHubs.serviceHub.tier}</div>
                    )}
                    {accountHubs.commerceHub.enabled && (
                      <div>Commerce Hub: {accountHubs.commerceHub.tier}</div>
                    )}
                    {accountHubs.dataHub.enabled && (
                      <div>Data Hub: {accountHubs.dataHub.tier}</div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">User Assignments & Costs</h3>
                  <div className="space-y-2">
                    {costs.breakdown.coreSeats.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            Core Seats ({accountHubs.coreSeats})
                          </div>
                          <div className="text-xs text-gray-500">
                            {costs.breakdown.coreSeats.count} users × ${costs.breakdown.coreSeats.price}/mo
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          ${costs.breakdown.coreSeats.total.toLocaleString()}/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.salesHub.enabled && costs.breakdown.salesHub.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded border border-emerald-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-emerald-900">
                            Sales Hub ({accountHubs.salesHub.tier})
                          </div>
                          <div className="text-xs text-emerald-700">
                            {costs.breakdown.salesHub.count} users × ${costs.breakdown.salesHub.price}/mo
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-emerald-900">
                          ${costs.breakdown.salesHub.total.toLocaleString()}/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.marketingHub.enabled && costs.breakdown.marketingHub.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-orange-900">
                            Marketing Hub ({accountHubs.marketingHub.tier})
                          </div>
                          <div className="text-xs text-orange-700">
                            {costs.breakdown.marketingHub.count} users × ${costs.breakdown.marketingHub.price}/mo
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-orange-900">
                          ${costs.breakdown.marketingHub.total.toLocaleString()}/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.serviceHub.enabled && costs.breakdown.serviceHub.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-purple-900">
                            Service Hub ({accountHubs.serviceHub.tier})
                          </div>
                          <div className="text-xs text-purple-700">
                            {costs.breakdown.serviceHub.count} users × ${costs.breakdown.serviceHub.price}/mo
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-purple-900">
                          ${costs.breakdown.serviceHub.total.toLocaleString()}/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.commerceHub.enabled && costs.breakdown.commerceHub.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded border border-amber-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-amber-900">
                            Commerce Hub ({accountHubs.commerceHub.tier})
                          </div>
                          <div className="text-xs text-amber-700">
                            {costs.breakdown.commerceHub.count} users × ${costs.breakdown.commerceHub.price}/mo
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-amber-900">
                          ${costs.breakdown.commerceHub.total.toLocaleString()}/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.dataHub.enabled && costs.breakdown.dataHub.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-indigo-50 rounded border border-indigo-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-indigo-900">
                            Data Hub ({accountHubs.dataHub.tier})
                          </div>
                          <div className="text-xs text-indigo-700">
                            {costs.breakdown.dataHub.count} users × ${costs.breakdown.dataHub.price}/mo
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-indigo-900">
                          ${costs.breakdown.dataHub.total.toLocaleString()}/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.viewOnly.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">
                            View-Only Users
                          </div>
                          <div className="text-xs text-slate-500">
                            {costs.breakdown.viewOnly.count} users (FREE)
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          $0/mo
                        </div>
                      </div>
                    )}

                    {costs.breakdown.partnerSeat.count > 0 && (
                      <div className="flex items-center justify-between p-3 bg-cyan-50 rounded border border-cyan-200">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-cyan-900">
                            Partner Seats
                          </div>
                          <div className="text-xs text-cyan-700">
                            {costs.breakdown.partnerSeat.count} users (FREE - SolarInbound)
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          $0/mo
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Cost Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Monthly Cost</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${costs.totalMonthlyCost.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Annual Cost</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${costs.totalAnnualCost.toLocaleString()}/yr
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-sm text-gray-600">
                        One-Time Onboarding Fee ({costs.tier})
                      </span>
                      <span className="text-lg font-semibold text-orange-600">
                        ${costs.onboardingFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                      <span className="text-base font-semibold text-gray-800">
                        Total First Year Cost
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ${costs.totalFirstYearCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-yellow-900 mb-1">Note</div>
                  <div className="text-xs text-yellow-800">
                    This is an estimate based on standard HubSpot pricing. Actual costs may vary based on add-ons, marketing contacts, and any negotiated discounts. Contact a HubSpot representative for a detailed quote.
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                <button 
                  onClick={() => setShowCostCalculator(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Export Success Modal */}
      {showExportSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowExportSuccess(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Export Successful!</h2>
              <button onClick={() => setShowExportSuccess(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Copy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-800">Copied to Clipboard</div>
                  <div className="text-sm text-gray-600">Your org chart analysis is ready</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-blue-900 mb-2">Next Steps:</div>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Open your email application</li>
                  <li>Paste (Cmd+V or Ctrl+V) the data into your email</li>
                  <li>Send it to your representative at SolarInbound</li>
                </ol>
              </div>
              <div className="text-xs text-gray-500">
                The JSON data has been copied to your clipboard and includes your complete org chart, license assignments, and cost analysis.
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setShowExportSuccess(false)}
                className="px-6 py-2.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-900"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Dialog */}
      {showWelcomeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Welcome to HubSpot Org Chart</h2>
              <p className="text-sm text-gray-600 mt-1">Let's get started by setting up your organization</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input 
                type="text" 
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartNew();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Enter your company name"
                autoFocus
              />
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleStartNew}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200">
                      <Plus className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-800">Start New</div>
                      <div className="text-sm text-gray-500">Create a blank org chart from scratch</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleWelcomeTemplate}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                        <path d="M4 4h4v4H4V4zM10 4h6v2h-6V4zM10 8h6v2h-6V8zM4 10h4v6H4v-6zM10 12h6v2h-6v-2zM10 16h4v2h-4v-2z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-800">Use Template</div>
                      <div className="text-sm text-gray-500">Start with a pre-built org chart template</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-3/4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Choose a Template</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-4">
                <button
                  onClick={() => handleLoadTemplate('solar')}
                  className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-white">
                        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M16 4v4M16 24v4M28 16h-4M8 16H4M25.5 6.5l-2.8 2.8M9.3 22.7l-2.8 2.8M25.5 25.5l-2.8-2.8M9.3 9.3L6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-800 mb-2">Solar - Enterprise Solar Installer</div>
                      <div className="text-sm text-gray-600 mb-3">
                        Comprehensive org chart for solar installation companies with Chairman, C-suite executives, and organized teams. Includes HubSpot hub access recommendations.
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">63 positions</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">6 C-suite executives</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">Full HubSpot Setup</span>
                      </div>
                    </div>
                  </div>
                </button>

                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <div className="text-sm text-gray-500">More templates coming soon...</div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Name Modal */}
      {showCompanyNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCompanyNameModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Edit Company Name</h2>
              <button onClick={() => setShowCompanyNameModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input 
                type="text" 
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCompanyName();
                  if (e.key === 'Escape') handleCancelCompanyName();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Enter company name"
                autoFocus
              />
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button 
                onClick={handleCancelCompanyName}
                className="px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCompanyName}
                className="px-6 py-2.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Chart Confirmation Modal */}
      {showNewChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowNewChartModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Create New Chart</h2>
              <button onClick={() => setShowNewChartModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-2">Are you sure?</p>
              <p className="text-sm text-gray-600">You will lose your progress and start fresh.</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button 
                onClick={() => setShowNewChartModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmNewChart}
                className="px-6 py-2.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
              >
                Create New Chart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Modal */}
      {showJsonModal && (() => {
        const costs = calculateCosts();
        const exportData = {
          companyName: companyName,
          accountConfiguration: accountHubs,
          nodes: nodes,
          costAnalysis: costs,
          summary: {
            totalUsers: Object.values(nodes).filter(n => n.type === 'person').length,
            totalPaidUsers: Object.values(nodes).filter(n => 
              n.type === 'person' && n.hubAccess && !n.hubAccess.viewOnly
            ).length,
            totalViewOnlyUsers: Object.values(nodes).filter(n => 
              n.type === 'person' && n.hubAccess?.viewOnly
            ).length,
            totalTeams: Object.values(nodes).filter(n => n.type === 'branch').length,
            recommendedTier: costs.tier,
            estimatedMonthlyCost: costs.totalMonthlyCost,
            estimatedAnnualCost: costs.totalAnnualCost,
            oneTimeOnboardingFee: costs.onboardingFee,
            totalFirstYearCost: costs.totalFirstYearCost
          },
          hubsEnabled: {
            salesHub: accountHubs.salesHub.enabled,
            marketingHub: accountHubs.marketingHub.enabled,
            serviceHub: accountHubs.serviceHub.enabled,
            commerceHub: accountHubs.commerceHub.enabled,
            dataHub: accountHubs.dataHub.enabled
          }
        };
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowJsonModal(false)}>
            <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-4xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">HubSpot Org Chart Analysis (JSON)</h2>
                <button onClick={() => setShowJsonModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <pre className="bg-gray-50 p-4 rounded text-sm font-mono overflow-auto">
                  {JSON.stringify(exportData, null, 2)}
                </pre>
              </div>
              <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
                  }}
                  className="px-6 py-2.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-900"
                >
                  Copy to Clipboard
                </button>
                <button 
                  onClick={() => setShowJsonModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Settings Panel */}
      <div 
        className={`w-96 bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 ${
          showSettings ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 20 }}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              HubSpot Account Configuration
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Configure which Hubs your account will use and at what tier. All users assigned to a hub will have access to that tier's features.
            </p>
            
            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Core Seats Tier (Required)
              </label>
              <select 
                value={accountHubs.coreSeats}
                onChange={(e) => setAccountHubs({...accountHubs, coreSeats: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="Starter">Starter - $20/user/month</option>
                <option value="Professional">Professional - $50/user/month</option>
                <option value="Enterprise">Enterprise (Recommended) - $75/user/month</option>
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Basic CRM access for all paid users
              </div>
            </div>

            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Sales Hub</label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountHubs.salesHub.enabled}
                    onChange={(e) => setAccountHubs({
                      ...accountHubs, 
                      salesHub: {...accountHubs.salesHub, enabled: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-600">Enable</span>
                </label>
              </div>
              {accountHubs.salesHub.enabled && (
                <select 
                  value={accountHubs.salesHub.tier}
                  onChange={(e) => setAccountHubs({
                    ...accountHubs, 
                    salesHub: {...accountHubs.salesHub, tier: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Professional">Professional - $100/user/month</option>
                  <option value="Enterprise">Enterprise (Recommended) - $150/user/month</option>
                </select>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Advanced sales features (forecasting, sequences, playbooks)
              </div>
            </div>

            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Marketing Hub</label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountHubs.marketingHub.enabled}
                    onChange={(e) => setAccountHubs({
                      ...accountHubs, 
                      marketingHub: {...accountHubs.marketingHub, enabled: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-600">Enable</span>
                </label>
              </div>
              {accountHubs.marketingHub.enabled && (
                <select 
                  value={accountHubs.marketingHub.tier}
                  onChange={(e) => setAccountHubs({
                    ...accountHubs, 
                    marketingHub: {...accountHubs.marketingHub, tier: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Professional">Professional - $100/user/month</option>
                  <option value="Enterprise">Enterprise (Recommended) - $150/user/month</option>
                </select>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Marketing automation, email campaigns, landing pages
              </div>
            </div>

            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Service Hub</label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountHubs.serviceHub.enabled}
                    onChange={(e) => setAccountHubs({
                      ...accountHubs, 
                      serviceHub: {...accountHubs.serviceHub, enabled: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-600">Enable</span>
                </label>
              </div>
              {accountHubs.serviceHub.enabled && (
                <select 
                  value={accountHubs.serviceHub.tier}
                  onChange={(e) => setAccountHubs({
                    ...accountHubs, 
                    serviceHub: {...accountHubs.serviceHub, tier: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Professional">Professional - $100/user/month</option>
                  <option value="Enterprise">Enterprise (Recommended) - $130/user/month</option>
                </select>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Customer support, ticketing, knowledge base
              </div>
            </div>

            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Commerce Hub</label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountHubs.commerceHub.enabled}
                    onChange={(e) => setAccountHubs({
                      ...accountHubs, 
                      commerceHub: {...accountHubs.commerceHub, enabled: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-600">Enable</span>
                </label>
              </div>
              {accountHubs.commerceHub.enabled && (
                <select 
                  value={accountHubs.commerceHub.tier}
                  onChange={(e) => setAccountHubs({
                    ...accountHubs, 
                    commerceHub: {...accountHubs.commerceHub, tier: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Professional">Professional - $85/user/month</option>
                  <option value="Enterprise">Enterprise (Recommended) - $140/user/month</option>
                </select>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Quotes, payments, invoicing, subscriptions
              </div>
            </div>

            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Data Hub</label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountHubs.dataHub.enabled}
                    onChange={(e) => setAccountHubs({
                      ...accountHubs, 
                      dataHub: {...accountHubs.dataHub, enabled: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-600">Enable</span>
                </label>
              </div>
              {accountHubs.dataHub.enabled && (
                <select 
                  value={accountHubs.dataHub.tier}
                  onChange={(e) => setAccountHubs({
                    ...accountHubs, 
                    dataHub: {...accountHubs.dataHub, tier: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Professional">Professional - $50/user/month</option>
                  <option value="Enterprise">Enterprise (Recommended) - $75/user/month</option>
                </select>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Data sync, quality, and management
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <div className="text-xs font-semibold text-blue-900 mb-1">
                💡 SolarInbound Recommendation
              </div>
              <div className="text-xs text-blue-700">
                We recommend Enterprise tier for all Hubs to maximize features and scalability for solar installers.
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Users</h3>
            <p className="text-sm text-gray-500 mb-4">All people in your org chart</p>
            
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {Object.values(nodes)
                .filter(node => node.type === 'person')
                .map(node => (
                  <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{node.name}</div>
                      {node.hubAccess && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {node.hubAccess.viewOnly && <span className="text-xs text-gray-600">View-Only</span>}
                          {node.hubAccess.coreSeat && <span className="text-xs text-blue-600">Core</span>}
                          {node.hubAccess.salesHub && <span className="text-xs text-green-600">Sales</span>}
                          {node.hubAccess.marketingHub && <span className="text-xs text-orange-600">Marketing</span>}
                          {node.hubAccess.serviceHub && <span className="text-xs text-purple-600">Service</span>}
                          {node.hubAccess.commerceHub && <span className="text-xs text-yellow-600">Commerce</span>}
                          {node.hubAccess.dataHub && <span className="text-xs text-indigo-600">Data</span>}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteNode(node.id)}
                      className="text-gray-400 hover:text-red-600 ml-2"
                      disabled={!node.parentId}
                      title={!node.parentId ? "Cannot delete root node" : "Delete user"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
            
            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800">
              + Add User
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Roles</h3>
            <p className="text-sm text-gray-500 mb-4">Job titles used in your organization</p>
            
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {getUniqueRoles().map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-700">{role}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800">
              + Add Role
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Teams</h3>
            <p className="text-sm text-gray-500 mb-4">Organizational teams/departments</p>
            
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {Object.values(nodes)
                .filter(node => node.type === 'branch')
                .map(node => (
                  <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm text-gray-700">{node.team}</span>
                    <button 
                      onClick={() => handleDeleteNode(node.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
            
            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800">
              + Add Team
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">HubSpot Permission Sets</h3>
            <p className="text-sm text-gray-500 mb-4">Access levels for HubSpot users</p>
            
            <div className="space-y-2 mb-4">
              {getUniquePermissions().map((permission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-700">{permission}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800">
              + Add Permission Set
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button 
            onClick={() => setShowSettings(false)}
            className="flex-1 px-6 py-2.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>

      {/* Add Panel */}
      <div 
        className={`w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          showAddPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 20 }}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add Node</h2>
          <button onClick={() => setShowAddPanel(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <p className="text-sm text-gray-600 mb-6">Select the type of node you want to add:</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleAddChild(addParentId)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M5 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-800">Add User</div>
                  <div className="text-sm text-gray-500">Add an individual person to the org chart</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAddBranch(addParentId)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-800">Add Team</div>
                  <div className="text-sm text-gray-500">Add a branch or team node</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button 
            onClick={() => setShowAddPanel(false)}
            className="w-full px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Edit Panel */}
      <div 
        className={`w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          showEditPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 20 }}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Node</h2>
          <button onClick={() => setShowEditPanel(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {editForm.type === 'person' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                  >
                    <option value="">-- Select Role --</option>
                    {getUniqueRoles().map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
                  <select
                    value={editForm.personTeam || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, personTeam: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                  >
                    <option value="">-- Select Team --</option>
                    {getUniqueTeams().map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HubSpot Hub Access
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Select which HubSpot Hubs this user needs access to. The features they receive depend on the account's tier configuration.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.hubAccess?.partnerSeat || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: {
                                coreSeat: false,
                                salesHub: false,
                                marketingHub: false,
                                serviceHub: false,
                                commerceHub: false,
                                dataHub: false,
                                viewOnly: false,
                                partnerSeat: true
                              }
                            }));
                          } else {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { ...prev.hubAccess, partnerSeat: false }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Partner Seat</span>
                        <span className="ml-2 text-xs text-teal-600 font-semibold">FREE</span>
                        <div className="text-xs text-gray-500">For SolarInbound employees with CRM access</div>
                      </div>
                    </label>

                    <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.hubAccess?.viewOnly || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: {
                                coreSeat: false,
                                salesHub: false,
                                marketingHub: false,
                                serviceHub: false,
                                commerceHub: false,
                                dataHub: false,
                                viewOnly: true,
                                partnerSeat: false
                              }
                            }));
                          } else {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { ...prev.hubAccess, viewOnly: false }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">View-Only Access</span>
                        <span className="ml-2 text-xs text-green-600 font-semibold">FREE</span>
                        <div className="text-xs text-gray-500">Read-only access to CRM data</div>
                      </div>
                    </label>

                    <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.hubAccess?.coreSeat || false}
                        onChange={(e) => {
                          setEditForm(prev => ({
                            ...prev,
                            hubAccess: { 
                              ...prev.hubAccess, 
                              coreSeat: e.target.checked,
                              viewOnly: false,
                              partnerSeat: false
                            }
                          }));
                        }}
                        disabled={editForm.hubAccess?.viewOnly || editForm.hubAccess?.partnerSeat}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Core Seat (Basic CRM)</span>
                        <div className="text-xs text-gray-500">
                          ${accountHubs.coreSeats === 'Starter' ? '20' : accountHubs.coreSeats === 'Professional' ? '50' : '75'}/month
                        </div>
                      </div>
                    </label>

                    {accountHubs.salesHub.enabled && (
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.hubAccess?.salesHub || false}
                          onChange={(e) => {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { 
                                ...prev.hubAccess, 
                                salesHub: e.target.checked,
                                viewOnly: false,
                                partnerSeat: false
                              }
                            }));
                          }}
                          disabled={editForm.hubAccess?.viewOnly || editForm.hubAccess?.partnerSeat}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Sales Hub</span>
                          <span className="ml-2 text-xs text-blue-600">
                            {accountHubs.salesHub.tier}
                          </span>
                          <div className="text-xs text-gray-500">
                            ${accountHubs.salesHub.tier === 'Professional' ? '100' : '150'}/month
                          </div>
                        </div>
                      </label>
                    )}

                    {accountHubs.marketingHub.enabled && (
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.hubAccess?.marketingHub || false}
                          onChange={(e) => {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { 
                                ...prev.hubAccess, 
                                marketingHub: e.target.checked,
                                viewOnly: false,
                                partnerSeat: false
                              }
                            }));
                          }}
                          disabled={editForm.hubAccess?.viewOnly || editForm.hubAccess?.partnerSeat}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Marketing Hub</span>
                          <span className="ml-2 text-xs text-blue-600">
                            {accountHubs.marketingHub.tier}
                          </span>
                          <div className="text-xs text-gray-500">
                            ${accountHubs.marketingHub.tier === 'Professional' ? '100' : '150'}/month
                          </div>
                        </div>
                      </label>
                    )}

                    {accountHubs.serviceHub.enabled && (
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.hubAccess?.serviceHub || false}
                          onChange={(e) => {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { 
                                ...prev.hubAccess, 
                                serviceHub: e.target.checked,
                                viewOnly: false,
                                partnerSeat: false
                              }
                            }));
                          }}
                          disabled={editForm.hubAccess?.viewOnly || editForm.hubAccess?.partnerSeat}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Service Hub</span>
                          <span className="ml-2 text-xs text-blue-600">
                            {accountHubs.serviceHub.tier}
                          </span>
                          <div className="text-xs text-gray-500">
                            ${accountHubs.serviceHub.tier === 'Professional' ? '100' : '130'}/month
                          </div>
                        </div>
                      </label>
                    )}

                    {accountHubs.commerceHub.enabled && (
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.hubAccess?.commerceHub || false}
                          onChange={(e) => {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { 
                                ...prev.hubAccess, 
                                commerceHub: e.target.checked,
                                viewOnly: false,
                                partnerSeat: false
                              }
                            }));
                          }}
                          disabled={editForm.hubAccess?.viewOnly || editForm.hubAccess?.partnerSeat}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Commerce Hub</span>
                          <span className="ml-2 text-xs text-blue-600">
                            {accountHubs.commerceHub.tier}
                          </span>
                          <div className="text-xs text-gray-500">
                            ${accountHubs.commerceHub.tier === 'Professional' ? '85' : '140'}/month
                          </div>
                        </div>
                      </label>
                    )}

                    {accountHubs.dataHub.enabled && (
                      <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.hubAccess?.dataHub || false}
                          onChange={(e) => {
                            setEditForm(prev => ({
                              ...prev,
                              hubAccess: { 
                                ...prev.hubAccess, 
                                dataHub: e.target.checked,
                                viewOnly: false,
                                partnerSeat: false
                              }
                            }));
                          }}
                          disabled={editForm.hubAccess?.viewOnly || editForm.hubAccess?.partnerSeat}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Data Hub</span>
                          <span className="ml-2 text-xs text-blue-600">
                            {accountHubs.dataHub.tier}
                          </span>
                          <div className="text-xs text-gray-500">
                            ${accountHubs.dataHub.tier === 'Professional' ? '50' : '75'}/month
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HubSpot Permission Set</label>
                  <select
                    value={editForm.permission || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, permission: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                  >
                    <option value="">-- Select Permission --</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales Rep">Sales Rep</option>
                    <option value="Customer Success Manager">Customer Success Manager</option>
                    <option value="Support Rep">Support Rep</option>
                    <option value="Marketing User">Marketing User</option>
                    <option value="View-Only User">View-Only User</option>
                  </select>
                </div>
              </>
            )}
            
            {editForm.type === 'branch' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                <select
                  value={editForm.team || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, team: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                >
                  <option value="">-- Select Team --</option>
                  {getUniqueTeams().map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                <div className="mt-2">
                  <input 
                    type="text" 
                    placeholder="Or type new team name"
                    value={editForm.team || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, team: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button 
            onClick={handleSaveEdit}
            className="flex-1 px-6 py-2.5 bg-black text-white rounded text-sm font-medium hover:bg-gray-900"
          >
            Save
          </button>
          <button 
            onClick={() => setShowEditPanel(false)}
            className="px-6 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}