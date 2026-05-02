using Microsoft.AspNetCore.Http;
namespace GYSPlatform.Application.DTOs.Auth
{
    public class UpdateProfileDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
        public IFormFile? ProfilePictureFile { get; set; }
    }
}