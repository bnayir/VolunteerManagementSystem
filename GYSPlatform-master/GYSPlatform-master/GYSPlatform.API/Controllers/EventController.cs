using GYSPlatform.Application.DTOs;
using GYSPlatform.Application.DTOs.Events;
using GYSPlatform.Domain.Entities;
using GYSPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GYSPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _context.Events
                .OrderByDescending(e => e.Date)
                .ToListAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEventById(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return NotFound("Etkinlik bulunamadı.");
            return Ok(ev);
        }

        [HttpPost]
        [Authorize(Roles = "StkAdmin")]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.OrganizationId == null)
                return BadRequest("Bir kuruma bağlı değilsiniz.");

            var org = await _context.Organizations.FindAsync(user.OrganizationId);

            if (org == null || org.ApprovalStatus != "Approved")
                return BadRequest("Etkinlik oluşturmak için kurumunuzun Admin tarafından onaylanması gerekir.");

            var newEvent = new Event
            {
                Name = dto.Name,
                Description = dto.Description,
                Date = dto.Date,
                Location = dto.Location,
                Quota = dto.Quota,
                OrganizationId = (int)user.OrganizationId
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Etkinlik başarıyla oluşturuldu." });
        }

        [HttpPost("{id}/join")]
        [Authorize(Roles = "Volunteer,Gonullu")] 
        public async Task<IActionResult> JoinEvent(int id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            // var userId = int.Parse(userIdStr); 

            var ev = await _context.Events.FindAsync(id);
            if (ev == null) return NotFound("Böyle bir etkinlik kalmamış.");

            var alreadyJoined = await _context.Applications
                .AnyAsync(a => a.EventId == id && a.VolunteerId == userIdStr);

            if (alreadyJoined)
                return BadRequest("Bu etkinliğe zaten başvurdunuz.");

            var currentAppCount = await _context.Applications.CountAsync(a => a.EventId == id);
            if (currentAppCount >= ev.Quota)
                return BadRequest("Maalesef kontenjan dolmuş.");

            var application = new GYSPlatform.Domain.Entities.Application
            {
                EventId = id,
                VolunteerId = userIdStr,
                AppliedDate = DateTime.Now,
                Status = "Pending" 
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Başvurunuz başarıyla alındı." });
        }

        [HttpGet("my-events")]
        [Authorize(Roles = "StkAdmin")]
        public async Task<IActionResult> GetMyEvents()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users.FindAsync(userId);

            if (user == null || user.OrganizationId == null)
                return BadRequest("Kurum bulunamadı.");

            var myEvents = await _context.Events
                .Where(e => e.OrganizationId == user.OrganizationId)
                .ToListAsync();

            return Ok(myEvents);
        }
    }
}