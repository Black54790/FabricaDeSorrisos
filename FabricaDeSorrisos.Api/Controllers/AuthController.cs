using FabricaDeSorrisos.Api.Models.Auth;
using FabricaDeSorrisos.Infrastructure.Identity;
using FabricaDeSorrisos.Infrastructure.Persistence;
using FabricaDeSorrisos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FabricaDeSorrisos.Api.Controllers.Auth
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly AppDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            JwtTokenService jwtTokenService,
            AppDbContext context)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return Unauthorized("Usuário não encontrado");

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized("Senha inválida");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            if (role == null)
                return Unauthorized("Usuário sem role");

            // 🔑 GERA O JWT AQUI
            var token = _jwtTokenService.GenerateToken(user, role);

            return Ok(new
            {
                Token = token,
                user.Id,
                user.Email,
                user.UserName,
                Role = role
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.Nome))
            {
                return BadRequest("Nome, Email e Password são obrigatórios.");
            }

            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                return Conflict("E-mail já está em uso.");

            var user = new ApplicationUser { UserName = request.Email, Email = request.Email, EmailConfirmed = true };
            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
                return BadRequest(createResult.Errors);

            var role = string.IsNullOrWhiteSpace(request.Role) ? "Cliente" : request.Role;
            var addRoleResult = await _userManager.AddToRoleAsync(user, role);
            if (!addRoleResult.Succeeded)
                return BadRequest(addRoleResult.Errors);

            var tipoNome = role switch
            {
                "Admin" => "Administrador",
                "Gerente" => "Gerente",
                _ => "Cliente"
            };

            var tipo = await _context.TiposUsuarios.FirstOrDefaultAsync(t => t.Nome == tipoNome);
            if (tipo == null)
                return StatusCode(500, "Tipo de usuário não encontrado.");

            var usuarioSistema = new Usuario
            {
                NomeCompleto = request.Nome,
                Email = request.Email,
                IdentityUserId = user.Id,
                TipoUsuarioId = tipo.Id
            };

            _context.UsuariosDoSistema.Add(usuarioSistema);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                usuarioSistema.Id,
                usuarioSistema.NomeCompleto,
                usuarioSistema.Email,
                Role = role
            });
        }
    }
}
