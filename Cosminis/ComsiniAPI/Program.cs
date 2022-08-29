using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;
using Controllers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowAllHeadersPolicy",
        builder =>
        {
            builder.WithOrigins("*")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<wearelosingsteamContext>(options => options.UseSqlServer("Server=tcp:p2dbs.database.windows.net,1433;Initial Catalog=wearelosingsteam;Persist Security Info=False;User ID=wearelosingsteam;Password=weL0stSteam;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));
builder.Services.AddScoped<ICompanionDAO, CompanionRepo>();
builder.Services.AddScoped<IFriendsDAO, FriendsRepo>();
builder.Services.AddScoped<IUserDAO, UserRepo>();
builder.Services.AddScoped<IPostDAO, PostRepo>();
builder.Services.AddScoped<ICommentDAO, CommentRepo>();
builder.Services.AddScoped<IResourceGen, ResourceRepo>();
builder.Services.AddScoped<ILikeIt, LikeRepo>();
builder.Services.AddScoped<Interactions, InteractionRepo>();

builder.Services.AddScoped<ResourceServices>();
builder.Services.AddScoped<CompanionServices>();
builder.Services.AddScoped<FriendServices>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<PostServices>();
builder.Services.AddScoped<CommentServices>();
builder.Services.AddScoped<LikeServices>();
builder.Services.AddScoped<InteractionService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MyAllowAllHeadersPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
