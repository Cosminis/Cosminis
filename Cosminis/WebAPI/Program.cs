using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;
using Controllers;
//I am wondering If I can admin priviledges, I am also wondering

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

builder.Services.AddDbContext<wearelosingsteamContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionString")));
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

builder.Services.AddScoped<ResourceController>();
builder.Services.AddScoped<CompanionController>();
builder.Services.AddScoped<FriendsController>();
builder.Services.AddScoped<UserController>();
builder.Services.AddScoped<PostController>();
builder.Services.AddScoped<CommentController>();
builder.Services.AddScoped<LikeController>();
builder.Services.AddScoped<InteractionController>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("MyAllowAllHeadersPolicy");

app.MapGet("/", () => "Welcome to Cosminis!");

app.MapGet("/Users/Find", (int user2Find, UserController UserController) => 
{
	return UserController.SearchUserById(user2Find);
});

app.MapPost("/Users/LoggiORReggi", (User user2Check, UserController UserController) => 
{
	return UserController.LoginOrReggi(user2Check);
});

app.MapPut("/interactions/ModifyHunger", (int companionID, InteractionController interCon) => 
{
	return interCon.DecrementCompanionHungerValue(companionID);
});

app.MapGet("/interactions/Talk", (int companionID, InteractionController interCon) => 
{
	return interCon.PullConvo(companionID);
});

app.MapPut("/setCompanion", (int userId, int companionId, InteractionController interCon) => 
{
	return interCon.SetShowcaseCompanion(userId, companionId);
});

app.MapPut("/interactions/Feed", (int feederID, int companionID, int foodID, InteractionController interCon) =>
{
	return interCon.FeedCompanion(feederID, companionID, foodID);
});

app.MapPut("/Interactions/IncrementalDecrement", (int companionID, InteractionController interCon) => 
{
	return interCon.DecrementCompanionMoodValue(companionID);
});

app.MapPut("/Interactions/RerollEmotion", (int companionID, InteractionController interCon) => 
{
	return interCon.ReRollCompanionEmotion(companionID);
});

app.MapPut("/Interactions/PetCompanion", (int userID, int companionID, InteractionController interCon) => 
{
	return interCon.PetCompanion(userID, companionID);
});

//this is a query parameter, it has a parameter to actually be implemented
app.MapGet("/searchFriend", (string username, UserController controller) => 
{
	return controller.SearchFriend(username);
});

app.MapGet("/viewFriendsPosts", (string username, PostController controller) => 
{
	return controller.GetAllFriendsPosts(username);
});

//this is a route parameter
app.MapGet("/postsBy/{userId}", (int userId, PostController controller) => 
{
	return controller.GetPostsByUserId(userId);
});

app.MapGet("/postsByUser/{username}", (string username, PostController controller) => 
{
	return controller.GetPostsByUsername(username);
});

app.MapGet("/foodsUnder/{userId}", (int userId, ResourceController controller) => 
{
	return controller.GetFoodInventoryByUserId(userId);
});

app.MapGet("/commentsUnder/{postId}", (int postId, CommentController controller) => 
{
	return controller.GetCommentsByPostId(postId);
});

app.MapDelete("/commentsBy/{commentId}", (int commentId, CommentController controller) => 
{
	return controller.RemoveComment(commentId);
});

/*
app.MapPost("/createUser", (User user, IUserDAO repo) => //to be replaced by registerUser
{
	return repo.CreateUser(user);
});*/

app.MapPost("/submitPost", (string Content, int PosterID, PostController controller) => 
{
	return controller.SubmitPostResourceGen(Content, PosterID);
});

app.MapPost("/submitComment", (int commenterID, int postsID, string content, CommentController controller) =>
{
	return controller.SubmitCommentResourceGen(commenterID, postsID, content);
});

app.MapGet("/companions/GetAll", (CompanionController CompControl) => 
{
	return CompControl.GetAllCompanions();
});

app.MapGet("/companions/SearchByCompanionId", (int companionId, CompanionController CompControl) => 
{
	return CompControl.SearchForCompanionById(companionId);
});

app.MapGet("/companions/SearchByUserId", (int userId, CompanionController CompControl) => 
{
	return CompControl.SearchForCompanionByUserId(userId);
});

app.MapPost("/companions/Nickname", (int companionId, string? nickname, CompanionController CompControl) => 
{
	return CompControl.NicknameCompanion(companionId, nickname);
});

app.MapDelete("/companions/DeleteCompanion", (int companionId, CompanionController CompControl) => 
{
    return CompControl.DeleteCompanion(companionId);
});

app.MapPost("/companions/GenerateCompanion", (string username, CompanionController CompControl) => 
{
	return CompControl.GenerateCompanion(username);
});

app.MapGet("/Friends/FriendsList", (int userIdToLookup, FriendsController FriendsControl) => 
{
	return FriendsControl.ViewAllFriends(userIdToLookup);
});

app.MapGet("/Friends/ViewAllRelationships", (FriendsController FriendsControl) => 
{
	return FriendsControl.ViewAllRelationships();
});

app.MapGet("/Friends/SearchByRelationshipId", (int relationshipId, FriendsController FriendsControl) => 
{
	return FriendsControl.SearchByRelationshipId(relationshipId);
});

app.MapGet("/Friends/FriendsByUserIds", (int searchingUserId, int user2BeSearchedFor, FriendsController FriendsControl) => 
{
	return FriendsControl.FriendsByUserIds(searchingUserId, user2BeSearchedFor);
});

app.MapGet("/Friends/ViewAllRelationshipsByStatus", (string status, FriendsController FriendsControl) => 
{
	return FriendsControl.ViewRelationshipsByStatus(status);
});

app.MapGet("/Friends/RelationshipStatusByUserId", (int searchingId, string status, FriendsController FriendsControl) => 
{
	return FriendsControl.CheckRelationshipStatusByUserId(searchingId, status);
});

app.MapGet("/Friends/RelationshipStatusByUsername", (string username, string status, FriendsController FriendsControl) => 
{
	return FriendsControl.CheckRelationshipStatusByUsername(username, status);
});

app.MapPut("/Friends/EditFriendshipStatus", (int editingUserID, int user2BeEdited, string status, FriendsController FriendsControl) => 
{
	return FriendsControl.EditStatus(editingUserID, user2BeEdited, status);
});

app.MapPost("/Friends/AddFriendByUserId", (int userToAddId, int requestReceiver, FriendsController FriendsControl) => 
{
	return FriendsControl.AddFriendByUserId(userToAddId, requestReceiver);
});

app.MapPost("/Friends/AddFriendByUsername", (string userToAdd, string requestReceiver, FriendsController FriendsControl) => 
{
	return FriendsControl.AddFriendByUsername(userToAdd, requestReceiver);
});

app.MapPost("/Liking", (int UserID, int PostID, LikeController _LikeCon) => 
{
	return _LikeCon.AddLikes(UserID,PostID);
});

app.MapPut("/Unliking", (int UserID, int PostID, LikeController _LikeCon) => 
{
	return _LikeCon.RemoveLikes(UserID,PostID);
});

app.MapGet("/Checking", (int PostID, LikeController _LikeCon) => 
{
	return _LikeCon.LikeCount(PostID);
});

app.MapPut("/Resources/Purchase", (int userId, int[] foodQtyArr, int eggQty, ResourceController _resourceCon) => 
{
    return _resourceCon.Purchase(userId, foodQtyArr, eggQty);
});

app.MapPost("/Resources/Addgems", (int userId, int Amount, ResourceController _resourceCon) => 
{
    return _resourceCon.UpdateGems(userId, Amount);
});

app.Run();
