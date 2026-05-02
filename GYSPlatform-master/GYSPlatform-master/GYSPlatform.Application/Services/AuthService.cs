using GYSPlatform.Application.DTOs.Auth;
using GYSPlatform.Application.Interfaces;
using GYSPlatform.Domain.Entities;
using GYSPlatform.Domain.Settings;
using GYSPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GYSPlatform.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager; 
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthService(UserManager<AppUser> userManager,
                           RoleManager<IdentityRole> roleManager,
                           IOptions<JwtSettings> jwtSettings,
                           ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtSettings = jwtSettings.Value;
            _context = context;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) throw new ApplicationException("Geçersiz e-posta veya parola.");

            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordCorrect) throw new ApplicationException("Geçersiz e-posta veya parola.");

            var token = await GenerateJwtTokenAsync(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                Email = user.Email!,
                Token = token
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            Console.WriteLine($"--- KAYIT İSTEĞİ BAŞLADI ---");
            Console.WriteLine($"Email: {registerDto.Email}");
            Console.WriteLine($"İstenen Rol: {registerDto.Role}");

            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null) throw new ApplicationException("Bu e-posta adresi zaten kullanımda.");

            var newUser = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                //CreatedDate = DateTime.Now
            };

            if (registerDto.Role == "StkAdmin")
            {
                Console.WriteLine(">>> STK Seçildi. Otomatik Kurum Oluşturuluyor...");

                var newOrg = new Organization
                {
                    Name = $"{registerDto.FirstName} {registerDto.LastName} Org", 
                    ContactEmail = registerDto.Email,
                    Description = "Otomatik oluşturulan STK hesabı.",
                    Address = "Adres Girilmedi",
                    ApprovalStatus = "Pending" 
                };

                _context.Organizations.Add(newOrg);
                await _context.SaveChangesAsync(); 

                newUser.OrganizationId = newOrg.Id; 
                Console.WriteLine($">>> Kurum Oluştu! ID: {newOrg.Id}");
            }

            var result = await _userManager.CreateAsync(newUser, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ApplicationException($"Kullanıcı oluşturulamadı: {errors}");
            }

            string roleToAssign = string.IsNullOrEmpty(registerDto.Role) ? "Gonullu" : registerDto.Role;

            if (!await _roleManager.RoleExistsAsync(roleToAssign))
            {
                Console.WriteLine($">>> '{roleToAssign}' rolü bulunamadı, oluşturuluyor...");
                await _roleManager.CreateAsync(new IdentityRole(roleToAssign));
            }

            await _userManager.AddToRoleAsync(newUser, roleToAssign);
            Console.WriteLine($">>> Rol atandı: {roleToAssign}");

            var token = await GenerateJwtTokenAsync(newUser);

            return new AuthResponseDto
            {
                UserId = newUser.Id,
                Email = newUser.Email!,
                Token = token
            };
        }

        private async Task<string> GenerateJwtTokenAsync(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<AuthResponseDto> RegisterStkAsync(StkRegisterDto stkRegisterDto)
        {
            throw new NotImplementedException();
        }
    }
}