using System.ComponentModel.DataAnnotations;

namespace GYSPlatform.Application.DTOs.Auth
{
    public class StkRegisterDto
    {
        // --- Temsilci Kullanıcı Bilgileri ---
        [Required(ErrorMessage = "Temsilci Ad alanı zorunludur.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Temsilci Soyad alanı zorunludur.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Temsilci E-posta alanı zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Parola alanı zorunludur.")]
        public string Password { get; set; } = string.Empty;


        // --- Temsil Edilen Kurum Bilgileri ---
        [Required(ErrorMessage = "Kurum Adı alanı zorunludur.")]
        public string OrganizationName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kurum Açıklaması zorunludur.")]
        public string OrganizationDescription { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kurum Adresi zorunludur.")]
        public string OrganizationAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kurum İletişim E-postası zorunludur.")]
        [EmailAddress]
        public string OrganizationContactEmail { get; set; } = string.Empty;
    }
}