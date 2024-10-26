import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { formatEther } from 'ethers';

interface Business {
  id: string;
  name: string;
  walletAddress: string;
  nftContractAddress: string | null;
  revenueWalletAddress: string;
  distributionFrequency: string;
  minBalanceThreshold: string;
  supportedCurrencies: string;
  balance?: string;
}

export default function BusinessDashboard() {
  const { userId } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, [userId]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/businesses`);
      const data = await response.json();
      
      // Fetch balances for each business
      const businessesWithBalances = await Promise.all(
        data.map(async (business: Business) => {
          const balance = await fetchBalance(business.revenueWalletAddress);
          return { ...business, balance };
        })
      );
      
      setBusinesses(businessesWithBalances);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider('https://rpc.pulsechain.com');
      const balance = await provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return '0';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Your Businesses</h1>
        <Link to="/create-business">
          <Button variant="primary">Create New Business</Button>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No businesses yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first business
            </p>
            <div className="mt-6">
              <Link to="/create-business">
                <Button variant="primary">Create Business</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Balance: {business.balance} PLS
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distribution Frequency:</span>
                    <span className="text-gray-900">{business.distributionFrequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min Balance Threshold:</span>
                    <span className="text-gray-900">{business.minBalanceThreshold} PLS</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {/* TODO: Implement business details view */}}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}