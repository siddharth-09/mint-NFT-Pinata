import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, sol } from '@metaplex-foundation/umi';
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import secret from './wallet.json';
import { PinataSDK } from 'pinata';

const RPC = "https://api.devnet.solana.com";
const umi = createUmi(RPC); 


const pinata = new PinataSDK({
  pinataJwt: process.env.JWT,
  pinataGateway: "scarlet-impressed-macaw-700.mypinata.cloud",
});

const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const creator = createSignerFromKeypair(umi, creatorWallet);
umi.use(keypairIdentity(creator));
umi.use(mplTokenMetadata());
umi.use(mockStorage());

interface nftDetail {
    name: string;
    symbol: string;
    uri: string;
    royalties: number;
    description: string;
    imgType: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];

}

export async function retrievImage(cid: string): Promise<string | undefined> {
    try {
        const dataUri = await pinata.gateways.public.convert(cid);
        if (!dataUri) {
            throw new Error();
        } else {
            console.log(dataUri);
            return dataUri?.toString();
        }
    } catch (e) {
        console.log("Error", e);
        return undefined;
    }
}

export async function UploadNftMetaData(imageUri : string,nft_Detail :nftDetail):Promise<string>{
     try {
        const metadata = {
            name: nft_Detail.name,
            description: nft_Detail.description,
            image: imageUri,
            attributes: nft_Detail.attributes,
            properties: {
                files: [
                    {
                        type: nft_Detail.imgType,
                        uri: imageUri,
                    },
                ]
            }
        };
        const file = new File([JSON.stringify(metadata)],"jp_metadata.json");
        const upload = await pinata.upload.public.file(file);

        const metadataUri = upload.cid;
        console.log('Uploaded metadata:', metadataUri);
        return metadataUri;
    } catch (e) {
        throw e;
    }
}

export async function MintNft(metaDataUrl : string,nft_Detail :nftDetail){
     try {
        const mint = generateSigner(umi);
        //THIS MINT IS CREATED FOR CREATOR ZERO
        await createNft(umi, {
            mint,
            name: nft_Detail.name,
            symbol: nft_Detail.symbol,
            uri: `https://scarlet-impressed-macaw-700.mypinata.cloud/ipfs/${metaDataUrl}`,
            sellerFeeBasisPoints: percentAmount(nft_Detail.royalties),
            creators: [{ address: creator.publicKey, verified: true, share: 100 }],
        }).sendAndConfirm(umi)
        console.log(`Created NFT: ${mint.publicKey.toString()}`)
    } catch (e) {
        throw e;
    }
}
