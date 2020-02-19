const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=leondev;AccountKey=wpYx4gmQ6WiGnmLMOryHBJjx/4Hubjad9WB4lgYCuoshdEvO678iT3rSRUJ4PfC9AbaQrmVRU8pQsOD0ZyGzVw==;EndpointSuffix=core.windows.net';
const { BlobServiceClient } = require('@azure/storage-blob');

const imageContainerName = 'images';
const audioContainerName = 'audio';
const videoContainerName = 'video';
const documentContainerName = 'document';
let blobServiceClient;
async function saveImage(blobName, filePath) {
  console.log('~~~~~~~~ dev test~~~~~~~~~~~');
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const imageContainerClient = await blobServiceClient.getContainerClient(imageContainerName);
  if (!(await imageContainerClient.exists())) {
    const createImageContainerResponse = await imageContainerClient.create();
  }
  // const audioContainerClient = await blobServiceClient.getContainerClient(audioContainerName);
  // if (!(await audioContainerClient.exists())) {
  //   const createAudioContainerResponse = await audioContainerClient.create();
  // }
  // const videoContainerClient = await blobServiceClient.getContainerClient(videoContainerName);
  // if (!(await videoContainerClient.exists())) {
  //   const createVideoContainerResponse = await videoContainerClient.create();
  // }
  // const documentContainerClient = await blobServiceClient.getContainerClient(documentContainerName);
  // if (!(await documentContainerClient.exists())) {
  //   const createDocContainerResponse = await documentContainerClient.create();
  // }

  const blockBlobClient = imageContainerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log('uploadBlobResponse is:@@@@@@');
  console.log(uploadBlobResponse);
}
module.exports = {saveImage};
