using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Test.Data.Enum;

namespace Test.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Title")]
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }
        [Display(Name = "Description")]
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }
        public DateTime CreatedTime { get; set; }
        [Display(Name = "Expired Date")]
        [Required]
        public DateTime ExpireTime { get; set; }
        public PostStatus Status { get; set; }
        [Display(Name = "Tag")]
        public Tag? Tag { get; set; }
        [Display(Name = "Number of Participants")]
        [Required(ErrorMessage = "Max Number of Participants is required")]
        public int? NumberOfParticipants { get; set; }
        public string? Location { get; set; }

        // Relationships
        public List<Post_Participant>? Post_Participants { get; set; }
        public string? AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public Author? Author { get; set; }

        public Post()
        {
            this.CreatedTime = DateTime.Now;
            this.Status = PostStatus.Active;
        }
    }
}
