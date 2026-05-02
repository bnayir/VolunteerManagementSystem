using System.ComponentModel.DataAnnotations;

namespace GYSPlatform.Application.DTOs.Admin
{
    public class UpdateOrganizationStatusDto
    {
        [Required]
        public int OrganizationId { get; set; } 

        [Required]
        public string NewStatus { get; set; } = string.Empty; 
    }
}