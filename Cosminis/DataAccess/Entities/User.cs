using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class User
    {
        public User()
        {
            Comments = new HashSet<Comment>();
            Companions = new HashSet<Companion>();
            FoodInventories = new HashSet<FoodInventory>();
            FriendUserIdFromNavigations = new HashSet<Friends>();
            FriendUserIdToNavigations = new HashSet<Friends>();
            Orders = new HashSet<Order>();
            Posts = new HashSet<Post>();
            PostIdFks = new HashSet<Post>();
        }

        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime AccountAge { get; set; }
        public int? GoldCount { get; set; }
        public int? EggCount { get; set; }
        public DateTime EggTimer { get; set; }
        public int? Notifications { get; set; }
        public string? AboutMe { get; set; }
        public int? ShowcaseCompanionFk { get; set; }
        public int? GemCount { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Companion? ShowcaseCompanionFkNavigation { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Companion> Companions { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<FoodInventory> FoodInventories { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Friends> FriendUserIdFromNavigations { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Friends> FriendUserIdToNavigations { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Order> Orders { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Post> Posts { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Post> PostIdFks { get; set; }
    }
}
