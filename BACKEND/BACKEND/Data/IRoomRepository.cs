using BACKEND.Model;

namespace BACKEND.Data
{
    public interface IRoomRepository
    {
        List<List<int>> Fit(double width, double length, List<Furniture> furnitures);
    }
}
