# Solana NFT Minting Application

A TypeScript application for minting NFTs on the Solana blockchain using Metaplex and Pinata for IPFS storage.

## Features

- **NFT Creation**: Mint NFTs on Solana Devnet using Metaplex Token Metadata
- **IPFS Integration**: Store and retrieve images and metadata using Pinata
- **Metadata Management**: Upload JSON metadata with attributes and properties
- **Creator Royalties**: Configure royalty percentage for NFT creators

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Solana wallet keypair
- Pinata account with JWT token

## Installation

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/siddharth-09/mint-NFT-Pinata
```

2. Install required packages:
```bash
bun install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:
```env
JWT=your_pinata_jwt_token_here
PINATA_GATEWAY=your_pinata_gateway_domain_here
```

**Note**: Replace `your_pinata_gateway_domain_here` with your own Pinata gateway domain (e.g., `your-gateway-name.mypinata.cloud`).

### Code Configuration

You'll also need to update the code to use environment variables for the Pinata gateway. In `minting_NFT_Function.ts`, modify the Pinata configuration:

```typescript
const pinata = new PinataSDK({
  pinataJwt: process.env.JWT,
  pinataGateway: process.env.PINATA_GATEWAY, // Use your own gateway
});
```

And update the URI in the `MintNft` function:
```typescript
uri: `https://${process.env.PINATA_GATEWAY}/ipfs/${metaDataUrl}`,
```

### Wallet Setup

Create a `wallet.json` file containing your Solana wallet's secret key as a JSON array of numbers:
```json
[123, 45, 67, ...]
```

## Usage

### Basic NFT Minting

The application provides a simple workflow to mint NFTs:

1. **Retrieve Image**: Get an image from IPFS using its CID
2. **Upload Metadata**: Create and upload JSON metadata to IPFS
3. **Mint NFT**: Create the NFT on Solana blockchain

### Example Usage

```typescript
const nftDetail = {
    name: "Your NFT Name",
    symbol: "SYMBOL",
    uri: "Metadata URI (auto-generated)",
    royalties: 5.5, // Percentage
    description: 'Your NFT description',
    imgType: 'image/jpeg',
    attributes: [
        { trait_type: 'Category', value: 'Art' },
        { trait_type: 'Rarity', value: 'Rare' }
    ]
};

// Run the minting process
async function main() {
    const imageUrl = await retrievImage("your_image_cid_here");
    const metaDataUrl = await UploadNftMetaData(imageUrl, nftDetail);
    await MintNft(metaDataUrl, nftDetail);
}
```

## API Reference

### Functions

#### `retrievImage(cid: string): Promise<string | undefined>`
Retrieves an image from IPFS using Pinata gateway.
- **Parameters**: `cid` - The IPFS Content Identifier
- **Returns**: Public gateway URL for the image

#### `UploadNftMetaData(imageUri: string, nftDetail: nftDetail): Promise<string>`
Uploads NFT metadata JSON to IPFS.
- **Parameters**: 
  - `imageUri` - The image URL from IPFS
  - `nftDetail` - NFT details object
- **Returns**: Metadata CID

#### `MintNft(metaDataUrl: string, nftDetail: nftDetail): Promise<void>`
Mints the NFT on Solana blockchain.
- **Parameters**: 
  - `metaDataUrl` - The metadata CID
  - `nftDetail` - NFT details object

### NFT Detail Interface

```typescript
interface nftDetail {
    name: string;        // NFT name
    symbol: string;      // NFT symbol
    uri: string;         // Metadata URI
    royalties: number;   // Royalty percentage
    description: string; // NFT description
    imgType: string;     // Image MIME type
    attributes: {        // NFT attributes array
        trait_type: string;
        value: string;
    }[];
}
```

## Network Configuration

Currently configured for Solana Devnet:
- **RPC Endpoint**: `https://api.devnet.solana.com`
- **Pinata Gateway**: You'll need to configure your own Pinata gateway

**Important**: Update the Pinata gateway configuration in `minting_NFT_Function.ts`:
```typescript
const pinata = new PinataSDK({
  pinataJwt: process.env.JWT,
  pinataGateway: process.env.PINATA_GATEWAY, // Use your own gateway
});
```

To use Mainnet, update the RPC endpoint in `minting_NFT_Function.ts`.

## Running the Application

Execute the main script:
```bash
bun run app.ts
```

## Error Handling

The application includes error handling for:
- Image retrieval failures
- Metadata upload issues
- NFT minting errors
- Network connectivity problems

## Dependencies

- `@metaplex-foundation/mpl-token-metadata`: NFT creation and metadata
- `@metaplex-foundation/umi-bundle-defaults`: Umi framework defaults  
- `@metaplex-foundation/umi`: Solana blockchain interaction
- `@metaplex-foundation/umi-storage-mock`: Mock storage for development
- `pinata`: IPFS storage and gateway access

## Security Considerations

- Store wallet private keys securely
- Use environment variables for sensitive data
- Never expose JWT tokens in client-side code
- Consider using hardware wallets for production

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
