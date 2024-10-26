import { ethers } from 'ethers';

const ERC1155_ABI = [
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
  'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])',
  'function setApprovalForAll(address operator, bool approved)',
  'function isApprovedForAll(address account, address operator) view returns (bool)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
];

export async function deployERC1155Contract(
  name: string,
  symbol: string,
  signer: ethers.Signer
) {
  const factory = new ethers.ContractFactory(ERC1155_ABI, '', signer);
  const contract = await factory.deploy(name, symbol);
  await contract.deployed();
  return contract;
}

export async function distributeRevenue(
  contractAddress: string,
  tokenId: number,
  amount: string,
  signer: ethers.Signer
) {
  const contract = new ethers.Contract(contractAddress, ERC1155_ABI, signer);
  const holders = await getTokenHolders(contract, tokenId);
  
  // Calculate shares based on token balance
  const totalSupply = await getTotalSupply(contract, tokenId);
  const distribution = holders.map(holder => ({
    address: holder,
    amount: (await contract.balanceOf(holder, tokenId))
      .mul(ethers.utils.parseEther(amount))
      .div(totalSupply),
  }));

  // Send transactions
  const tx = await contract.distributeRevenue(tokenId, distribution);
  await tx.wait();
  return tx;
}

async function getTokenHolders(contract: ethers.Contract, tokenId: number) {
  // This is a simplified version. In production, you'd need to implement
  // event listening and tracking of token transfers to maintain an accurate
  // list of holders
  const transferFilter = contract.filters.TransferSingle(null, null, null, tokenId);
  const events = await contract.queryFilter(transferFilter);
  const holders = new Set<string>();
  
  events.forEach(event => {
    if (event.args) {
      holders.add(event.args.to);
      if (event.args.from !== ethers.constants.AddressZero) {
        holders.delete(event.args.from);
      }
    }
  });
  
  return Array.from(holders);
}

async function getTotalSupply(contract: ethers.Contract, tokenId: number) {
  // This is a simplified version. In production, you'd need to track
  // minting and burning events to maintain an accurate total supply
  const events = await contract.queryFilter(contract.filters.TransferSingle());
  let totalSupply = ethers.BigNumber.from(0);
  
  events.forEach(event => {
    if (event.args && event.args.id.eq(tokenId)) {
      if (event.args.from === ethers.constants.AddressZero) {
        totalSupply = totalSupply.add(event.args.value);
      }
      if (event.args.to === ethers.constants.AddressZero) {
        totalSupply = totalSupply.sub(event.args.value);
      }
    }
  });
  
  return totalSupply;
}