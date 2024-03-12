using System.ComponentModel.DataAnnotations;
using Test.Areas.Identity.Data;
using System.Text.Json.Serialization;

namespace Test.Models
{
    public class Post_Participant
    {
        [Key]
        [JsonIgnore]
        public int Id { get; set; }
        [JsonIgnore]
        public int PostId { get; set; }

        [JsonIgnore]
        public Post Post { get; set; }

        public string UserId { get; set; }

        [JsonIgnore]
        public ApplicationUser ApplicationUser { get; set; }
    }
}
