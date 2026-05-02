using GYSPlatform.Domain.Entities;

namespace GYSPlatform.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int Quota { get; set; } 
        public bool IsActive { get; set; } = true;    
        public bool IsApproved { get; set; } = true;


        public int OrganizationId { get; set; } 
        public virtual Organization? Organization { get; set; }
        public virtual ICollection<Application> Applications { get; set; } = new HashSet<Application>();
    }
}