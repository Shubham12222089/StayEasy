using IdentityService.Domain.Entities;
using IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Infrastructure.Repositories;

public class RevokedTokenRepository
{
    private readonly AppDbContext _context;

    public RevokedTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(RevokedToken token)
    {
        _context.Set<RevokedToken>().Add(token);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsRevokedAsync(string jti)
    {
        return await _context.Set<RevokedToken>().AnyAsync(t => t.Jti == jti);
    }
}
