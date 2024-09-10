/*import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
import masterChefAbi from "./masterchef.json";
import tokenAbi from "./erc20abi.json";
import { ethers, Contract, Signer } from "ethers";
import { Web3Provider } from '@ethersproject/providers';

// Define the address of the MasterChef contract
const masterchefAddr: string = '0x09043753e8b0B95d526e22cd67A3bA34449B0764';

// Interface for connection object
interface Web3Connection {
  connection: {
    account: {
      address: string;
    };
  };
  signer: Signer;
  masterchef: Contract;
  masterchefAddr: string;
}

// Web3 provider for connecting to wallet
const web3Provider = async (): Promise<Web3Provider> => {
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: custom(window.ethereum),
  });
  return new Web3Provider(client);//client;
};

// Function to convert Wei to Ether, with precision
const convertToEth = async (type: string | null, value: string): Promise<string> => {
  if (type === 'reward') {
    return Number(ethers.utils.formatEther(value)).toFixed(8);
  } else {
    return Number(ethers.utils.formatEther(value)).toFixed(2);
  }
};

// Function to convert Ether to Wei
const convertToWei = async (value: string): Promise<string> => {
  return ethers.utils.parseEther(value).toString();
};

// Function to connect wallet and return relevant contracts and signers
export async function connectWallet(): Promise<Web3Connection> {
  const connection = await web3Provider();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const masterchef = new ethers.Contract(masterchefAddr, masterChefAbi, signer);
  return { connection, signer, masterchef, masterchefAddr };
}

// Fetch token balance for a given user
export const fetchTokenBalance = async (tokenaddress: string, userwallet: string): Promise<{ pool: string; user: string }> => {
  const web3connection = await connectWallet();
  const tokencontract = new ethers.Contract(tokenaddress, tokenAbi, web3connection.signer);
  const poolBalance = await tokencontract.balanceOf(masterchefAddr);
  const pool = await convertToEth(null, poolBalance.toString());
  const userBalance = await tokencontract.balanceOf(userwallet);
  const user = await convertToEth(null, userBalance.toString());
  return { pool, user };
};

// Get pool details for all pools in the MasterChef contract
export const getPoolDetails = async (): Promise<any[]> => {
  const web3connection = await connectWallet();
  const userwallet = web3connection.connection.account.address;
  const masterchef = web3connection.masterchef;
  const poolLength = Number((await masterchef.poolLength()).toString());
  const poolArray: any[] = [];

  for (let i = 0; i < poolLength; i++) {
    const poolInfo = await masterchef.poolInfo(i);
    const tokenAddress = poolInfo[0];
    const rewardPerTokenRaw = (poolInfo[3]).toString();
    const rewardPerToken = Number(await convertToEth('reward', rewardPerTokenRaw));
    const tokenbalances = await fetchTokenBalance(tokenAddress, userwallet);
    const userStakedArray = await masterchef.userInfo(i, userwallet);
    const userRewardRaw = (await masterchef.pendingReward(i, userwallet)).toString();
    const bonus = (await masterchef.BONUS_MULTIPLIER()).toString();
    const userReward = Number(await convertToEth('reward', userRewardRaw)).toFixed(2);
    const userStaked = Number(await convertToEth('reward', ((userStakedArray['amount']).toString()))).toFixed(2);
    const APR = ((1000 * rewardPerToken) * 100).toFixed(3);
    const poolstats = {
      totalstaked: tokenbalances.pool,
      apy: APR,
      userstaked: userStaked,
      reward: userReward,
      multiplier: bonus,
      userbalance: tokenbalances.user,
      tokenaddr: tokenAddress
    };
    poolArray.push(poolstats);
  }
  return poolArray;
};

// Function to handle staking and unstaking tokens
export const action = async (i: number, amount: string, tokenaddress: string, actionType: string): Promise<boolean> => {
  try {
    const amountToWei = (await convertToWei(amount)).toString();
    const web3connection = await connectWallet();
    const masterchef = web3connection.masterchef;
    const masterchefAddr = web3connection.masterchefAddr;

    if (actionType === "unstake") {
      await masterchef.unstake(i, amountToWei);
      return true;
    } else if (actionType === "stake") {
      const tokencontract = new ethers.Contract(tokenaddress, tokenAbi, web3connection.signer);
      const approveTransfer = await tokencontract.approve(masterchefAddr, amountToWei);
      const waitApproval = await approveTransfer.wait();
      if (waitApproval) {
        await masterchef.stake(i, amountToWei);
        return true;
      }
    }
  } catch (error) {
    console.log('error', error);
  }
  return false;
};

// Auto-compounding function
export const autoCompound = async (): Promise<boolean> => {
  const web3connection = await connectWallet();
  const masterchef = web3connection.masterchef;
  await masterchef.autoCompound();
  return true;
};
*/
import { ethers, Contract, Signer } from "ethers";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
import masterChefAbi from "./masterchef.json";
import tokenAbi from "./erc20abi.json";

// Define the address of the MasterChef contract
const masterchefAddr: string = '0x09043753e8b0B95d526e22cd67A3bA34449B0764';

// Interface for connection object
interface Web3Connection {
  account: string;
  signer: Signer;
  masterchef: Contract;
  masterchefAddr: string;
}

// Web3 provider for connecting to wallet
const web3Provider = async (): Promise<ethers.BrowserProvider> => {
  if (!window.ethereum) throw new Error('MetaMask is not installed.');

  await window.ethereum.request({ method: "eth_requestAccounts" });
  
  return new ethers.BrowserProvider(window.ethereum);
};

// Function to convert Wei to Ether, with precision
const convertToEth = (type: string | null, value: string): string => {
  if (type === 'reward') {
    return Number(ethers.formatEther(value)).toFixed(8);
  } else {
    return Number(ethers.formatEther(value)).toFixed(2);
  }
};

// Function to convert Ether to Wei
const convertToWei = (value: string): string => {
  return ethers.parseEther(value).toString();
};

// Function to connect wallet and return relevant contracts and signers
export async function connectWallet(): Promise<Web3Connection> {
  const provider = await web3Provider();
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  const masterchef = new ethers.Contract(masterchefAddr, masterChefAbi, signer);

  return { account, signer, masterchef, masterchefAddr };
}

// Fetch token balance for a given user
export const fetchTokenBalance = async (tokenaddress: string, userwallet: string): Promise<{ pool: string; user: string }> => {
  const { signer } = await connectWallet();
  const tokencontract = new ethers.Contract(tokenaddress, tokenAbi, signer);
  
  const poolBalance = await tokencontract.balanceOf(masterchefAddr);
  const userBalance = await tokencontract.balanceOf(userwallet);
  
  return {
    pool: convertToEth(null, poolBalance.toString()),
    user: convertToEth(null, userBalance.toString()),
  };
};

// Get pool details for all pools in the MasterChef contract
export const getPoolDetails = async (): Promise<any[]> => {
  const { account, masterchef } = await connectWallet();
  const poolLength = Number((await masterchef.poolLength()).toString());
  const poolArray: any[] = [];

  for (let i = 0; i < poolLength; i++) {
    const poolInfo = await masterchef.poolInfo(i);
    const tokenAddress = poolInfo[0];
    const rewardPerToken = Number(await convertToEth('reward', (poolInfo[3]).toString()));
    const tokenbalances = await fetchTokenBalance(tokenAddress, account);
    const userStakedArray = await masterchef.userInfo(i, account);
    const userRewardRaw = await masterchef.pendingReward(i, account);
    const bonus = await masterchef.BONUS_MULTIPLIER();

    const userReward = Number(await convertToEth('reward', userRewardRaw.toString())).toFixed(2);
    const userStaked = Number(await convertToEth('reward', (userStakedArray['amount']).toString())).toFixed(2);
    const APR = ((1000 * rewardPerToken) * 100).toFixed(3);

    poolArray.push({
      totalstaked: tokenbalances.pool,
      apy: APR,
      userstaked: userStaked,
      reward: userReward,
      multiplier: bonus.toString(),
      userbalance: tokenbalances.user,
      tokenaddr: tokenAddress,
    });
  }

  return poolArray;
};

// Function to handle staking and unstaking tokens
export const action = async (i: number, amount: string, tokenaddress: string, actionType: string): Promise<boolean> => {
  try {
    const amountToWei = convertToWei(amount);
    const { signer, masterchef } = await connectWallet();

    if (actionType === "unstake") {
      await masterchef.unstake(i, amountToWei);
      return true;
    } else if (actionType === "stake") {
      const tokencontract = new ethers.Contract(tokenaddress, tokenAbi, signer);
      const approveTransfer = await tokencontract.approve(masterchefAddr, amountToWei);
      const waitApproval = await approveTransfer.wait();

      if (waitApproval) {
        await masterchef.stake(i, amountToWei);
        return true;
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
  return false;
};

// Auto-compounding function
export const autoCompound = async (): Promise<boolean> => {
  const { masterchef } = await connectWallet();
  await masterchef.autoCompound();
  return true;
};
