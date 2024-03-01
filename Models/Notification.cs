using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Test.Areas.Identity.Data;
using Test.Data.Enum;

namespace Test.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public NotificationStatus Status { get; set; }
        public string Link { get; set; }

        // User
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public Notification()
        {
            this.Status = NotificationStatus.unread;
        }
    }
}
