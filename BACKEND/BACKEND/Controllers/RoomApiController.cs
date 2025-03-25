using BACKEND.Classes;
using BACKEND.Data;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomApiController : ControllerBase
    {
        IRoomRepository roomRepository;
        public RoomApiController(IRoomRepository roomRepository)
        {
            this.roomRepository = roomRepository;
        }

        [HttpPost]
        public List<List<int>> GetRoomFit([FromBody] RoomRequest request)
        {
            return this.roomRepository.Fit(request.Width, request.Length, request.Furnitures);
        }
    }
}
