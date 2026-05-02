using System;

namespace GYSPlatform.Domain.Entities
{
    public class EventReview
    {
        public int Id { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int EventId { get; set; }
        public Event Event { get; set; }

        public string VolunteerId { get; set; }
        public AppUser Volunteer { get; set; }
    }
}