import { type Vendor } from '../../types/models';
import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import RadioGroup from '../../components/common/RadioGroup';
import Button from '../../components/common/Button';
import { 
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface VendorFormProps {
  vendor?: Vendor;
  onSubmit: (data: Partial<Vendor>) => void;
  onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSubmit, onCancel }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Vendor>>(vendor || {
    name: '',
    contact_number: '',
    email: '',
    address: '',
    gst_number: '',
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Vendor name is required';
    if (!formData.contact_number?.trim()) newErrors.contact_number = 'Contact number is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.gst_number?.trim()) {
      newErrors.gst_number = 'GST number is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
      newErrors.gst_number = 'Please enter a valid GST number (e.g., 27ABCDE1234F1Z5)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <p className="text-gray-600">
          {vendor ? 'Update vendor information' : 'Add a new vendor to your system'}
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h3>
          <p className="text-sm text-gray-600">Essential vendor details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Vendor Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter vendor/supplier name"
              icon={<BuildingOfficeIcon />}
              helpText="The official business name of the vendor"
            />
          </div>

          <Input
            label="Contact Number"
            name="contact_number"
            type="tel"
            value={formData.contact_number || ''}
            onChange={handleChange}
            error={errors.contact_number}
            placeholder="+1 (555) 123-4567"
            icon={<PhoneIcon />}
            helpText="Primary phone number for this vendor"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={errors.email}
            placeholder="vendor@example.com"
            icon={<EnvelopeIcon />}
            helpText="Primary email for correspondence"
          />
        </div>
      </div>

      {/* Address & Legal Information */}
      <div className="space-y-6">
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Address & Legal</h3>
          <p className="text-sm text-gray-600">Location and tax information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Textarea
              label="Business Address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter complete business address..."
              rows={4}
              helpText="Full business address including city, state, and postal code"
            />
          </div>

          <Input
            label="GST Number"
            name="gst_number"
            value={formData.gst_number || ''}
            onChange={handleChange}
            error={errors.gst_number}
            placeholder="27ABCDE1234F1Z5"
            icon={<IdentificationIcon />}
            helpText="Valid GST registration number"
          />

          <div>
            <RadioGroup
              label="Vendor Status"
              name="is_active"
              value={formData.is_active ?? true}
              onChange={(value) => setFormData(prev => ({ ...prev, is_active: value as boolean }))}
              options={[
                { 
                  value: true, 
                  label: 'Active', 
                  description: 'Vendor can receive new orders' 
                },
                { 
                  value: false, 
                  label: 'Inactive', 
                  description: 'Vendor is temporarily disabled' 
                }
              ]}
              helpText="Active vendors can receive new purchase orders"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full sm:w-auto sm:min-w-[140px]"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {vendor ? 'Update Vendor' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;
