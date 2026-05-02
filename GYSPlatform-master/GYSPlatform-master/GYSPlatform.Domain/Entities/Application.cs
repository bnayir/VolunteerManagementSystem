using GYSPlatform.Domain.Entities;
using System;

namespace GYSPlatform.Domain.Entities
{
    public class Application
    {
        public int Id { get; set; }

        public string VolunteerId { get; set; } = string.Empty;         

        public virtual AppUser? Volunteer { get; set; }

        public int EventId { get; set; }        

        public virtual Event? Event { get; set; }

        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;         


        public string Status { get; set; } = "Pending";        

    }
}