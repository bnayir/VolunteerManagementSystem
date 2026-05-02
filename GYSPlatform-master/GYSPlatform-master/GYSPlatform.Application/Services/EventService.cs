using GYSPlatform.Application.DTOs.Events;
using GYSPlatform.Application.Interfaces;
using GYSPlatform.Domain.Entities;
using GYSPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity; 
using Microsoft.EntityFrameworkCore; 
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace GYSPlatform.Application.Services
{
    public class EventService : IEventService
    {
        private readonly ApplicationDbContext _context;        

        private readonly UserManager<AppUser> _userManager;

        public EventService(ApplicationDbContext context, UserManager<AppUser> userManager)        

        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<EventDto> CreateEventAsync(CreateEventDto createDto, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.OrganizationId == null)
            {
                throw new ApplicationException("Yetkili kullanıcı bulunamadı veya bir kuruma bağlı değil.");
            }

            var newEvent = new Event
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Location = createDto.Location,
                Date = createDto.Date,
                Quota = createDto.Quota,
                IsActive = true,       
                IsApproved = true,
                OrganizationId = user.OrganizationId.Value

            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return new EventDto
            {
                Id = newEvent.Id,
                Name = newEvent.Name,
                Description = newEvent.Description,
                Location = newEvent.Location,
                Date = newEvent.Date,
                Quota = newEvent.Quota,
                OrganizationId = newEvent.OrganizationId,
                OrganizationName = (await _context.Organizations.FindAsync(newEvent.OrganizationId))?.Name ?? string.Empty
            };
        }

        public async Task UpdateEventAsync(int eventId, CreateEventDto updateDto, string userId)        

        {
            var (user, userOrganizationId) = await GetUserAndOrganizationIdAsync(userId);

            var eventToUpdate = await _context.Events.FindAsync(eventId);
            if (eventToUpdate == null)
            {
                throw new ApplicationException("Etkinlik bulunamadı.");
            }

            if (eventToUpdate.OrganizationId != userOrganizationId)            

            {
                throw new ApplicationException("Bu etkinliği güncelleme yetkiniz yok.");
            }

            eventToUpdate.Name = updateDto.Name;            

            eventToUpdate.Description = updateDto.Description;
            eventToUpdate.Location = updateDto.Location;
            eventToUpdate.Date = updateDto.Date;
            eventToUpdate.Quota = updateDto.Quota;

            await _context.SaveChangesAsync();            

        }

        public async Task DeleteEventAsync(int eventId, string userId)        

        {
            var (user, userOrganizationId) = await GetUserAndOrganizationIdAsync(userId);

            var eventToDelete = await _context.Events.FindAsync(eventId);
            if (eventToDelete == null)
            {
                throw new ApplicationException("Etkinlik bulunamadı.");
            }

            if (eventToDelete.OrganizationId != userOrganizationId)            

            {
                throw new ApplicationException("Bu etkinliği silme yetkiniz yok.");
            }

            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<EventDto>> GetEventsByMyOrganizationAsync(string userId)
        {
            var (user, userOrganizationId) = await GetUserAndOrganizationIdAsync(userId);

            return await _context.Events
                .Where(e => e.OrganizationId == userOrganizationId)
                .Select(e => new EventDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    Location = e.Location,
                    Date = e.Date,
                    Quota = e.Quota,
                    OrganizationId = e.OrganizationId,
                    OrganizationName = e.Organization!.Name 
                })
                .ToListAsync();
        }

        private async Task<(AppUser user, int organizationId)> GetUserAndOrganizationIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.OrganizationId == null)
            {
                throw new ApplicationException("Yetkili STK kullanıcısı bulunamadı.");
            }
            return (user, user.OrganizationId.Value);
        }
    }
}