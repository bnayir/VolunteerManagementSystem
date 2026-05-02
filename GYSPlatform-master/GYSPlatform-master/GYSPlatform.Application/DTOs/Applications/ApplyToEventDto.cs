using System.ComponentModel.DataAnnotations;

namespace GYSPlatform.Application.DTOs.Applications
{
    public class ApplyToEventDto
    {
        [Required]
        public int EventId { get; set; } 
    }
}