using System.ComponentModel.DataAnnotations;

namespace GYSPlatform.Application.DTOs.Events
{
    public class CreateEventDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [Range(1, 1000)]
        public int Quota { get; set; } // Kontenjan
    }
}