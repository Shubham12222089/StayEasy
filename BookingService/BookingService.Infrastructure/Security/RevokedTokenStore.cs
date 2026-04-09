using System.Collections.Concurrent;

namespace BookingService.Infrastructure.Security;

public class RevokedTokenStore
{
    private readonly ConcurrentDictionary<string, DateTime> _revokedTokens = new();

    public void Add(string jti, DateTime expiresAt)
    {
        _revokedTokens[jti] = expiresAt;
    }

    public bool IsRevoked(string jti)
    {
        if (!_revokedTokens.TryGetValue(jti, out var expiresAt))
            return false;

        if (expiresAt <= DateTime.UtcNow)
        {
            _revokedTokens.TryRemove(jti, out _);
            return false;
        }

        return true;
    }
}
