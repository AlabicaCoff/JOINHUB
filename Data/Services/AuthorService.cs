using Microsoft.EntityFrameworkCore;
using Test.Models;

namespace Test.Data.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly TestDbContext _context;
        public AuthorService(TestDbContext context)
        {
            _context = context;
        }
        public void Add(Author author)
        {
            _context.Authors.Add(author);
            _context.SaveChanges();
        }

        public void Delete(Author author)
        {
            _context.Authors.Remove(author);
            _context.SaveChanges();
        }

        public IEnumerable<Author> GetAll()
        {
            var result = _context.Authors.ToList();
            return result;
        }

        public Author GetById(string id)
        {
            var result = _context.Authors.SingleOrDefault(a => a.Id == id);
            return result;
        }

        public void Update(string id, Author author)
        {
            _context.Authors.Update(author);
            _context.SaveChanges();
        }
    }
}
