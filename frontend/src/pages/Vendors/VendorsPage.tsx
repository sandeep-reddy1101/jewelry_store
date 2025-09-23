import { type Vendor } from '../../types/models';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormModal from '../../components/common/FormModal';
import VendorForm from '../../components/forms/VendorForm';
import Spinner from '../../components/common/Spinner';
import {
  PlusIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchQuery]);

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

  const filterVendors = () => {
    let filtered = [...vendors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contact_number.includes(searchQuery) ||
        vendor.gst_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
      { title: 'Total Vendors', value: totalVendors, color: 'primary' },
      { title: 'Active Vendors', value: activeVendors, color: 'green' },
      { title: 'Inactive Vendors', value: inactiveVendors, color: 'red' },
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} padding="md" shadow="elegant" className="text-center">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className={`text-2xl font-bold ${
                stat.color === 'primary' ? 'text-primary-600' :
                stat.color === 'green' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Header Actions */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-semibold text-gray-900">Vendors</h1>
            <span className="text-sm text-gray-500">({filteredVendors.length} vendors)</span>
          </div>

          <Button
            variant="primary"
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Vendor
          </Button>
        </div>
      </Card>

      {/* Search */}
      <Card padding="md">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Start by adding your first vendor.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} padding="lg" shadow="elegant" className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Vendor Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        vendor.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit vendor"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete vendor"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {vendor.contact_number}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {vendor.email}
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{vendor.address}</span>
                  </div>
                </div>

                {/* GST Number */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">GST Number</div>
                  <div className="text-sm font-mono text-gray-900">{vendor.gst_number}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
