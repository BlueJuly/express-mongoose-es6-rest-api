/* eslint-disable max-len */
/* eslint-disable prefer-const */
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=leondev;AccountKey=wpYx4gmQ6WiGnmLMOryHBJjx/4Hubjad9WB4lgYCuoshdEvO678iT3rSRUJ4PfC9AbaQrmVRU8pQsOD0ZyGzVw==;EndpointSuffix=core.windows.net';
const AZURE_STORAGE_KEY = 'wpYx4gmQ6WiGnmLMOryHBJjx/4Hubjad9WB4lgYCuoshdEvO678iT3rSRUJ4PfC9AbaQrmVRU8pQsOD0ZyGzVw==';
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  SASProtocol
} = require('@azure/storage-blob');

let blobServiceClient;
async function saveBlob(blobName, filePath, containerName) {
  // console.log('Azure Blob storage v12 - JavaScript quickstart sample');
  // Quick start code goes here
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const containerClient = await blobServiceClient.getContainerClient(containerName);
  if (!(await containerClient.exists())) {
    // eslint-disable-next-line no-unused-vars
    const createContainerResponse = await containerClient.create();
  }
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  // console.log('uploadBlobResponse is:@@@@@@');
  // console.log(uploadBlobResponse);
  return uploadBlobResponse;
}

async function getBlobSASUrl(blobName, containerName, expiryInSecs) {
  const sharedKeyCredential = new StorageSharedKeyCredential('leondev', AZURE_STORAGE_KEY);
  const defaultExpiryInSecs = 3600;
  let startDate = new Date();
  let expiryDate = new Date(startDate);
  startDate.setMinutes(startDate.getMinutes() - 3);
  // if defined expiry time is found, use the defined value. Othervise, use default value
  if (expiryInSecs) {
    expiryDate.setSeconds(expiryDate.getSeconds() + expiryInSecs);
  } else {
    expiryDate.setSeconds(expiryDate.getSeconds() + defaultExpiryInSecs);
  }
  const sas = generateBlobSASQueryParameters({
    containerName,
    blodName: blobName,
    protocol: SASProtocol.HTTPS,
    permissions: 'racwd',
    startsOn: startDate,
    expiresOn: expiryDate
  }, sharedKeyCredential);
  if (!blobServiceClient) {
    blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }
  const containerClient = await blobServiceClient.getContainerClient(containerName);
  if (!(await containerClient.exists())) {
    // eslint-disable-next-line no-unused-vars
    const createcontainerResponse = await containerClient.create();
  }
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const blobSASUrl = `${blockBlobClient.url}?${sas.toString()}`;
  // console.log("^^^^SAS^^^^^^");
  // console.log(sas);
  // console.log("^^^^^SAS to String^^^^^");
  // console.log(sas.toString());
  // console.log("blob service client^^^^^^^^^^");
  // console.log(blockBlobClient);
  // console.log("blob service client url^^^^^^^^^^");
  // console.log(blockBlobClient.url);
  // console.log(blobSASUrl);
  return blobSASUrl;
}

module.exports = {
  saveBlob,
  getBlobSASUrl
};
