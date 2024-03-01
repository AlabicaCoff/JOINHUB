using System.ComponentModel.DataAnnotations;

namespace Test.Models
{
    public class Author
    {
        [Key]
        public string Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }

        // Relationships
        public List<Post>? Posts { get; set; }
    }


}
