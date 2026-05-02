using GYSPlatform.Application.DTOs.Applications;
using GYSPlatform.Application.DTOs.Events;
using GYSPlatform.Domain.Entities;
using GYSPlatform.Infrastructure.Persistence;
using GYSPlatform.Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GYSPlatform.Application.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public ApplicationService(ApplicationDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // STK İÇİN: ETKİNLİĞE GELEN BAŞVURULARI LİSTELE
        public async Task<IEnumerable<ApplicationDto>> GetApplicationsForMyEventAsync(int eventId, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.OrganizationId == null)
                throw new ApplicationException("Yetkili STK kullanıcısı bulunamadı.");

            var eventToCheck = await _context.Events.FindAsync(eventId);
            if (eventToCheck == null) throw new ApplicationException("Etkinlik bulunamadı.");

            if (eventToCheck.OrganizationId != user.OrganizationId)
                throw new ApplicationException("Bu etkinliğe ait başvuruları görme yetkiniz yok.");

            return await _context.Applications
                .Where(a => a.EventId == eventId)
                .Include(a => a.Volunteer) 
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    EventId = a.EventId,
                    EventName = a.Event!.Name,
                    EventDate = a.Event!.Date,
                    Status = a.Status,
                    AppliedDate = a.AppliedDate,
                    VolunteerName = a.Volunteer != null ? $"{a.Volunteer.FirstName} {a.Volunteer.LastName}" : "Bilinmeyen Gönüllü",
                    VolunteerEmail = a.Volunteer != null ? a.Volunteer.Email : "E-posta yok"
                })
                .ToListAsync();
        }

        // GÖNÜLLÜ İÇİN: ETKİNLİĞE BAŞVUR
        public async Task ApplyToEventAsync(ApplyToEventDto applyDto, string userId)
        {
            var eventToApply = await _context.Events
                .Include(e => e.Organization)
                .FirstOrDefaultAsync(e => e.Id == applyDto.EventId);

            if (eventToApply == null) throw new ApplicationException("Etkinlik bulunamadı.");

            if (eventToApply.Organization?.ApprovalStatus != "Approved")
                throw new ApplicationException("Bu kurum henüz onaylanmadığı için başvuru yapılamaz.");

            var alreadyApplied = await _context.Applications
                .AnyAsync(a => a.EventId == applyDto.EventId && a.VolunteerId == userId);

            if (alreadyApplied) throw new ApplicationException("Bu etkinliğe zaten başvurmuşsunuz.");

            var acceptedCount = await _context.Applications
                .CountAsync(a => a.EventId == applyDto.EventId && a.Status == "Accepted");

            if (acceptedCount >= eventToApply.Quota) throw new ApplicationException("Etkinlik kontenjanı dolu.");

            var newApplication = new GYSPlatform.Domain.Entities.Application
            {
                VolunteerId = userId,
                EventId = applyDto.EventId,
                AppliedDate = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.Applications.Add(newApplication);
            await _context.SaveChangesAsync();
        }
        // 1. Tüm aktif ve onaylı etkinlikleri getiren metot
        public async Task<IEnumerable<EventDto>> GetAllAvailableEventsAsync()
        {
            return await _context.Events
                .Include(e => e.Organization)
                .Where(e => e.IsActive && e.IsApproved && e.Date > DateTime.UtcNow)
                .OrderBy(e => e.Date)
                .Select(e => new EventDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    Location = e.Location,
                    Date = e.Date,
                    Quota = e.Quota,
                    OrganizationName = e.Organization != null ? e.Organization.Name : "Bilinmeyen Kurum"
                }).ToListAsync();
        }

        // 2. Gönüllünün kendi başvurularını getiren metot
        public async Task<IEnumerable<ApplicationDto>> GetMyApplicationsAsync(string userId)
        {
            return await _context.Applications
                .Where(a => a.VolunteerId == userId)
                .Include(a => a.Event)
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    EventName = a.Event!.Name,
                    EventDate = a.Event.Date,
                    Status = a.Status,
                    AppliedDate = a.AppliedDate
                }).ToListAsync();
        }

        // 3. Başvuru durumunu güncelleyen metot (Onayla/Reddet)
        public async Task UpdateApplicationStatusAsync(int applicationId, string newStatus, string userId)
        {
            var application = await _context.Applications.FindAsync(applicationId);
            if (application == null) throw new Exception("Başvuru bulunamadı.");

            application.Status = newStatus;
            await _context.SaveChangesAsync();
        }

    }
}