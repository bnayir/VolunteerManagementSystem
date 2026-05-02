using GYSPlatform.Application.DTOs.Applications;
using GYSPlatform.Application.Interfaces;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; 

namespace GYSPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    [Authorize] 
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _appService;

        public ApplicationController(IApplicationService appService)
        {
            _appService = appService;
        }


        [HttpGet("available-events")]
        public async Task<IActionResult> GetAvailableEvents()
        {
            try
            {
                var events = await _appService.GetAllAvailableEventsAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyToEvent([FromBody] ApplyToEventDto applyDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                await _appService.ApplyToEventAsync(applyDto, userId!);
                return Ok(new { message = "Başvurunuz başarıyla alındı." });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hata oluştu", error = ex.Message });
            }
        }

        [HttpGet("my-applications")]
        public async Task<IActionResult> GetMyApplications()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var applications = await _appService.GetMyApplicationsAsync(userId!);
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hata oluştu", error = ex.Message });
            }
        }


        [HttpGet("event/{eventId}")]
        [Authorize(Roles = "StkAdmin")] 
        public async Task<IActionResult> GetApplicationsForEvent(int eventId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var applications = await _appService.GetApplicationsForMyEventAsync(eventId, userId!);
                return Ok(applications);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("update-status/{id}")]
        [Authorize(Roles = "StkAdmin")] 
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                await _appService.UpdateApplicationStatusAsync(id, newStatus, userId!);
                return Ok(new { message = "Başvuru durumu güncellendi." });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}