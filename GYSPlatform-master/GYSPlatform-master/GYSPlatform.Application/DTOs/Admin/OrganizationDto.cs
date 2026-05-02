namespace GYSPlatform.Application.DTOs.Admin
{
    public class OrganizationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ApprovalStatus { get; set; } = string.Empty; 
    }
}