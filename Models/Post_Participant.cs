using System.ComponentModel.DataAnnotations;
using Test.Areas.Identity.Data;

namespace Test.Models
{
    public class Post_Participant
    {
        [Key]
        public int Id { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public string UserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
