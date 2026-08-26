using Enterprise_Retail___Order_Management_System.Models;

namespace Enterprise_Retail___Order_Management_System.Services
{
    public interface IGetUsers
    {
        Task<List<User>> GetAllUsersAsync();
    }
}
