using GYSPlatform.Domain.Entities;
using GYSPlatform.Domain.Settings;
using Microsoft.AspNetCore.Identity; 
using Microsoft.Extensions.DependencyInjection; 
using Microsoft.Extensions.Hosting; 
using Microsoft.Extensions.Options; 

namespace GYSPlatform.Infrastructure.Persistence
{
    public static class SeedData
    {
        
        public static async Task InitializeAsync(IHost host)        

        {
            
            using (var scope = host.Services.CreateScope())
            {
                var serviceProvider = scope.ServiceProvider;
                try
                {
                    var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
                    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                    var adminConfig = serviceProvider.GetRequiredService<IOptions<SuperAdminConfig>>().Value;

                    await SeedRolesAsync(roleManager);

                    await SeedSuperAdminAsync(userManager, adminConfig);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Veri tohumlama sırasında bir hata oluştu: " + ex.Message);
                }
            }
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("SuperAdmin"))
            {
                await roleManager.CreateAsync(new IdentityRole("SuperAdmin"));
            }

            if (!await roleManager.RoleExistsAsync("StkAdmin"))
            {
                await roleManager.CreateAsync(new IdentityRole("StkAdmin"));
            }

            if (!await roleManager.RoleExistsAsync("Gonullu"))
            {
                await roleManager.CreateAsync(new IdentityRole("Gonullu"));
            }
        }

        private static async Task SeedSuperAdminAsync(UserManager<AppUser> userManager, SuperAdminConfig adminConfig)
        {
            if (await userManager.FindByEmailAsync(adminConfig.Email) == null)
            {
                var superAdmin = new AppUser
                {
                    UserName = adminConfig.Email,
                    Email = adminConfig.Email,
                    FirstName = "Platform", 
                    LastName = "Yöneticisi", 
                    EmailConfirmed = true 
                };

                var result = await userManager.CreateAsync(superAdmin, adminConfig.Password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
                }
            }
        }
    }
}