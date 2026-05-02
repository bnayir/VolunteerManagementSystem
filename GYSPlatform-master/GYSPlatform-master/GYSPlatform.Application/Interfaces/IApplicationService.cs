using GYSPlatform.Application.DTOs.Applications;
using GYSPlatform.Application.DTOs.Events;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GYSPlatform.Application.Interfaces
{
    public interface IApplicationService
    {

        Task<IEnumerable<EventDto>> GetAllAvailableEventsAsync();        


        Task ApplyToEventAsync(ApplyToEventDto applyDto, string userId);        


        Task<IEnumerable<ApplicationDto>> GetMyApplicationsAsync(string userId);        



        Task<IEnumerable<ApplicationDto>> GetApplicationsForMyEventAsync(int eventId, string userId);        


        Task UpdateApplicationStatusAsync(int applicationId, string newStatus, string userId);        

    }
}