using BACKEND.Model;

namespace BACKEND.Data
{
    public class RoomRepository : IRoomRepository
    {
        //A feladat, hogy a megadott bútorokat elrendezzük a szobában úgy,
        //hogy ne érjenek össze és az eredményt egy táblázatos formában prezentáljuk úgy,
        //hogy minden táblázatcella pl. 10cm-t jelent.Ha az ágy 160*200 cm hosszú és a sarokban található,
        //akkor a szükséges 16, illetve 20 cellát egyesítsük, színezzük ki valamilyen random színnel és írjuk bele, hogy "Ágy".

        //Bemenetek: szoba méretei (szélesség, hosszúság - maximum 1 tizedesjegy pontosan), tárgyak listája(név, szélesség, hosszúság)
        //Kimenetek: egy generált szoba berendezési terv


        // 1m -> 100cm

        // 6,2 m széles és 3.4 m hosszú
        // 620 cm széles és 340 cm hosszú
        // 62 cella széles és 34 cella hosszú

        // 0 -> üres, bármi szám -> vannak
        public List<List<int>> Fit(double width, double length, List<Furniture> furnitures)
        {
            int gridWidth = (int)(width * 10);
            int gridLength = (int)(length * 10);
            int[,] grid = new int[gridLength, gridWidth];

            for (int i = 0; i < furnitures.Count; i++)
            {
                PlaceFurnitureInFirstAvailable(grid, furnitures[i], i+1);
            }

            List<List<int>> ints = new List<List<int>>();
            for (int i = 0; i < gridLength; i++)
            {
                List<int> row = new List<int>();
                for (int j = 0; j < gridWidth; j++)
                {
                    row.Add(grid[i,j]);
                }
                ints.Add(row);
            }

            return ints;
        }

        private static void PlaceFurniture(int[,] grid, Furniture furniture, int startX, int startY, int i)
        {
            int widthCells = (int)(furniture.Width * 10);
            int lengthCells = (int)(furniture.Length * 10);

            for (int y = startY; y < startY + lengthCells; y++)
            {
                for (int x = startX; x < startX + widthCells; x++)
                {
                    grid[y, x] = i;
                }
            }
        }

        private static bool PlaceFurnitureInFirstAvailable(int[,] grid, Furniture furniture, int i)
        {
            int widthCells = (int)(furniture.Width * 10);
            int lengthCells = (int)(furniture.Length * 10);
            int rows = grid.GetLength(0);
            int cols = grid.GetLength(1);

            for (int y = 0; y <= rows - lengthCells; y++)
            {
                for (int x = 0; x <= cols - widthCells; x++)
                {
                    if (CanPlace(grid, x, y, widthCells, lengthCells))
                    {
                        PlaceFurniture(grid, furniture, x, y, i);

                        AddBuffer(grid, x, y, widthCells, lengthCells);
                        return true;
                    }
                }
            }
            return false;
        }

        private static void AddBuffer(int[,] grid, int startX, int startY, int widthCells, int lengthCells)
        {
            for (int y = startY; y < startY + lengthCells; y++)
            {
                if (startX + widthCells < grid.GetLength(1))
                    grid[y, startX + widthCells] = -1;
            }
            for (int x = startX; x < startX + widthCells; x++)
            {
                if (startY + lengthCells < grid.GetLength(0))
                    grid[startY + lengthCells, x] = -1;
            }
        }

        private static bool CanPlace(int[,] grid, int startX, int startY, int widthCells, int lengthCells)
        {
            for (int y = startY; y < startY + lengthCells; y++)
            {
                for (int x = startX; x < startX + widthCells; x++)
                {
                    if (grid[y, x] != 0)
                    {
                        return false; // Ütközés van
                    }
                }
            }
            return true;
        }
    }
}
