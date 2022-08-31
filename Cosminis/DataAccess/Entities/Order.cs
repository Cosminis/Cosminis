using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class Order
    {
        public int OrderId { get; set; }
        public int UserIdFk { get; set; }
        public decimal Cost { get; set; }
        public DateTime TimeOrdered { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual User UserIdFkNavigation { get; set; } = null!;
    }
}
