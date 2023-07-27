// Import the necessary libraries
const { ethers, JsonRpcProvider } = require('ethers');
const { privateKey } = require("./secrets");

// Define the contract addresses of Token A and Token B
const tokenAAddress = '0x9f9be5adc53cffa7c728b9bd7d50c099c376216a';
const tokenBAddress = '0x6b047e39490b819d6190692364be2218b8f0558f';
const routerAddress = '0x88c07c9765a1add58665897699261dbc32b2f66a';

// Create a JSON file with the ABIs of Token A and Token B
const ABI_OF_TOKEN_A_CONTRACT = require('./ABIs/tokena.json');
const ABI_OF_TOKEN_B_CONTRACT = require('./ABIs/tokenb.json');
const ABI_OF_UNISWAP_V2_ROUTER = require('./ABIs/uniswap.json');

// Create a provider for the Shardeum Dappnet
const provider = new ethers.providers.JsonRpcProvider('https://dapps.shardeum.org');

// Create a wallet with the private key
const wallet = new ethers.Wallet(privateKey, provider);

// Create contracts for Token A, Token B, and Uniswap V2 Router
const tokenA = new ethers.Contract(tokenAAddress, ABI_OF_TOKEN_A_CONTRACT, wallet);
const tokenB = new ethers.Contract(tokenBAddress, ABI_OF_TOKEN_B_CONTRACT, wallet);
const router = new ethers.Contract(routerAddress, ABI_OF_UNISWAP_V2_ROUTER, wallet);

async function swapTokens() {
    const amountIn = ethers.utils.parseUnits('10'); // Adjust the amount and decimals accordingly
    const amountOutMin = ethers.utils.parseUnits('5'); // Adjust the expected minimum amount of Token B to receive
    const deadline = Math.floor(Date.now() / 1000) + 3600; // Set the deadline for the transaction (1 hour from now)

    // Approve the router to spend Token A
    await tokenA.approve(router.address, amountIn);

    // Swap Token A for Token B
    const path = [tokenAAddress, tokenBAddress];
    await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        wallet.address,
        deadline,
        { gasLimit: 500000 } // Adjust gas limit if needed
    );
}

swapTokens()
  .then(() => console.log('Token swap completed successfully!'))
  .catch((err) => console.error('Error occurred during token swap:', err));
