import { MintNft, retrievImage, UploadNftMetaData } from "./minting_Nft_Function";


const nftDetail = {
    name: "Japan",
    symbol: "JP",
    uri: "Url of MetaData.json Uploaded",
    royalties: 5.5,
    description: 'Japans Blossom Season in Vadodara!',
    imgType: 'image/jpeg',
    attributes: [
        { trait_type: 'Flower', value: 'Blossom' },
    ]
};


async function main() {
    const uploadedImageUrl = await retrievImage("bafybeihwdap3evtlqsicysvtjqbyvuklpc2m3j4lhxnqh474glplctevvq");
    if (!uploadedImageUrl) {
        throw new Error("Image URL is undefined");
    }
    const metaDataUrl = await UploadNftMetaData(uploadedImageUrl, nftDetail);
    await MintNft(metaDataUrl, nftDetail)

}
main()
