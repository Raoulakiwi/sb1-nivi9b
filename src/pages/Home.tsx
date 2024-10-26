import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block text-white">Web3 Revenue Share Platform</span>
          <span className="block bg-gradient-pulse text-transparent bg-clip-text">Democratizing Business Revenue</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Create, manage, and share revenue streams using blockchain technology. 
          Transform your business into a community-driven enterprise with ERC1155 NFTs.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-pulse hover:opacity-90 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-pulse-gray text-base font-medium rounded-md text-white bg-pulse-gray hover:bg-pulse-gray-light md:py-4 md:text-lg md:px-10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Key Features
        </h2>
        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          <Feature
            title="Revenue Sharing NFTs"
            description="Create ERC1155 tokens representing revenue ownership of your business"
          />
          <Feature
            title="Automated Distribution"
            description="Set up automated revenue distribution to token holders"
          />
          <Feature
            title="Multi-Currency Support"
            description="Support for PLS, DAI, USDT, USDC and custom tokens"
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="pt-6">
      <div className="flow-root bg-pulse-gray rounded-lg px-6 pb-8 h-full">
        <div className="-mt-6">
          <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{title}</h3>
          <p className="mt-5 text-base text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}