using Enterprise_Retail___Order_Management_System.Models;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Retail___Order_Management_System.Services
{
    public class GetUsers :IGetUsers
    {
        private readonly RetailFlowDbContext _context;

        public GetUsers(RetailFlowDbContext context)
        {
            this._context = context;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
