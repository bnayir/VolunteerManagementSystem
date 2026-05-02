namespace GYSPlatform.Application.DTOs.Events
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int Quota { get; set; }

        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; } = string.Empty;
    }
}