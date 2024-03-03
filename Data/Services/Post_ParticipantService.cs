using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Test.Models;

namespace Test.Data.Services
{
    public class Post_ParticipantService : IPost_ParticipantService
    {
        private readonly TestDbContext _context;
        public Post_ParticipantService(TestDbContext context)
        {
            _context = context;
        }
        public void Add(Post_Participant post_participant)
        {
            _context.Post_Participants.Add(post_participant);
            _context.SaveChanges();
        }

        public void Delete(Post_Participant post_participant)
        {
            _context.Post_Participants.Remove(post_participant);
        }

        public IEnumerable<Post_Participant> GetAll()
        {
            var result = _context.Post_Participants.ToList();
            return result;
        }

        public Post_Participant GetById(int id)
        {
            var result = _context.Post_Participants.SingleOrDefault(pp => pp.Id == id);
            return result;
        }

        public void Update(int id, Post_Participant post_participant)
        {
            _context.Post_Participants.Update(post_participant);
            _context.SaveChanges();
        }
    }
}
