using GYSPlatform.Application.DTOs;
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
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        [Authorize(Roles = "Volunteer,Gonullu")]
        public async Task<IActionResult> AddReview([FromBody] AddReviewDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var application = await _context.Applications
                .FirstOrDefaultAsync(a => a.EventId == dto.EventId && a.VolunteerId == userId && (a.Status == "Accepted" || a.Status == "Approved"));

            if (application == null)
                return BadRequest("Sadece katıldığınız ve onaylandığınız etkinliklere yorum yapabilirsiniz.");

            var existingReview = await _context.EventReviews
                .AnyAsync(r => r.EventId == dto.EventId && r.VolunteerId == userId);

            if (existingReview)
                return BadRequest("Bu etkinlik için zaten bir değerlendirme yaptınız.");

            var review = new EventReview
            {
                EventId = dto.EventId,
                VolunteerId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                ImageUrl = dto.ImageUrl,
                CreatedDate = DateTime.Now
            };

            _context.EventReviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Yorumunuz kaydedildi! Teşekkürler." });
        }

        [HttpGet("get-by-event/{eventId}")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetReviews(int eventId)
        {
            var reviews = await _context.EventReviews
                .Where(r => r.EventId == eventId)
                .Include(r => r.Volunteer) 
                .Select(r => new ReviewResponseDto
                {
                    Id = r.Id,
                    VolunteerName = r.Volunteer != null ? $"{r.Volunteer.FirstName} {r.Volunteer.LastName}" : "Anonim Gönüllü",
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ImageUrl = r.ImageUrl,
                    CreatedDate = r.CreatedDate
                })
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            return Ok(reviews);
        }
    }
}