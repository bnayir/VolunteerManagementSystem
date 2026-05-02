namespace GYSPlatform.Application.DTOs
{
    public class AddReviewDto
    {
        public int EventId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public string VolunteerName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}