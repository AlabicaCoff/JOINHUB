using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Test.Models
{
    public class Author
    {
        [Key]
        public string Id { get; set; }
        public string Username { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
        public string FullName { get; set; }

        // Relationships
        [JsonIgnore]
        public List<Post>? Posts { get; set; }
    }


}
