using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using Test.Models;

namespace Test.Data.Services
{
    public class PostService : IPostService
    {
        private readonly TestDbContext _context;
        public PostService(TestDbContext context) 
        {
            _context = context;
        }
        public void Add(Post post)
        {
            _context.Posts.Add(post);
            _context.SaveChanges();
        }

        public void Delete(Post post)
        {
            _context.Posts.Remove(post);
            _context.SaveChanges();
        }

        public IEnumerable<Post> GetAll()
        {
            var result = _context.Posts.ToList();
            return result;
        }

        public IEnumerable<Post> GetAllInclude()
        {
            var result = _context.Posts.Include(a => a.Author).Include(pp => pp.Post_Participants.OrderBy(pp => pp.Id)).ThenInclude(u => u.ApplicationUser);
            return result;
        }

        public Post GetById(int id)
        {
            var result = _context.Posts.SingleOrDefault(p => p.Id == id);
            return result;
        }

        public Post GetByIdInclude(int id)
        {
            var result = _context.Posts.Include(a => a.Author).Include(pp => pp.Post_Participants.OrderBy(pp => pp.Id)).ThenInclude(u => u.ApplicationUser).SingleOrDefault(p => p.Id == id);
            return result;
        }

        public void Update(int id, Post post)
        {
            _context.Posts.Update(post);
            _context.SaveChanges();
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
