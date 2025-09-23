import { type Vendor } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormModal from '../../components/common/FormModal';
import VendorForm from '../../components/forms/VendorForm';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import StatsGrid from '../../components/common/StatsGrid';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import {
  PlusIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

type ViewMode = 'grid' | 'table';
type SortOption = 'name' | 'created_at' | 'email' | 'status';
type StatusFilter = 'all' | 'active' | 'inactive';

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterAndSortVendors();
  }, [vendors, searchQuery, sortBy, statusFilter]);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors/');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortVendors = () => {
    let filtered = [...vendors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contact_number.includes(searchQuery) ||
        vendor.gst_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vendor => 
        statusFilter === 'active' ? vendor.is_active : !vendor.is_active
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'status':
          return Number(b.is_active) - Number(a.is_active);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredVendors(filtered);
  };

  const handleSubmit = async (data: Partial<Vendor>) => {
    try {
      if (selectedVendor) {
        await api.put(`/vendors/${selectedVendor.id}`, data);
      } else {
        await api.post('/vendors/', data);
      }
      fetchVendors();
      setIsModalOpen(false);
      setSelectedVendor(undefined);
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await api.delete(`/vendors/${id}`);
        fetchVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const getStatsCards = () => {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter(v => v.is_active).length;
    const inactiveVendors = totalVendors - activeVendors;

    return [
      {
        name: 'Total Vendors',
        value: totalVendors,
        icon: BuildingOfficeIcon,
        color: 'primary',
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      },
      {
        name: 'Active Vendors',
        value: activeVendors,
        icon: SparklesIcon,
        color: 'success',
        bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      },
      {
        name: 'Inactive Vendors',
        value: inactiveVendors,
        icon: BuildingOfficeIcon,
        color: 'danger',
        bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const statsCards = getStatsCards();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <PageHeader
        title="Vendor Management ✨"
        description={`Manage your supplier network efficiently. ${vendors.length} vendors in your network.`}
        icon={BuildingOfficeIcon}
      />

      {/* Stats Cards */}
      <StatsGrid stats={statsCards} columns={3} />

      {/* Header Actions */}
      <Card padding="md" className="bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-semibold text-gray-900">Vendor Management</h1>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 min-w-[4rem] text-center">
              {filteredVendors.length} vendors
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-blue-600 hover:border-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2 text-white" />
              Add New Vendor
            </button>
            
            <Button variant="outline" icon={<ArrowDownTrayIcon className="h-4 w-4" />}>
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, email, phone, GST number..."
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            options: [
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
            onChange: (value) => setStatusFilter(value as StatusFilter),
            width: "w-full sm:w-32",
          },
          {
            label: "Sort By",
            value: sortBy,
            options: [
              { value: "name", label: "Name" },
              { value: "email", label: "Email" },
              { value: "status", label: "Status" },
              { value: "created_at", label: "Date Created" },
            ],
            onChange: (value) => setSortBy(value as SortOption),
          },
        ]}
      />

      {/* Vendors Display */}
      {filteredVendors.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-500 mb-4">
              {vendors.length === 0 
                ? "You haven't added any vendors yet. Start building your supplier network!" 
                : "Try adjusting your search criteria."
              }
            </p>
            {vendors.length === 0 && (
              <Button
                variant="gold"
                icon={<PlusIcon className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Your First Vendor
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} hover className="relative overflow-hidden card-hover group h-full">
              <div className="p-6 h-full flex flex-col">
                {/* Vendor Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center flex-shrink-0 relative">
                      <BuildingOfficeIcon className="h-6 w-6 text-white drop-shadow-sm" />
                      {/* Status Indicator Dot */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        vendor.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg text-contrast leading-tight mb-1" title={vendor.name}>
                            {vendor.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              vendor.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                vendor.is_active ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              {vendor.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              ID: {vendor.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>

                {/* Vendor Details */}
                <div className="flex-1 mb-4">
                  <div className="space-y-3">
                    {/* Primary Contact Information */}
                    <div className="bg-gray-50/80 rounded-lg p-3 space-y-2">
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <PhoneIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate" title={vendor.contact_number}>
                          {vendor.contact_number}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        <span className="truncate" title={vendor.email}>
                          {vendor.email}
                        </span>
                      </div>
                    </div>
                    
                    {/* Address with Better Layout */}
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="overflow-hidden leading-relaxed" 
                           style={{ 
                             display: '-webkit-box', 
                             WebkitLineClamp: 2, 
                             WebkitBoxOrient: 'vertical' as const 
                           }}
                           title={vendor.address}
                        >
                          {vendor.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Footer with Quick Stats */}
                <div className="pt-3 border-t border-gray-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">GST Number</div>
                      <div className="text-xs font-mono text-gray-700 truncate bg-gray-100 px-2 py-1 rounded" title={vendor.gst_number}>
                        {vendor.gst_number}
                      </div>
                    </div>
                    <div className="ml-3 text-right">
                      <div className="text-xs text-gray-400">Added</div>
                      <div className="text-xs text-gray-600 font-medium">
                        {new Date(vendor.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: new Date(vendor.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors duration-200"
                      title="Edit vendor"
                    >
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors duration-200"
                      title="Delete vendor"
                    >
                      <TrashIcon className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Number</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <BuildingOfficeIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{vendor.name}</div>
                          <div className="md:hidden text-xs text-gray-500 mt-1 truncate">
                            {vendor.email} • {vendor.contact_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="text-sm text-gray-900">{vendor.email}</div>
                      <div className="text-sm text-gray-500">{vendor.contact_number}</div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {vendor.gst_number}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(vendor)}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                          title="Edit vendor"
                        >
                          <PencilIcon className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-red-300 bg-white text-red-700 hover:bg-red-50 hover:border-red-400 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                          title="Delete vendor"
                        >
                          <TrashIcon className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Vendor Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVendor(undefined);
        }}
        title={selectedVendor ? 'Edit Vendor' : 'Add New Vendor'}
        size="xl"
      >
        <VendorForm
          vendor={selectedVendor}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedVendor(undefined);
          }}
        />
      </FormModal>
    </div>
  );
};

export default VendorsPage;
