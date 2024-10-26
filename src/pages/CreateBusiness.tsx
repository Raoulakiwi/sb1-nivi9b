import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAccount, useSignMessage } from 'wagmi';

const SUPPORTED_CURRENCIES = [
  { symbol: 'PLS', name: 'PulseChain', address: null },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
];

export default function CreateBusiness() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { address } = useAccount();
  const { signMessage } = useSignMessage();
  
  const [formData, setFormData] = useState({
    name: '',
    walletAddress: '',
    nftContractAddress: '',
    revenueWalletAddress: '',
    distributionFrequency: 'WEEKLY',
    minBalanceThreshold: '1',
    supportedCurrencies: ['PLS'],
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyWallet = async () => {
    try {
      const message = `Verify wallet ownership for Web3 Revenue Share Platform\nWallet: ${address}`;
      await signMessage({ message });
      setIsVerified(true);
      setFormData(prev => ({ ...prev, walletAddress: address || '' }));
    } catch (error) {
      setError('Failed to verify wallet ownership');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setError('Please verify your wallet ownership first');
      return;
    }

    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create business');
      
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create business');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Create New Business">
        <div className="space-y-8">
          {/* Progress Steps */}
          <div className="flex justify-between">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${
                  s <= step ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                  s <= step ? 'border-indigo-600' : 'border-gray-400'
                }`}>
                  {s}
                </span>
                <span className="ml-2">{
                  s === 1 ? 'Basic Info' :
                  s === 2 ? 'Wallet Setup' :
                  'Distribution Settings'
                }</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.name}
                >
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Wallet Address
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <input
                      type="text"
                      readOnly
                      className="block w-full rounded-md border-gray-300 bg-gray-50"
                      value={address || ''}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyWallet}
                      disabled={isVerified}
                    >
                      {isVerified ? 'Verified' : 'Verify'}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NFT Contract Address (Optional)
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.nftContractAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, nftContractAddress: e.target.value }))}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isVerified}
                >
                  Next
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Distribution Frequency
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.distributionFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, distributionFrequency: e.target.value }))}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Balance Threshold (PLS)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.minBalanceThreshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, minBalanceThreshold: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supported Currencies
                  </label>
                  <div className="mt-2 space-y-2">
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <label key={currency.symbol} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={formData.supportedCurrencies.includes(currency.symbol)}
                          onChange={(e) => {
                            const currencies = e.target.checked
                              ? [...formData.supportedCurrencies, currency.symbol]
                              : formData.supportedCurrencies.filter(c => c !== currency.symbol);
                            setFormData(prev => ({ ...prev, supportedCurrencies: currencies }));
                          }}
                        />
                        <span className="ml-2">{currency.symbol}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit">Create Business</Button>
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
}