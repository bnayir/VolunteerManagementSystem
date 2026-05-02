using GYSPlatform.Application.DTOs.Auth;

namespace GYSPlatform.Application.Interfaces
{ 

    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);

        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterStkAsync(StkRegisterDto stkRegisterDto);
    }
}