namespace GYSPlatform.Application.DTOs.Applications
{
    public class ApplicationDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Status { get; set; } = string.Empty; 
        public DateTime AppliedDate { get; set; }
        public string VolunteerName { get; set; }
        public string VolunteerEmail { get; set; }
    }
}