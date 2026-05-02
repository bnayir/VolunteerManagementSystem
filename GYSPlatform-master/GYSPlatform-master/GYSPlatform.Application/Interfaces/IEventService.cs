using GYSPlatform.Application.DTOs.Events;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GYSPlatform.Application.Interfaces
{
    public interface IEventService
    {
        Task<EventDto> CreateEventAsync(CreateEventDto createDto, string userId);        


        Task<IEnumerable<EventDto>> GetEventsByMyOrganizationAsync(string userId);        


        Task UpdateEventAsync(int eventId, CreateEventDto updateDto, string userId);        


        Task DeleteEventAsync(int eventId, string userId);
    }
}