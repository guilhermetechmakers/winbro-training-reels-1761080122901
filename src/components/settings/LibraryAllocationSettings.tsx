import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Library, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Settings,
  HardDrive,
  Users,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LibraryAllocationSettingsProps {
  onChange?: () => void;
}

interface MachineModel {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  quota: number;
  used: number;
  status: 'active' | 'inactive' | 'pending';
  assignedCustomers: string[];
  createdAt: string;
}

interface CustomerAllocation {
  id: string;
  name: string;
  organizationId: string;
  machineModels: string[];
  totalQuota: number;
  usedQuota: number;
  status: 'active' | 'trial' | 'suspended';
  lastActivity: string;
}

const LibraryAllocationSettings: React.FC<LibraryAllocationSettingsProps> = ({ onChange }) => {
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    manufacturer: '',
    category: '',
    quota: 100
  });

  const [machineModels, setMachineModels] = useState<MachineModel[]>([
    {
      id: '1',
      name: 'CNC Milling Machine',
      manufacturer: 'Haas Automation',
      category: 'Machining',
      quota: 500,
      used: 234,
      status: 'active',
      assignedCustomers: ['customer-1', 'customer-2'],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Laser Cutting System',
      manufacturer: 'Trumpf',
      category: 'Cutting',
      quota: 300,
      used: 156,
      status: 'active',
      assignedCustomers: ['customer-1', 'customer-3'],
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: '3D Printer',
      manufacturer: 'Stratasys',
      category: 'Additive Manufacturing',
      quota: 200,
      used: 89,
      status: 'active',
      assignedCustomers: ['customer-2'],
      createdAt: '2024-01-03T00:00:00Z'
    }
  ]);

  const [customerAllocations, setCustomerAllocations] = useState<CustomerAllocation[]>([
    {
      id: 'customer-1',
      name: 'Acme Manufacturing',
      organizationId: 'org-1',
      machineModels: ['1', '2'],
      totalQuota: 800,
      usedQuota: 390,
      status: 'active',
      lastActivity: '2024-01-07T14:30:00Z'
    },
    {
      id: 'customer-2',
      name: 'TechCorp Industries',
      organizationId: 'org-2',
      machineModels: ['1', '3'],
      totalQuota: 700,
      usedQuota: 323,
      status: 'active',
      lastActivity: '2024-01-07T11:20:00Z'
    },
    {
      id: 'customer-3',
      name: 'Global Solutions Ltd',
      organizationId: 'org-3',
      machineModels: ['2'],
      totalQuota: 300,
      usedQuota: 156,
      status: 'trial',
      lastActivity: '2024-01-06T16:45:00Z'
    }
  ]);

  const handleAddModel = () => {
    if (!newModel.name || !newModel.manufacturer || !newModel.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const model: MachineModel = {
      id: Date.now().toString(),
      name: newModel.name,
      manufacturer: newModel.manufacturer,
      category: newModel.category,
      quota: newModel.quota,
      used: 0,
      status: 'active',
      assignedCustomers: [],
      createdAt: new Date().toISOString()
    };

    setMachineModels(prev => [...prev, model]);
    setNewModel({ name: '', manufacturer: '', category: '', quota: 100 });
    setIsAddingModel(false);
    onChange?.();
    toast.success('Machine model added successfully');
  };


  const handleDeleteModel = (modelId: string) => {
    if (window.confirm('Are you sure you want to delete this machine model?')) {
      setMachineModels(prev => prev.filter(model => model.id !== modelId));
      onChange?.();
      toast.success('Machine model deleted successfully');
    }
  };

  const handleToggleCustomerAllocation = (customerId: string, modelId: string) => {
    setCustomerAllocations(prev =>
      prev.map(customer => {
        if (customer.id === customerId) {
          const hasModel = customer.machineModels.includes(modelId);
          return {
            ...customer,
            machineModels: hasModel
              ? customer.machineModels.filter(id => id !== modelId)
              : [...customer.machineModels, modelId]
          };
        }
        return customer;
      })
    );
    onChange?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'pending':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'trial':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'suspended':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getQuotaUsageColor = (used: number, quota: number) => {
    const percentage = (used / quota) * 100;
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-secondary';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      {/* Machine Models Management */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Library className="h-5 w-5 text-primary" />
              <span>Machine Models & Quotas</span>
            </CardTitle>
            <Button
              onClick={() => setIsAddingModel(true)}
              className="hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Model Form */}
          {isAddingModel && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Add New Machine Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-name">Model Name *</Label>
                    <Input
                      id="model-name"
                      value={newModel.name}
                      onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., CNC Milling Machine"
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-manufacturer">Manufacturer *</Label>
                    <Input
                      id="model-manufacturer"
                      value={newModel.manufacturer}
                      onChange={(e) => setNewModel(prev => ({ ...prev, manufacturer: e.target.value }))}
                      placeholder="e.g., Haas Automation"
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-category">Category *</Label>
                    <Input
                      id="model-category"
                      value={newModel.category}
                      onChange={(e) => setNewModel(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Machining, Cutting"
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-quota">Default Quota</Label>
                    <Input
                      id="model-quota"
                      type="number"
                      value={newModel.quota}
                      onChange={(e) => setNewModel(prev => ({ ...prev, quota: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddModel} className="hover:scale-105 transition-all duration-200">
                    <Save className="h-4 w-4 mr-2" />
                    Add Model
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingModel(false);
                      setNewModel({ name: '', manufacturer: '', category: '', quota: 100 });
                    }}
                    className="hover:bg-error/10 hover:border-error transition-all duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Machine Models List */}
          <div className="space-y-4">
            {machineModels.map((model) => (
              <Card key={model.id} className="hover:shadow-elevation-200 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{model.name}</h3>
                        <Badge className={getStatusColor(model.status)}>
                          {model.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>{model.manufacturer}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Library className="h-4 w-4" />
                          <span>{model.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{model.assignedCustomers.length} customers</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Storage Usage</span>
                          <span className={getQuotaUsageColor(model.used, model.quota)}>
                            {model.used} / {model.quota} GB
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              getQuotaUsageColor(model.used, model.quota) === 'text-error' && "bg-error",
                              getQuotaUsageColor(model.used, model.quota) === 'text-secondary' && "bg-secondary",
                              getQuotaUsageColor(model.used, model.quota) === 'text-success' && "bg-success"
                            )}
                            style={{ width: `${Math.min((model.used / model.quota) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Edit model:', model.id)}
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteModel(model.id)}
                        className="hover:bg-error/10 hover:border-error transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Allocations */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Customer Allocations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerAllocations.map((customer) => (
            <Card key={customer.id} className="hover:shadow-elevation-200 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <Badge className={getCustomerStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last activity: {new Date(customer.lastActivity).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Storage Usage</span>
                      <span className={getQuotaUsageColor(customer.usedQuota, customer.totalQuota)}>
                        {customer.usedQuota} / {customer.totalQuota} GB
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          getQuotaUsageColor(customer.usedQuota, customer.totalQuota) === 'text-error' && "bg-error",
                          getQuotaUsageColor(customer.usedQuota, customer.totalQuota) === 'text-secondary' && "bg-secondary",
                          getQuotaUsageColor(customer.usedQuota, customer.totalQuota) === 'text-success' && "bg-success"
                        )}
                        style={{ width: `${Math.min((customer.usedQuota / customer.totalQuota) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>{customer.machineModels.length} machine models assigned</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Assigned Machine Models</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {machineModels.map((model) => (
                      <div key={model.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${customer.id}-${model.id}`}
                          checked={customer.machineModels.includes(model.id)}
                          onCheckedChange={() => handleToggleCustomerAllocation(customer.id, model.id)}
                        />
                        <Label
                          htmlFor={`${customer.id}-${model.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {model.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Allocation Summary */}
      <Card className="shadow-elevation-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <span>Allocation Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary mb-1">
                {machineModels.length}
              </div>
              <div className="text-sm text-muted-foreground">Machine Models</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-secondary mb-1">
                {customerAllocations.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Customers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-success mb-1">
                {machineModels.reduce((sum, model) => sum + model.quota, 0)} GB
              </div>
              <div className="text-sm text-muted-foreground">Total Quota</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryAllocationSettings;