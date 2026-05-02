using GYSPlatform.Application.DTOs.Admin;
using GYSPlatform.Application.Interfaces;
using GYSPlatform.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore; 
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace GYSPlatform.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrganizationDto>> GetPendingOrganizationsAsync()
        {

            var pendingOrganizations = await _context.Organizations
                .Where(org => org.ApprovalStatus == "Pending")
                .Select(org => new OrganizationDto
                {
                    Id = org.Id,
                    Name = org.Name,
                    Description = org.Description,
                    Address = org.Address,
                    ContactEmail = org.ContactEmail,
                    ApprovalStatus = org.ApprovalStatus
                })
                .ToListAsync();

            return pendingOrganizations;
        }

        public async Task UpdateOrganizationStatusAsync(UpdateOrganizationStatusDto updateDto)
        {
            var organization = await _context.Organizations
                .FirstOrDefaultAsync(org => org.Id == updateDto.OrganizationId);

            if (organization == null)
            {
                throw new ApplicationException("Kurum bulunamadı.");
            }

            if (updateDto.NewStatus != "Approved" && updateDto.NewStatus != "Rejected")
            {
                throw new ApplicationException("Geçersiz statü. Sadece 'Approved' veya 'Rejected' kullanılabilir.");
            }

            organization.ApprovalStatus = updateDto.NewStatus;

            await _context.SaveChangesAsync();
        }
    }
}