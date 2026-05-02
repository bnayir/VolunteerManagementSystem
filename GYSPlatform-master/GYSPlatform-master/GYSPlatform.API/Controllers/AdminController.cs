using GYSPlatform.Application.DTOs.Admin;
using GYSPlatform.Application.Interfaces;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc; 
using System;
using System.Threading.Tasks;

namespace GYSPlatformNet8.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,SuperAdmin")]    
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("pending-organizations")]
        public async Task<IActionResult> GetPendingOrganizations()
        {
            try
            {
                var organizations = await _adminService.GetPendingOrganizationsAsync();
                return Ok(organizations); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Dahili sunucu hatası: {ex.Message}");
            }
        }

        [HttpPost("update-status")]
        public async Task<IActionResult> UpdateOrganizationStatus([FromBody] UpdateOrganizationStatusDto updateDto)
        {
            try
            {
                await _adminService.UpdateOrganizationStatusAsync(updateDto);

                return Ok(new { message = "Kurum statüsü başarıyla güncellendi." });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Dahili sunucu hatası: {ex.Message}");
            }
        }
    }
}