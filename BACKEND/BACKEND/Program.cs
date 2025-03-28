using BACKEND.Data;

namespace BACKEND
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllersWithViews();

            // IoC
            builder.Services.AddTransient<IRoomRepository, RoomRepository>();

            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseRouting();
            app.MapControllerRoute(name: "default",pattern: "{controller}/{action=Index}/{id?}");

            app.MapGet("/", () => "Hello World!");

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(x => x
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins("http://127.0.0.1:5500"));

            app.Run();
        }
    }
}
