using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EduSyncProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IBlobService _blobService;

        public FileUploadController(IBlobService blobService)
        {
            _blobService = blobService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Extract instructor ID from JWT claims (using 'sub' claim)
            var instructorId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(instructorId))
                return Unauthorized("Instructor ID not found in token.");

            var result = await _blobService.UploadFileAsync(file, instructorId);
            return Ok(new { FileUrl = result });
        }
    }
} 