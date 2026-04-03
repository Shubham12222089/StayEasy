using AdminService.Domain.Entities;

namespace AdminService.Application.Interfaces;

public interface IAdminService
{
    Task<List<BookingSummary>> GetAllBookingsAsync();
}