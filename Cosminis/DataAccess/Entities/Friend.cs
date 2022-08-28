using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class Friend
    {
        public int RelationshipId { get; set; }
        public int UserIdFrom { get; set; }
        public int UserIdTo { get; set; }
        public string Status { get; set; } = null!;

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual User UserIdFromNavigation { get; set; } = null!;
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual User UserIdToNavigation { get; set; } = null!;
    }
}
