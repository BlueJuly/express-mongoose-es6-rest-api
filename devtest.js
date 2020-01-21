const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=leondev;AccountKey=wpYx4gmQ6WiGnmLMOryHBJjx/4Hubjad9WB4lgYCuoshdEvO678iT3rSRUJ4PfC9AbaQrmVRU8pQsOD0ZyGzVw==;EndpointSuffix=core.windows.net';
const { BlobServiceClient } = require('@azure/storage-blob');

const containerName = 'images';

async function main() {
    console.log('~~~~~~~~ dev test~~~~~~~~~~~');
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = await blobServiceClient.getContainerClient(containerName);
  const createContainerResponse = await containerClient.create();
  const blobName = 'image.png';
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile('uploads/image1.png');
  console.log('uploadBlobResponse is:@@@@@@');
  console.log(uploadBlobResponse);
}
module.exports = main;
