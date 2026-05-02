using GYSPlatform.Application.DTOs.Admin;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GYSPlatform.Application.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<OrganizationDto>> GetPendingOrganizationsAsync();

        Task UpdateOrganizationStatusAsync(UpdateOrganizationStatusDto updateDto);
    }
}