using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Storage.Blobs;
using System;
using System.Threading.Tasks;

namespace EduSyncProject.Helpers
{
    public class BlobService
    {
        private readonly string _connectionString;

        public BlobService(string connectionString)
        {
            _connectionString = connectionString;
        }

        // ✅ Upload from IFormFile (file upload from Swagger or UI)
        public async Task<string> UploadFileAsync(IFormFile file, string instructorId)
        {
            var containerName = $"instructor-{instructorId}".ToLower(); // sanitize as needed
            BlobServiceClient blobServiceClient = new BlobServiceClient(_connectionString);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            await containerClient.CreateIfNotExistsAsync();
            BlobClient blobClient = containerClient.GetBlobClient(file.FileName);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            return blobClient.Uri.ToString();
        }
    }
} 