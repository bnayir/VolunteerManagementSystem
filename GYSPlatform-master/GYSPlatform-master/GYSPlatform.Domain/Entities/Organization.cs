namespace GYSPlatform.Domain.Entities
{
    public class Organization 
    {
        public int Id { get; set; } 
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ApprovalStatus {  get; set; } = string.Empty; 
        public virtual ICollection<AppUser> Users { get; set; } 
        public virtual ICollection<Event> Events { get; set; } 
        public Organization()
        {
            Users = new HashSet<AppUser>();
            Events = new HashSet<Event>();
        }
    }
}
