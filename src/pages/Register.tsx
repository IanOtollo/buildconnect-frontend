import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

type UserType = 'client' | 'contractor';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
  });

  const [contractorData, setContractorData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    business_name: '',
    bio: '',
    years_of_experience: '',
    hourly_rate: '',
    location: '',
  });

  const [documents, setDocuments] = useState({
    id_document: null as File | null,
    kra_pin_document: null as File | null,
    work_permit_document: null as File | null,
  });

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.registerClient(clientData);
      setSuccess('Registration successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContractorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!documents.id_document || !documents.kra_pin_document) {
      setError('ID and KRA PIN documents are required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(contractorData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('id_document', documents.id_document);
      formData.append('kra_pin_document', documents.kra_pin_document);
      if (documents.work_permit_document) {
        formData.append('work_permit_document', documents.work_permit_document);
      }

      await authAPI.registerContractor(formData);
      setSuccess('Application submitted! Our AI system is verifying your documents. You will receive an email with the results.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({ ...documents, [field]: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join BuildConnect today</p>
        </div>

        {/* User Type Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`flex-1 py-3 text-center font-medium transition ${
              userType === 'client'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setUserType('client')}
          >
            Client
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition ${
              userType === 'contractor'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setUserType('contractor')}
          >
            Contractor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {userType === 'client' ? (
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              value={clientData.full_name}
              onChange={(e) => setClientData({ ...clientData, full_name: e.target.value })}
              required
            />
            <Input
              type="email"
              label="Email Address"
              value={clientData.email}
              onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              required
            />
            <Input
              type="tel"
              label="Phone Number"
              value={clientData.phone}
              onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              required
              placeholder="0712345678"
            />
            <Input
              type="password"
              label="Password"
              value={clientData.password}
              onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
              required
              helperText="Minimum 8 characters"
            />
            <Input
              type="text"
              label="Address (Optional)"
              value={clientData.address}
              onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
            />
            <Input
              type="text"
              label="City (Optional)"
              value={clientData.city}
              onChange={(e) => setClientData({ ...clientData, city: e.target.value })}
            />
            <Button type="submit" fullWidth loading={loading}>
              Register as Client
            </Button>
          </form>
        ) : (
          <form onSubmit={handleContractorSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              value={contractorData.full_name}
              onChange={(e) => setContractorData({ ...contractorData, full_name: e.target.value })}
              required
            />
            <Input
              type="email"
              label="Email Address"
              value={contractorData.email}
              onChange={(e) => setContractorData({ ...contractorData, email: e.target.value })}
              required
            />
            <Input
              type="tel"
              label="Phone Number"
              value={contractorData.phone}
              onChange={(e) => setContractorData({ ...contractorData, phone: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Password"
              value={contractorData.password}
              onChange={(e) => setContractorData({ ...contractorData, password: e.target.value })}
              required
            />
            <Input
              type="text"
              label="Business Name"
              value={contractorData.business_name}
              onChange={(e) => setContractorData({ ...contractorData, business_name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
                rows={3}
                value={contractorData.bio}
                onChange={(e) => setContractorData({ ...contractorData, bio: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Years of Experience"
                value={contractorData.years_of_experience}
                onChange={(e) => setContractorData({ ...contractorData, years_of_experience: e.target.value })}
                required
                min="0"
              />
              <Input
                type="number"
                label="Hourly Rate (KES)"
                value={contractorData.hourly_rate}
                onChange={(e) => setContractorData({ ...contractorData, hourly_rate: e.target.value })}
                required
                min="0"
              />
            </div>
            <Input
              type="text"
              label="Location"
              value={contractorData.location}
              onChange={(e) => setContractorData({ ...contractorData, location: e.target.value })}
              required
            />
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-4">Required Documents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Document
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'id_document')}
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KRA PIN Document
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'kra_pin_document')}
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Permit (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'work_permit_document')}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Submit Application
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
