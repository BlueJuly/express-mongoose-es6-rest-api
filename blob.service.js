const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=leondev;AccountKey=wpYx4gmQ6WiGnmLMOryHBJjx/4Hubjad9WB4lgYCuoshdEvO678iT3rSRUJ4PfC9AbaQrmVRU8pQsOD0ZyGzVw==;EndpointSuffix=core.windows.net';
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  SASProtocol,
  ContainerURL,
  BlockBlobURL,
  SharedKeyCredential,
  StorageURL,
  ServiceURL
} = require('@azure/storage-blob');

const AZURE_STORAGE_KEY = 'wpYx4gmQ6WiGnmLMOryHBJjx/4Hubjad9WB4lgYCuoshdEvO678iT3rSRUJ4PfC9AbaQrmVRU8pQsOD0ZyGzVw==';
const imageContainerName = 'images';
const audioContainerName = 'audio';
const videoContainerName = 'video';
const documentContainerName = 'documents';
let blobServiceClient;
async function saveImage(blobName, filePath) {
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const imageContainerClient = await blobServiceClient.getContainerClient(imageContainerName);
  if (!(await imageContainerClient.exists())) {
    const createImageContainerResponse = await imageContainerClient.create();
  }
  const blockBlobClient = imageContainerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  // console.log('uploadBlobResponse is:@@@@@@');
  // console.log(uploadBlobResponse);
  return uploadBlobResponse;
}
async function saveAudio(blobName, filePath) {
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const audioContainerClient = await blobServiceClient.getContainerClient(audioContainerName);
  if (!(await audioContainerClient.exists())) {
    const createAudioContainerResponse = await audioContainerClient.create();
  }

  const blockBlobClient = audioContainerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  // console.log('uploadBlobResponse is:@@@@@@');
  // console.log(uploadBlobResponse);
  return uploadBlobResponse;
}
async function saveVideo(blobName, filePath) {
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const videoContainerClient = await blobServiceClient.getContainerClient(videoContainerName);
  if (!(await videoContainerClient.exists())) {
    const createVideoContainerResponse = await videoContainerClient.create();
  }
  const blockBlobClient = videoContainerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  // console.log('uploadBlobResponse is:@@@@@@');
  // console.log(uploadBlobResponse);
  return uploadBlobResponse;
}
async function saveDocument(blobName, filePath) {
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }

  const documentContainerClient = await blobServiceClient.getContainerClient(documentContainerName);
  if (!(await documentContainerClient.exists())) {
    const createDocContainerResponse = await documentContainerClient.create();
  }

  const blockBlobClient = documentContainerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  // console.log('uploadBlobResponse is:@@@@@@');
  // console.log(uploadBlobResponse);
  return uploadBlobResponse;
}
async function getSAS(blobName, containerName) {

  const sharedKeyCredential = new StorageSharedKeyCredential('leondev', AZURE_STORAGE_KEY);
  const sas = generateBlobSASQueryParameters({
    containerName,
    blodName: blobName,
    protocol: SASProtocol.HTTPS,
    permissions: 'racwd',
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 86400)
  }, sharedKeyCredential);
  console.log("^^^^^^^^^^");
  console.log(sas);
  console.log("^^^^^^^^^^");
  console.log(sas.toString());
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const containerClient = await blobServiceClient.getContainerClient(containerName);
  if (!(await containerClient.exists())) {
    const createcontainerResponse = await containerClient.create();
  }
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  console.log("blob service client^^^^^^^^^^");
  console.log(blockBlobClient);
  console.log("blob service client url^^^^^^^^^^");
  console.log(blockBlobClient.url);
  return sas;
}
async function getServiceUrl() {
  const credentials = new StorageSharedKeyCredential('leondev', AZURE_STORAGE_KEY);
  const pipeline = StorageURL.newPipeline(credentials);
  const serviceURL = new ServiceURL('https://leondev.blob.core.windows.net', pipeline);
  console.log('service URL is:');
  console.log(serviceURL);
  return serviceURL;
}
async function getBlockBlobUrl(blobName, containerName) {
  const serviceURL = getServiceUrl();
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
  console.log('blockBlobURL is:');
  console.log(blockBlobURL);
  return blockBlobURL;
}
async function createBlockBlobSASURL(blobName, containerName) {
  const blockBlobURL = getBlockBlobUrl(blobName, containerName);
  const blobSAS = getSAS(blobName, containerName);
  const sasURL = `${blockBlobURL.url}?${blobSAS}`;
  console.log('sasURL is:');
  console.log(sasURL);
  return sasURL;
}
module.exports = {
  saveImage,
  saveAudio,
  saveVideo,
  saveDocument,
  getSAS,
  getBlockBlobUrl,
  createBlockBlobSASURL
};
