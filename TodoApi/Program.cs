using Microsoft.EntityFrameworkCore;
using TodoApi; // מביא את הקלאסים Item ו-ToDoDbContext שנוצרו ב-scaffold

var builder = WebApplication.CreateBuilder(args);

// ------------------- הגדרת DbContext -------------------
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("ToDoDB"),
        new MySqlServerVersion(new Version(8, 0, 44)) // גרסת MySQL שלך
    )
);
// -------------------------------------------------------

// ------------------- הגדרת CORS -------------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
    );
});
// -------------------------------------------------------

// ------------------- Swagger בסיסי -------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// -------------------------------------------------------

var app = builder.Build();

// ------------------- הפעלת Swagger ב-Development -------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// --------------------------------------------------------------------

// הפעלת CORS
app.UseCors();

// ------------------- מאזין לפורט דינמי (חשוב ל-Render) -------------------
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://*:{port}");
// -------------------------------------------------------------------------

// Route בסיסי
app.MapGet("/", () => "Hello World!");

// ------------------- CRUD API ל-ToDo -------------------

// שליפת כל המשימות
app.MapGet("/tasks", async (ToDoDbContext context) =>
    await context.Items.ToListAsync()
);

// הוספת משימה חדשה
app.MapPost("/tasks", async (Item task, ToDoDbContext context) =>
{
    context.Items.Add(task);
    await context.SaveChangesAsync();
    return Results.Created($"/tasks/{task.Id}", task);
});

// עדכון משימה קיימת
app.MapPut("/tasks/{id}", async (int id, Item updatedTask, ToDoDbContext context) =>
{
    var task = await context.Items.FindAsync(id);
    if (task == null) return Results.NotFound();

    task.Name = updatedTask.Name;
    task.IsComplete = updatedTask.IsComplete;

    await context.SaveChangesAsync();
    return Results.NoContent();
});

// מחיקת משימה
app.MapDelete("/tasks/{id}", async (int id, ToDoDbContext context) =>
{
    var task = await context.Items.FindAsync(id);
    if (task == null) return Results.NotFound();

    context.Items.Remove(task);
    await context.SaveChangesAsync();
    return Results.NoContent();
});
// -------------------------------------------------------------------------

app.Run();
