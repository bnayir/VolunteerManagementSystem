using Microsoft.AspNetCore.Identity;
namespace GYSPlatform.Domain.Entities
{
    public class AppUser : IdentityUser 
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? OrganizationId { get; set; } 
        public virtual Organization? Organization { get; set; }
        public virtual ICollection<Application> Applications { get; set; } = new HashSet<Application>();
        public string? ProfilePicturePath { get; set; }
    }
}
